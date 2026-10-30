"""Procedural music bed + SFX for a Remotion episode, mixed under the VO.

usage: python tools/score.py <Ep.tsx> <lines.json> <vo.wav> <outdir> <chapter secs, comma list> [stamp scene:frame ...]

Reads each one-line scene `const S<n>: Sc = ...` for <Cap|Pill|StatCard|Headline ... at={N}> and
places an SFX at span.from + N (span.from = lineStart - 5, same as the episode). numpy only.
"""
import json, re, sys, wave
from pathlib import Path
import numpy as np

SR, FPS = 48000, 30
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a, d):  # attack secs, exp decay time-constant secs
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-np.maximum(0, x - a) / d)


def bandnoise(n, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)


def conv(x, ir, block=1 << 18):  # overlap-add FFT convolution
    n = len(ir)
    N = 1 << int(np.ceil(np.log2(block + n)))
    H = np.fft.rfft(ir, N)
    out = np.zeros(len(x) + n)
    for i in range(0, len(x), block):
        seg = x[i:i + block]
        y = np.fft.irfft(np.fft.rfft(seg, N) * H, N)[: len(seg) + n - 1]
        out[i:i + len(y)] += y
    return out[: len(x)]


def reverb_ir(sec=2.4, damp=2.8):
    n = int(sec * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * damp)
    # darker tail: smooth progressively
    ir = np.convolve(ir, np.ones(8) / 8, "same")
    ir[0] = 1.5
    return ir / np.abs(ir).sum() * 6


# ---------- SFX ----------
def sfx_pop():
    x = t(0.12)
    f = 950 * np.exp(-x * 14) + 420
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.03)
    y[:60] += rng.standard_normal(60) * 0.3 * np.linspace(1, 0, 60)
    return y * 0.5


def sfx_whoosh(sec=0.45, lo=300, hi=4000):
    n = int(sec * SR)
    a = bandnoise(n, lo, hi * 0.5) * 0.6 + bandnoise(n, lo * 2, hi) * np.linspace(0, 1, n) * 0.6
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return a * e * 0.35


def sfx_hit():  # caption slam: short whoosh into a soft low thump
    pre = sfx_whoosh(0.16, 500, 6000) * 0.7
    x = t(0.5)
    f = 95 * np.exp(-x * 9) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.003, 0.12)
    body += bandnoise(len(x), 60, 1200) * env(len(x), 0.001, 0.03) * 0.35
    return np.concatenate([pre, body * 0.8])


def sfx_boom():  # chapter card
    x = t(1.6)
    f = 70 * np.exp(-x * 4) + 32
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.004, 0.45)
    y += bandnoise(len(x), 40, 900) * env(len(x), 0.002, 0.15) * 0.4
    y = y + conv(y, reverb_ir(1.6, 3.5)) * 0.5
    return np.concatenate([sfx_whoosh(0.5, 200, 3000) * 0.8, y * 0.75])


def sfx_ding():  # stat card
    x = t(1.2)
    y = sum(np.sin(2 * np.pi * fq * x) * a * np.exp(-x * d) for fq, a, d in [(1318.5, 0.5, 3.5), (1975.5, 0.25, 5), (2637, 0.12, 7)])
    h = sfx_hit()
    out = np.zeros(len(h) + len(x))
    out[: len(h)] += h * 0.7
    out[int(0.16 * SR):int(0.16 * SR) + len(x)] += y * 0.5
    return out


def sfx_paper():
    n = int(0.35 * SR)
    return bandnoise(n, 1500, 9000) * env(n, 0.05, 0.08) * 0.25


def sfx_stamp():
    x = t(0.35)
    y = np.sin(2 * np.pi * 70 * x) * env(len(x), 0.001, 0.06) + bandnoise(len(x), 200, 3000) * env(len(x), 0.001, 0.025) * 0.8
    return y * 0.6


def sfx_tick():  # scene change: tiny airy swish
    return sfx_whoosh(0.3, 1200, 9000) * 0.45


# ---------- music ----------
NOTE = {"A": 57, "B": 59, "C": 48, "D": 50, "E": 52, "F": 53, "G": 55}


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


CHORDS = {  # midi: root (bass) + pad voicing
    "Am": (45, [57, 60, 64, 69]), "F": (41, [57, 60, 65, 69]), "C": (36, [55, 60, 64, 67]),
    "E": (40, [56, 59, 64, 68]), "Dm": (38, [57, 62, 65, 69]), "G": (43, [55, 59, 62, 67]),
    "Fmaj7": (41, [57, 60, 64, 65]),
}
TENSE = ["Am", "F", "C", "E"]
CALM = ["Fmaj7", "C", "Am", "G"]


