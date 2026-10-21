"""Build a Zack D. Films-style short from a folder containing shots.json.

Usage:  python tools/build.py shorts/001-swallow-gum [--force-tts]

Folder layout it expects (anything missing is handled):
  shots.json          script + shot list (see PLAYBOOK.md)
  stills/NN.png       image for shot NN    (type "still" -> slow zoom)
  clips/NN.mp4        video for shot NN    (type "video"; falls back to the still)
  audio/music.mp3     optional background music (auto-ducked under the voice)
  sfx/NN.mp3          optional sound effect, played at the start of shot NN

Steps: narration per line (edge-tts, with word timings) -> each shot cut to its
line's length -> concat -> mix audio -> karaoke captions -> final.mp4
"""
import argparse
import asyncio
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

W, H, FPS = 1080, 1920, 30
STYLE = ("3D CGI render, stylized realistic medical animation, smooth plastic-like skin, "
         "soft even studio lighting, plain soft gradient background, shallow depth of field, "
         "clean and minimal, vertical 9:16 composition")


def find_ffmpeg():
    exe = os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found: install it, set FFMPEG, or `pip install imageio-ffmpeg`")


FF = find_ffmpeg()


def ff(*args, cwd=None):
    cmd = [FF, "-hide_banner", "-loglevel", "error", "-y", *map(str, args)]
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"ffmpeg failed:\n{' '.join(cmd)}\n{r.stderr}")


def duration(path):
    r = subprocess.run([FF, "-hide_banner", "-i", str(path), "-f", "null", "-"],
                       capture_output=True, text=True)
    times = re.findall(r"time=(\d+):(\d+):([\d.]+)", r.stderr)
    h, m, s = times[-1]
    return int(h) * 3600 + int(m) * 60 + float(s)


# ---------- narration ----------

async def tts(text, voice, rate, mp3, words_json):
    import edge_tts
    com = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    audio, words = bytearray(), []
    async for chunk in com.stream():
        if chunk["type"] == "audio":
            audio += chunk["data"]
        elif chunk["type"] == "WordBoundary":
            words.append({"w": chunk["text"],
                          "start": chunk["offset"] / 1e7,
                          "end": (chunk["offset"] + chunk["duration"]) / 1e7})
    mp3.write_bytes(audio)
    words_json.write_text(json.dumps(words, indent=1))


SAPI_PS = r"""
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
if ($env:TTS_VOICE) { try { $s.SelectVoice($env:TTS_VOICE) } catch {} }
$s.Rate = [int]$env:TTS_RATE
$global:w = New-Object System.Collections.ArrayList
$s.add_SpeakProgress({ param($o, $e) [void]$global:w.Add(@{ w = $e.Text; start = $e.AudioPosition.TotalSeconds }) })
$s.SetOutputToWaveFile($env:TTS_OUT)
$s.Speak($env:TTS_TEXT)
$s.Dispose()
ConvertTo-Json -InputObject @($global:w) | Set-Content -Encoding utf8 $env:TTS_JSON
"""


def tts_sapi(text, cfg, wav, words_json):
    """Offline Windows voice. Robotic, but always available."""
    env = {**os.environ, "TTS_TEXT": text, "TTS_OUT": str(wav), "TTS_JSON": str(words_json),
           "TTS_VOICE": cfg.get("sapi_voice", ""), "TTS_RATE": str(cfg.get("sapi_rate", 1))}
    subprocess.run(["powershell", "-NoProfile", "-Command", SAPI_PS], env=env, check=True)
    words = json.loads(words_json.read_text(encoding="utf-8-sig"))
    total = duration(wav)
    for i, w in enumerate(words):
        w["end"] = words[i + 1]["start"] if i + 1 < len(words) else total
    words_json.write_text(json.dumps(words, indent=1))


def clean(tok):
    return re.sub(r"[^\w'%-]", "", tok)


def estimate_words(text, dur):
    """Fallback word timings: spread words by length."""
    toks = text.split()
    lead, tail = 0.08, 0.12
    span = max(dur - lead - tail, 0.1)
    weights = [len(re.sub(r"\W", "", t)) + 2 for t in toks]
    t, out = lead, []
    for tok, wt in zip(toks, weights):
        d = span * wt / sum(weights)
        out.append({"w": clean(tok), "start": t, "end": t + d})
        t += d
    return out


_WHISPER = None


