# Process log: "Why Your Body Makes You Feel Sick on Purpose"

The running record of how this episode was made, following `motion/RESEARCH.md` → `DESIGN.md` → `STYLING.md`. Each step adds a dated entry.

## Step 1: Pick (2026-10-14)
Score (RESEARCH §1): personal stakes 5, surprise 5, can be drawn 4, evidence depth 5, demand 4, not already taken 3 (Kurzgesagt's "Fever" covers fever; our angle is the whole *behaviour* package: tiredness, appetite loss, withdrawal, low mood) = **26/30** ✅.
Picked by the user from the backlog.

## Step 2: Brief (2026-10-14)
- **Question:** Why does being sick feel so awful? Is it the germs, or is it you?
- **Suspected turn:** Most of what makes you *feel* sick (exhaustion, no appetite, wanting to be alone, low mood) isn't damage from the germ. Your immune system *deliberately* switches on a behaviour program, "sickness behaviour", to help you win.
- **Audience takeaway:** "Feeling terrible is your body's battle plan; rest is the medicine."
- **Format:** long-form, target 10–12 min (~1,600 words).

## Step 3: Research (2026-10-14)
- ~15 targeted searches; 17 claims logged in `research.md` (C1–C17), each with tier 1–2 sources.
- Corrections found during research: the popular "fever = 10–12% energy per °C" is weakly sourced → hedged; the ant paper says "segregation", not "self-isolation"; the mouse fasting study is mice-only → explicit caveat; the force-feeding livestock anecdote couldn't be verified → **cut (C12)**.
- The first draft ran short (839 words), so a second research round added C14–C17 (bees, sick faces, fever thermostat, fish fever) instead of padding.

## Step 4: Outline (2026-10-14)
Cold open → 1 The Alarm (Lab) → 2 The Furnace (Alarm) → 3 The Hunger Strike (Jungle) → 4 The Wall (Verdict→Dusk) → 5 When the Switch Gets Stuck (Deep space) → Outro (Dusk). Each beat maps to claim IDs.

## Step 5: Script (2026-10-14)
`script.md` (with claim tags + visual notes) → `script.txt` (clean, for ElevenLabs). One unsourced line ("hundreds of millions of years old") was caught before fact-check and softened.

## Step 6: Fact-check (2026-10-14)
An independent agent checked 27 lines: 17 ✅ / 10 ⚠️ / 0 ❌. All ⚠️ fixed. See `factcheck.md`.
**Length:** 1,112 words ≈ 7.5–8.5 min with narration pauses, short of the 9-min floor. Options: add a chapter (needs a new research round) or accept ~8 min for episode 1.

## Lessons for the process
- Research summaries from search tools can overstate results (e.g. glucose vs feeding); the independent check against primary sources caught it. Keep step 6 mandatory.
- Plan claims for length up front: ~1 verified claim per 60–80 words of script.

## Step 7: Build, started (2026-10-14)
- Landscape 1920×1080 Remotion project in `anim/`. Shared kit `src/kit.tsx` implements the DESIGN layer stack (Stage = backdrop + light rays + bloom + vignette; Framer = dark foreground shapes; Sparkle = hand-placed glints) and the STYLING palette keys.
- New characters in `src/chars.tsx`: **Cell** (teal immune-cell mascot, big glossy eyes, blush, arms), **Germ** (smug lime bacterium, can shrug), **Human**.
- Cold open built (5 scenes) and sent to the user as a style check before the chapters.
- Gotcha: a Unicode emoticon got mangled by a PowerShell rewrite. Edit source files with Python (utf-8), not PowerShell Set-Content.

## Rebrand → script v2 (2026-10-14)
- Channel rebranded as **The Why Works**: an adult scientist host ("Doc") plus an adult sidekick, Cell. Logo: WW monogram on a brass gear, navy/brass/cream (`brand/`).
- New show bible `motion/SHOW.md`: cast and line ratio (Cell ≤ 10% of lines, ≤ 25% of scenes), Doc's screen-placement modes, the static Lab set, Wild Machines for demo dives, and the two-voice script format.
- Script v2 (`script.md`; v1 kept as `script_v1.md`): same fact-checked claims, rewritten as Doc hosting, with 8 Cell lines (questions, snark, dad jokes, Doc unamused). No Cell jokes in Ch5 (depression) or touching the fever safety line (a joke was moved for this).
- Voice files: `script_doc.txt` and `script_cell.txt`, with shared line numbers for stitching.
- Machines used: Mega-Microscope, Thermo-Chamber, Time Portal.

## Voice recording + stitch (2026-10-14)
- The user recorded 7 Doc chunks plus 1 Cell take in ElevenLabs from the `elevenlabs/*.txt` paste files.
- New tool `tools/stitch.py`: Whisper aligns each file to its script lines (96–100% word match), cuts each line in the silences, and interleaves DOC/CELL in script order with timed gaps (0.35 s before Cell, 0.7 s beat after Cell for Doc's reaction, 0.9 s between chapters). Output: `vo_full.wav` (7.9 min) and `lines.json` (start/end of every line, used for animation timing).
- Gotcha: a char-level similarity score reported false mismatches on long takes; switched to word-level.

## Step 7b: Episode assembly (2026-10-18)
- Voice-driven timing: `anim/src/timing.tsx` reads `lines.json`; each scene is keyed to a script line and runs until the next scene's line (cut 5 frames early). Swapping a voice take → re-run stitch → the animation re-times automatically.
- Doc's presenter overlay (`lab.tsx → Presenter`) slides into a bottom corner on chosen scenes; his mouth moves only while a DOC line is playing (speaker lookup from lines.json).
- The Lab home set and the Mega-Microscope are built (navy/brass, chalkboard, shelves with a tiger-plush easter egg, window, lamps).
- Cold open re-timed to the real voice, plus Chapter 1 (15 scenes: lab walk → microscope dive → Cell intro → cytokine envelopes → caps texts → vagus nerve → brain HQ → thermostat → shivering furnace → switches → stamp → 1988 vet → STRATEGY). Render: `anim/out/episode_ch1.mp4`.
- Fixes found in the contact sheet: stamp text overflowed; the presenter covered end switches → narrowed the control panel. Rule: keep a ~420 px clear zone in the presenter's corner.
- Cell's voice is a placeholder (robotic); replace later and re-stitch.

## Step 7c: Chapter 1 on the asset library (2026-10-22)
- Presenter overlay → approved **DocV2** with per-scene expressions (`SceneDef.expr`: unamused on Cell's jokes, happy on the STRATEGY reveal).
- Lab walk → **LabWide** set (Doc walks in, then presents) · thermostat → **LabBench**, Doc points at the desk thermostat with a 37→39 °C readout · Brain HQ switches → **LabScreen** (no more filler backgrounds) · 1988 → **Farm** landscape with a vet avatar (Human2 Look) and library dog/cat/rabbit (replaces the low-poly sheep).
- Still on the old look (fix during biological sets): microscope-world "floaty" cells → blood-vessel tunnel; brain close-up; the shivering scene.
- Render: `anim/out/episode_ch1_v3.mp4` (cold open + Ch1, ~2:13).