def music(total, chapters):
    bpm = 84
    beat = 60 / bpm
    bar = beat * 4
    N = int(total * SR)
    pad, bass, arp, hat, fx = (np.zeros(N) for _ in range(5))
    bounds = chapters + [total]
    # per-section (prog, pulse, arp, hat) intensities
    style = [(TENSE, 1, 1, 1), (TENSE, .6, 1, 0), (TENSE, 1, 1, 1), (TENSE, 1, .7, 1),
             (TENSE, .8, 1, .6), (CALM, 0, .8, 0), (TENSE, .8, 1, .7), (CALM, .4, .7, 0)]
    for si in range(len(chapters)):
        s0, s1 = bounds[si], bounds[si + 1]
        prog, pul, ar, hh = style[min(si, len(style) - 1)]
        k = 0
        tb = s0
        while tb < s1 - 0.01:
            name = prog[k % len(prog)]
            root, voic = CHORDS[name]
            dur = min(bar * 2, s1 - tb)
            i0, n = int(tb * SR), int((dur + 1.2) * SR)
            n = min(n, N - i0)
            x = np.arange(n) / SR
            e = np.minimum(1, x / 0.9) * np.clip((dur + 1.2 - x) / 1.2, 0, 1)
            v = np.zeros(n)
            for m in voic:
                for det in (-0.12, 0, 0.12):
                    f0 = hz(m + det)
                    v += np.sin(2 * np.pi * f0 * x + rng.uniform(0, 6.28)) + 0.3 * np.sin(4 * np.pi * f0 * x) + 0.1 * np.sin(6 * np.pi * f0 * x)
            pad[i0:i0 + n] += v * e * 0.022 * (1 + 0.15 * np.sin(2 * np.pi * x / 5))
            # bass pulse on 8ths
            if pul:
                for j in range(int(dur / (beat / 2))):
                    st = int((tb + j * beat / 2) * SR)
                    L = int(0.35 * SR)
                    if st + L > N:
                        break
                    xx = np.arange(L) / SR
                    acc = 1 if j % 2 == 0 else 0.6
                    bass[st:st + L] += (np.sin(2 * np.pi * hz(root) * xx) + 0.25 * np.sin(4 * np.pi * hz(root) * xx)) * env(L, 0.006, 0.09) * 0.09 * acc * pul
            # arp: chord tones up an octave, 8ths, sparse
            if ar:
                tones = [m + 12 for m in voic]
                pat = [0, 2, 1, 3, 2, 1, 3, 2]
                for j in range(int(dur / (beat / 2))):
                    if rng.random() > 0.55 + 0.3 * ar:
                        continue
                    st = int((tb + j * beat / 2) * SR)
                    L = int(0.9 * SR)
                    if st + L > N:
                        break
                    xx = np.arange(L) / SR
                    f0 = hz(tones[pat[j % 8]])
                    arp[st:st + L] += (np.sin(2 * np.pi * f0 * xx) + 0.2 * np.sin(4 * np.pi * f0 * xx)) * env(L, 0.003, 0.22) * 0.05 * ar
            if hh:
                for j in range(int(dur / (beat / 2))):
                    st = int((tb + j * beat / 2 + (beat / 4 if j % 2 else 0)) * SR)
                    L = int(0.05 * SR)
                    if st + L > N:
                        break
                    hat[st:st + L] += bandnoise(L, 6000, 14000) * env(L, 0.001, 0.012) * 0.03 * hh
            tb += dur
            k += 1
        # riser into the next chapter + soft boom handled by SFX
        if si + 1 < len(chapters):
            L = int(2.5 * SR)
            st = int(s1 * SR) - L
            if st > 0:
                fx[st:st + L] += bandnoise(L, 400, 7000) * np.linspace(0, 1, L) ** 3 * 0.09
    wet = conv(pad + arp, reverb_ir(2.8, 2.2))
    mix = pad * 0.7 + arp * 0.6 + wet * 0.55 + bass + hat + fx
    # fade in / out
    fi, fo = int(1.5 * SR), int(4 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)
    mix[-fo:] *= np.linspace(1, 0, fo)
    return mix


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def main():
    tsx, lines_p, vo_p, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4])
    chapters = [float(c) for c in sys.argv[5].split(",")]
    stamps = [tuple(map(int, a.split(":"))) for a in sys.argv[6:]]
    out.mkdir(parents=True, exist_ok=True)
    L = json.loads(lines_p.read_text(encoding="utf-8"))
    fr = lambda s: round(s * FPS)
    src = tsx.read_text(encoding="utf-8")
    scenes = {int(m.group(1)): m.group(2) for m in re.finditer(r"^const S(\d+): Sc = (.*)$", src, re.M)}
    n_sc = len(L)
    froms = [0] + [fr(L[i]["start"]) - 5 for i in range(1, n_sc)]

    w = wave.open(str(vo_p))
    assert w.getframerate() == SR and w.getsampwidth() == 2
    vo = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, w.getnchannels()).mean(1) / 32768
    total = max(len(vo) / SR, (fr(L[-1]["end"] + 1.5)) / FPS)
    N = int(total * SR) + SR

    lib = {"pop": sfx_pop(), "hit": sfx_hit(), "boom": sfx_boom(), "ding": sfx_ding(), "paper": sfx_paper(), "stamp": sfx_stamp(), "tick": sfx_tick()}
    # sound starts so the transient lands on the visual (pre-roll for whooshy ones)
    pre = {"hit": 0.16 - 5 / FPS, "boom": 0.5, "ding": 0.0, "pop": -1 / FPS, "paper": 0.0, "stamp": -5 / FPS, "tick": 0.12}
    gain = {"pop": 0.5, "hit": 0.55, "boom": 0.6, "ding": 0.6, "paper": 0.6, "stamp": 0.7, "tick": 0.35}
    events = []
    for i in range(n_sc):
        body = scenes.get(i + 1, "")
        base = froms[i]
        if i > 0:
            events.append((base, "tick"))
        for m in re.finditer(r"<(Cap|Pill|StatCard|Headline)\b([^>]*?)/>", body):
            kind, props = m.group(1), m.group(2)
            a = re.search(r"\bat=\{(\d+)\}", props)
            at = int(a.group(1)) if a else 0
            tm = re.search(r'\bt="([^"]*)"', props)
            label = tm.group(1) if tm else ""
            snd = {"Cap": "hit", "Pill": "pop", "StatCard": "ding", "Headline": "paper"}[kind]
            if kind == "Pill" and label.startswith("CHAPTER"):
                snd = "boom"
            events.append((base + at, snd))
    for sc, f in stamps:
        events.append((froms[sc - 1] + f, "stamp"))
    # drop scene ticks that collide with a bigger sound
    big = [f for f, s in events if s in ("hit", "boom", "ding")]
    events = [(f, s) for f, s in events if not (s == "tick" and any(abs(f - b) < 12 for b in big))]
    # thin out pops that pile up within 8 frames
    events.sort()
    kept, last = [], {}
    for f, s in events:
        if s == "pop" and f - last.get("pop", -99) < 8:
            continue
        kept.append((f, s))
        last[s] = f
    sfx = np.zeros(N)
    for f, s in kept:
        y = lib[s] * gain[s]
        st = int((f / FPS - pre[s]) * SR)
        st = max(0, st)
        e = min(N, st + len(y))
        sfx[st:e] += y[: e - st]

    mus = music(total, chapters)
    mus = np.pad(mus, (0, N - len(mus)))
    vo = np.pad(vo, (0, N - len(vo)))
    # duck the music under speech (-5 dB) with smooth attack/release
    win = int(0.05 * SR)
    lvl = np.sqrt(np.convolve(vo ** 2, np.ones(win) / win, "same"))
    speak = (lvl > 0.01).astype(float)
    hop = 480
    s_ds = speak[::hop]
    g = np.zeros_like(s_ds)
    for i in range(1, len(s_ds)):
        k = 0.35 if s_ds[i] > g[i - 1] else 0.03  # fast attack, slow release
        g[i] = g[i - 1] + (s_ds[i] - g[i - 1]) * k
    g = np.interp(np.arange(N), np.arange(len(g)) * hop, g)
    duck = 10 ** (-5 * g / 20)

    vo_db = rms_db(vo[vo != 0]) if np.any(vo) else -20
    mus *= 10 ** ((vo_db - 10 - rms_db(mus)) / 20)  # bed lands ~15 LU under the voice after ducking
    sfx *= 0.45 * np.abs(vo).max() / (np.abs(sfx).max() + 1e-9)  # loudest SFX peaks well under the voice
    mix = vo + mus * duck + sfx
    peak = np.abs(mix).max()
    if peak > 0.97:
        mix *= 0.97 / peak

    def write(p, x):
        x = np.clip(x, -1, 1)
        st = (np.repeat(x[:, None], 2, 1) * 32767).astype(np.int16)
        with wave.open(str(p), "wb") as o:
            o.setnchannels(2), o.setsampwidth(2), o.setframerate(SR), o.writeframes(st.tobytes())

    write(out / "music.wav", mus * duck)
    write(out / "sfx.wav", sfx)
    write(out / "mix.wav", mix)
    for k, v in lib.items():
        write(out / f"sfx_{k}.wav", v / (np.abs(v).max() + 1e-9) * 0.8)
    cnt = {}
    for _, s in kept:
        cnt[s] = cnt.get(s, 0) + 1
    print(f"total {total:.1f}s, events {len(kept)} {cnt}, vo {vo_db:.1f} dB, music {rms_db(mus):.1f} dB, peak {peak:.2f}")


if __name__ == "__main__":
    main()
