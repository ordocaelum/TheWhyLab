"""Stitch a two-voice episode (DOC + CELL) into one voice track, in script order.

Usage:  python tools/stitch.py motion/<slug>

Needs: <slug>/script.md (DOC:/CELL: lines under '## ' sections),
       <slug>/elevenlabs/DOC_NN*.mp3  (one per section with DOC lines, NN = order)
       <slug>/elevenlabs/CELL*.mp3    (all CELL lines in one take)
Writes: <slug>/vo_full.wav  and  <slug>/lines.json  (per line: speaker, text, start, end in the final track)
"""
import difflib
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

spec = importlib.util.spec_from_file_location("build", Path(__file__).with_name("build.py"))
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)

GAP = 0.30          # between consecutive lines of the same speaker
BEFORE_CELL = 0.35  # lead-in to a Cell interruption
AFTER_CELL = 0.70   # beat after a Cell line (room for Doc's deadpan reaction)
SECTION = 0.90      # between chapters
PAD_IN, PAD_OUT = 0.06, 0.12


def parse(script):
    lines, sec = [], -1
    for raw in script.splitlines():
        if raw.startswith("## "):
            sec += 1
        m = re.match(r"^(DOC|CELL): (.+)$", raw)
        if m:
            t = re.sub(r"\s*(\[(C\d+|op)\])+", "", m.group(2)).replace("*", "").strip()
            lines.append({"who": m.group(1), "text": t, "sec": sec})
    return lines


def time_lines(audio, group):
    """Return [(start, end)] for each line in group within one audio file, cut in the gaps."""
    toks = [t for l in group for t in l["text"].split()]
    heard = b.transcribe(audio)
    words = b.align(toks, heard, b.duration(audio))
    total = b.duration(audio)
    spans, k = [], 0
    for l in group:
        n = len(l["text"].split())
        spans.append([words[k]["start"], words[k + n - 1]["end"]])
        k += n
    # extend each span halfway into the neighbouring silence, plus padding
    for i, s in enumerate(spans):
        lo = 0 if i == 0 else (spans[i - 1][1] + s[0]) / 2
        hi = total if i == len(spans) - 1 else (s[1] + spans[i + 1][0]) / 2
        s[0] = max(lo, s[0] - PAD_IN)
        s[1] = min(hi, s[1] + PAD_OUT)
    heard_txt = " ".join(w["w"] for w in heard)
    norm = lambda s: re.sub(r"[^a-z0-9' ]", "", s.lower()).split()
    sim = difflib.SequenceMatcher(None, norm(" ".join(toks)), norm(heard_txt), autojunk=False).ratio()
    return spans, sim, heard_txt


def main():
    d = Path(sys.argv[1]).resolve()
    el = d / "elevenlabs"
    lines = parse((d / "script.md").read_text(encoding="utf-8"))
    secs = sorted({l["sec"] for l in lines if l["who"] == "DOC"})
    doc_files = sorted(el.glob("DOC_*.mp3"))
    cell_file = next(iter(sorted(el.glob("CELL*.mp3"))), None)
    if len(doc_files) != len(secs):
        sys.exit(f"expected {len(secs)} DOC mp3s, found {len(doc_files)}")

    for f, sec in zip(doc_files, secs):
        group = [l for l in lines if l["who"] == "DOC" and l["sec"] == sec]
        spans, sim, _ = time_lines(f, group)
        print(f"  {f.name}: {len(group)} lines, match {sim:.0%}")
        for l, s in zip(group, spans):
            l["src"], l["a"], l["b"] = f, *s
    cells = [l for l in lines if l["who"] == "CELL"]
    if cells:
        spans, sim, heard = time_lines(cell_file, cells)
        print(f"  {cell_file.name}: {len(cells)} lines, match {sim:.0%}")
        for l, s in zip(cells, spans):
            l["src"], l["a"], l["b"] = cell_file, *s

    # assemble with ffmpeg: one filter graph, trims + silences in order
    work = d / "build_vo"
    work.mkdir(exist_ok=True)
    srcs = sorted({str(l["src"]) for l in lines})
    idx = {s: i for i, s in enumerate(srcs)}
    parts, filt, t = [], [], 0.0
    for i, l in enumerate(lines):
        prev = lines[i - 1] if i else None
        gap = 0.0 if not prev else SECTION if prev["sec"] != l["sec"] else \
            BEFORE_CELL if l["who"] == "CELL" else AFTER_CELL if prev["who"] == "CELL" else GAP
        if gap:
            filt.append(f"anullsrc=r=48000:cl=stereo,atrim=0:{gap}[g{i}]")
            parts.append(f"[g{i}]")
            t += gap
        filt.append(f"[{idx[str(l['src'])]}:a]atrim={l['a']:.3f}:{l['b']:.3f},asetpts=PTS-STARTPTS,"
                    f"aresample=48000,aformat=channel_layouts=stereo[s{i}]")
        parts.append(f"[s{i}]")
        l["start"] = round(t, 3)
        t += l["b"] - l["a"]
        l["end"] = round(t, 3)
    filt.append(f"{''.join(parts)}concat=n={len(parts)}:v=0:a=1,loudnorm=I=-16:TP=-1:LRA=11[out]")
    graph = work / "graph.txt"
    graph.write_text(";\n".join(filt), encoding="utf-8")
    cmd = [b.FF, "-hide_banner", "-loglevel", "error", "-y"]
    for s in srcs:
        cmd += ["-i", s]
    cmd += ["-filter_complex_script", str(graph), "-map", "[out]", "-ar", "48000", str(d / "vo_full.wav")]
    subprocess.run(cmd, check=True)

    out = [{"n": i + 1, "who": l["who"], "text": l["text"], "start": l["start"], "end": l["end"]} for i, l in enumerate(lines)]
    (d / "lines.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    print(f"done -> {d / 'vo_full.wav'}  ({t / 60:.1f} min, {len(lines)} lines)")


if __name__ == "__main__":
    main()