def transcribe(path):
    """Real word timings from the audio (faster-whisper, CPU)."""
    global _WHISPER
    from faster_whisper import WhisperModel
    if _WHISPER is None:
        print("  loading whisper (first run downloads the model)")
        _WHISPER = WhisperModel("small.en", device="cpu", compute_type="int8")
    import numpy as np  # decode with our ffmpeg (faster-whisper's PyAV decoder is version-fragile)
    pcm = subprocess.run([FF, "-v", "error", "-i", str(path), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
    segs, _ = _WHISPER.transcribe(audio, word_timestamps=True, language="en")
    return [{"w": w.word.strip(), "start": w.start, "end": w.end} for s in segs for w in s.words]


def align(tokens, heard, total):
    """Give each script word the timing of the matching heard word; interpolate misses.
    Captions keep the script's spelling, timing comes from the audio."""
    import difflib
    norm = lambda t: re.sub(r"[^a-z0-9']", "", t.lower())
    times = [None] * len(tokens)
    sm = difflib.SequenceMatcher(None, [norm(t) for t in tokens], [norm(w["w"]) for w in heard], autojunk=False)
    for b in sm.get_matching_blocks():
        for k in range(b.size):
            times[b.a + k] = (heard[b.b + k]["start"], heard[b.b + k]["end"])
    i = 0
    while i < len(times):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(times) and times[j] is None:
            j += 1
        lo = times[i - 1][1] if i else (heard[0]["start"] if heard else 0.0)
        hi = times[j][0] if j < len(times) else (heard[-1]["end"] if heard else total)
        step = max(hi - lo, 0.05 * (j - i)) / (j - i)
        for k in range(i, j):
            times[k] = (lo + step * (k - i), lo + step * (k - i + 1))
        i = j
    return [{"w": clean(t), "start": s, "end": e} for t, (s, e) in zip(tokens, times)]


def cached_words(audio, tokens, cache):
    """Align once per audio file; reuse until the file or script changes."""
    sig = f"{audio.stat().st_size}|{audio.stat().st_mtime_ns}|{' '.join(tokens)}"
    if cache.exists():
        c = json.loads(cache.read_text())
        if c.get("sig") == sig:
            return c["words"]
    print(f"  aligning {audio.name}")
    try:
        words = align(tokens, transcribe(audio), duration(audio))
    except ImportError:
        print("  (pip install faster-whisper for exact timing; estimating)")
        words = estimate_words(" ".join(tokens), duration(audio))
    cache.write_text(json.dumps({"sig": sig, "words": words}, indent=1))
    return words


def split_full(d, cfg, full):
    """One long voiceover -> one clip per line, cut in the pauses between lines."""
    split = d / "audio" / "split"
    split.mkdir(exist_ok=True)
    lines = [s["line"].split() for s in cfg["shots"]]
    words = cached_words(full, [t for l in lines for t in l], split / "align.json")
    total = duration(full)
    bounds, k = [], 0
    for l in lines:
        bounds.append((words[k]["start"], words[k + len(l) - 1]["end"]))
        k += len(l)
    cuts = [0.0] + [(bounds[i - 1][1] + bounds[i][0]) / 2 for i in range(1, len(bounds))] + [total]
    k = 0
    for i, s in enumerate(cfg["shots"]):
        out = split / f'vo_{s["id"]}.wav'
        a, b = cuts[i], cuts[i + 1]
        if not out.exists() or out.stat().st_mtime < full.stat().st_mtime or (split / "align.json").stat().st_mtime > out.stat().st_mtime:
            ff("-i", full, "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-ar", "48000", out)
        n = len(lines[i])
        s["vo"] = out
        s["words"] = [{**w, "start": w["start"] - a, "end": w["end"] - a} for w in words[k:k + n]]
        k += n
        s["dur"] = round(b - a, 3)


def narrate(d, cfg, force):
    """Narration, in priority order:
    1. audio/vo_full.mp3  - one long voiceover (e.g. ElevenLabs); split per line automatically
    2. audio/vo_NN.mp3    - your own file per line
    3. generated TTS      - edge-tts, falling back to the offline Windows voice
    Timings for your own audio come from Whisper, so cuts and captions sync automatically."""
    a = d / "audio"
    a.mkdir(exist_ok=True)
    full = next((p for e in ("mp3", "wav", "m4a") for p in sorted(a.glob(f"vo_full*.{e}"))), None)
    if full:
        print(f"  using {full.name}")
        split_full(d, cfg, full)
        return
    engine = cfg.get("tts", "edge")
    for s in cfg["shots"]:
        sid = s["id"]
        user = next((p for p in (a / f"vo_{sid}.{e}" for e in ("mp3", "wav", "m4a"))
                     if p.exists() and not (a / f"vo_{sid}.key").exists()), None)
        if user:
            s["vo"] = user
            s["words"] = cached_words(user, s["line"].split(), a / f"vo_{sid}.align.json")
        else:
            key = hashlib.md5(f'{engine}|{cfg.get("voice")}|{cfg.get("rate")}|{s["line"]}'.encode()).hexdigest()[:10]
            kf, wj = a / f"vo_{sid}.key", a / f"vo_{sid}.json"
            out = a / f"vo_{sid}.{'wav' if engine == 'sapi' else 'mp3'}"
            if force or not out.exists() or not kf.exists() or kf.read_text() != key:
                print(f'  tts[{engine}] {sid}: {s["line"]}')
                if engine == "sapi":
                    tts_sapi(s["line"], cfg, out, wj)
                else:
                    try:
                        asyncio.run(tts(s["line"], cfg["voice"], cfg["rate"], out, wj))
                    except Exception as e:  # service blocked -> offline voice
                        print(f"  edge-tts failed ({type(e).__name__}); switching to offline Windows voice")
                        engine = cfg["tts"] = "sapi"
                        out = a / f"vo_{sid}.wav"
                        key = hashlib.md5(f'sapi|{cfg.get("voice")}|{cfg.get("rate")}|{s["line"]}'.encode()).hexdigest()[:10]
                        tts_sapi(s["line"], cfg, out, wj)
                kf.write_text(key)
            s["vo"], s["words"] = out, json.loads(wj.read_text())
        s["dur"] = round(duration(s["vo"]) + cfg.get("gap", 0.15), 3)


# ---------- video ----------

FIT = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"


def render_shot(d, s, out):
    dur, frames = s["dur"], round(s["dur"] * FPS)
    # several lines can share one clip: "clip": "A", "start": 2.5 (seconds into it), "speed": 0.5 (slow-mo)
    clip = d / "clips" / f'{s.get("clip", s["id"])}.mp4'
    still = d / "stills" / f'{s["id"]}.png'
    enc = ["-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-an"]
    if s.get("type") == "video" and clip.exists():
        speed = s.get("speed", 1)
        push = s.get("push", 0)  # extra slow zoom-in, e.g. 0.15
        zoom = (f",scale={W*2}:{H*2},zoompan=z='1+{push / frames}*on':x='iw/2-(iw/zoom/2)'"
                f":y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS}") if push else ""
        # freeze the last frame if the clip runs out before the line ends
        ff("-ss", s.get("start", 0), "-i", clip, "-vf",
           f"setpts=PTS/{speed},{FIT},fps={FPS}{zoom},tpad=stop_mode=clone:stop_duration={dur}",
           "-t", dur, *enc, out)
    elif still.exists():
        rate = 0.15 / frames  # ~15% zoom over the shot
        z = f"1+{rate}*on" if s.get("zoom", "in") == "in" else f"1.15-{rate}*on"
        ff("-loop", "1", "-i", still, "-vf",
           f"scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
           f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},setsar=1",
           "-frames:v", frames, *enc, out)
    else:
        print(f'  ! shot {s["id"]}: no media yet, using placeholder')
        ff("-f", "lavfi", "-i", f"color=c=0x1e2430:s={W}x{H}:r={FPS}:d={dur}", *enc, out)


# ---------- captions ----------

def ass_time(t):
    cs = round(t * 100)
    return f"{cs // 360000}:{cs // 6000 % 60:02}:{cs // 100 % 60:02}.{cs % 100:02}"


def captions(d, cfg, out):
    words = []
    for s in cfg["shots"]:
        words += [{**w, "start": w["start"] + s["t0"], "end": w["end"] + s["t0"]} for w in s["words"]]
    # chunks of <=3 words, breaking at pauses
    chunks, cur = [], []
    for w in words:
        if cur and (len(cur) == 3 or w["start"] - cur[-1]["end"] > 0.25):
            chunks.append(cur)
            cur = []
        cur.append(w)
    if cur:
        chunks.append(cur)

    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Arial Black,92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,7,3,2,60,60,560,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for ci, ch in enumerate(chunks):
        chunk_end = chunks[ci + 1][0]["start"] if ci + 1 < len(chunks) else ch[-1]["end"] + 0.4
        for i, w in enumerate(ch):
            start = w["start"]
            end = ch[i + 1]["start"] if i + 1 < len(ch) else chunk_end
            parts = []
            for j, x in enumerate(ch):
                t = x["w"].upper()
                if j == i:  # active word: yellow + quick pop
                    t = (r"{\c&H00E5FF&\fscx100\fscy100\t(0,70,\fscx118\fscy118)\t(70,150,\fscx108\fscy108)}"
                         + t + r"{\c&HFFFFFF&\fscx100\fscy100}")
                parts.append(t)
            pop = r"{\fad(40,0)}" if i == 0 else ""
            lines.append(f"Dialogue: 0,{ass_time(start)},{ass_time(end)},Cap,,0,0,0,,{pop}{' '.join(parts)}")
    out.write_text(head + "\n".join(lines) + "\n", encoding="utf-8")


# ---------- audio ----------

def mix_audio(d, cfg, out):
    inputs, filt, labels = [], [], []
    for i, s in enumerate(cfg["shots"]):
        inputs += ["-i", s["vo"]]
        filt.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={s['dur']}[v{i}]")
        labels.append(f"[v{i}]")
    n = len(cfg["shots"])
    filt.append(f"{''.join(labels)}concat=n={n}:v=0:a=1[vo]")
    total = sum(s["dur"] for s in cfg["shots"])
    idx, extra = n, []

    for s in cfg["shots"]:  # sound effects at shot starts
        sfx = d / "sfx" / f'{s["id"]}.mp3'
        if sfx.exists():
            inputs += ["-i", sfx]
            ms = round(s["t0"] * 1000)
            filt.append(f"[{idx}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms},volume=0.6[s{idx}]")
            extra.append(f"[s{idx}]")
            idx += 1

    music = d / "audio" / "music.mp3"
    if music.exists():
        inputs += ["-stream_loop", "-1", "-i", music]
        filt.append("[vo]asplit=2[vo][sc]")
        filt.append(f"[{idx}:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.3,atrim=0:{total}[m]")
        filt.append("[m][sc]sidechaincompress=threshold=0.04:ratio=8:attack=20:release=300[duck]")
        extra.append("[duck]")

    mix = f"[vo]{''.join(extra)}amix=inputs={1 + len(extra)}:duration=first:normalize=0" if extra else "[vo]anull"
    filt.append(f"{mix},loudnorm=I=-14:TP=-1:LRA=11[a]")
    ff(*inputs, "-filter_complex", ";".join(filt), "-map", "[a]", "-t", total,
       "-c:a", "aac", "-b:a", "192k", out)


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("short")
    ap.add_argument("--force-tts", action="store_true")
    ap.add_argument("--no-captions", action="store_true", help="skip burned-in captions (add them in CapCut)")
    a = ap.parse_args()
    d = Path(a.short).resolve()
    cfg = json.loads((d / "shots.json").read_text(encoding="utf-8-sig"))
    build = d / "build"
    build.mkdir(exist_ok=True)

    print("narration")
    narrate(d, cfg, a.force_tts)
    t = 0.0
    for s in cfg["shots"]:
        s["t0"], t = t, t + s["dur"]
    print(f"  total {t:.1f}s")

    print("shots")
    concat = []
    for s in cfg["shots"]:
        out = build / f'shot_{s["id"]}.mp4'
        render_shot(d, s, out)
        concat.append(f"file '{out.name}'")
    (build / "list.txt").write_text("\n".join(concat) + "\n")
    ff("-f", "concat", "-safe", "0", "-i", "list.txt", "-c", "copy", "video.mp4", cwd=build)

    print("audio")
    mix_audio(d, cfg, build / "mix.m4a")

    print("final")
    if a.no_captions:  # captions done in CapCut instead
        ff("-i", "video.mp4", "-i", "mix.m4a", "-c", "copy", "-movflags", "+faststart",
           "-shortest", "../final.mp4", cwd=build)
    else:
        captions(d, cfg, build / "captions.ass")
        ff("-i", "video.mp4", "-i", "mix.m4a", "-vf", "ass=captions.ass",
           "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
           "-c:a", "copy", "-movflags", "+faststart", "-shortest", "../final.mp4", cwd=build)
    print(f"done -> {d / 'final.mp4'}")


if __name__ == "__main__":
    main()
