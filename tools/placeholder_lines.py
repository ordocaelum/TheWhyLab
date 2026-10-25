"""Estimate lines.json from script.md before any voice exists (2.6 words/s), using stitch.py's gaps.
Usage: python tools/placeholder_lines.py motion/<slug>   -> <slug>/lines.json (marked placeholder)"""
import importlib.util, json, sys
from pathlib import Path
spec = importlib.util.spec_from_file_location("stitch", Path(__file__).with_name("stitch.py"))
st = importlib.util.module_from_spec(spec); spec.loader.exec_module(st)
d = Path(sys.argv[1]).resolve()
lines = st.parse((d / "script.md").read_text(encoding="utf-8"))
t, out = 0.0, []
for i, l in enumerate(lines):
    prev = lines[i - 1] if i else None
    gap = 0.0 if not prev else st.SECTION if prev["sec"] != l["sec"] else \
        st.BEFORE_CELL if l["who"] == "CELL" else st.AFTER_CELL if prev["who"] == "CELL" else st.GAP
    t += gap
    dur = len(l["text"].split()) / 2.6 + 0.3
    out.append({"n": i + 1, "who": l["who"], "text": l["text"], "start": round(t, 2), "end": round(t + dur, 2), "placeholder": True})
    t += dur
(d / "lines.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
print(f"{len(out)} lines, ~{t/60:.1f} min (placeholder)")
