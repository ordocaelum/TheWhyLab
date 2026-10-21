# Doc (host): APPROVED v2 (2026-10-20)

- **Component:** `sick-on-purpose/anim/src/doc2.tsx → DocV2` (props: x, y, s, f, talk, point, look). It moves into the shared asset library when that's set up.
- **Tier:** hero (ASSETS humans/hero).
- **Previews:** `doc_v2_baseline.png` (approved), `doc_v1_vs_v2.png`, `doc_v1_baseline.png` (retired).
- **User note:** "v1 has a certain charm." Keep v2's detail, but protect the charm: simple readable silhouette, friendly round glasses, big expressive brows. Don't over-render the face.
- **Optional later tweaks (not required):** rounded shoulder seams, a relaxed arm bend or hand-in-pocket pose, head about 8% smaller.
- **Expressions: APPROVED (2026-10-20).** 7 via the `expr` prop: neutral, happy, surprised, thinking, skeptical, unamused, serious. Sheet: `doc_v2_expressions.png`. Talking (`talk`) layers on top of any expression.
  - Use: neutral = explaining · happy = reveals · surprised = twists · thinking = posing a question · skeptical = doubting a claim or side-eyeing Cell · unamused = deadpan at Cell's jokes · serious = sensitive topics.
- **Poses: APPROVED (2026-10-20).** 8 via the `pose` prop: idle, present, point, chin, crossed, hips, shrug, walk (animated). Sheet: `doc_v2_poses.png`. They combine freely with `expr`.
- **Doc is complete** and is the template for every other human (`human2.tsx`).
