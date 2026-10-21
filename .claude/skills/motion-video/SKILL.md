---
name: motion-video
description: Make a Kurzgesagt-inspired 2D motion-graphics video (vertical short or 9–20 min long-form) with Remotion: topic → research → script → scenes → voiceover sync → render. Use when the user asks for a motion-graphics / explainer / "Kurz style" video, a YouTube long-form episode, or a short in this format. Costs no Higgsfield credits.
---

# Motion-graphics video workflow

Project root: `H:\Infomercials`. Reference build: `motion/tiger/` (scene code, `Tiger.tsx` character, `timing.json` sync).
**Channel: The Why Works. Read `motion/SHOW.md` first** (cast: Doc hosts, adult sidekick Cell with ≤ 10% of lines; Lab set; Wild Machines; two-voice script format `DOC:`/`CELL:` → `script_doc.txt` + `script_cell.txt`).
**Then read `motion/DESIGN.md` (scene grammar, layout, motion) and `motion/STYLING.md` (palette, shading, type) before drawing anything.** Every scene must follow both.
The user's rule: make it first, then make it better. Show a style check early; don't polish what hasn't been approved.

## 1. Topic and research: follow `motion/RESEARCH.md` exactly
This is the most important layer. Go through Pick (score ≥ 20/30) → Brief → Research (`research.md` organised by claim, sources tier 1–2 only, two sources per number) → Outline → Script → an **independent fact-check pass** (a separate agent or fresh read, ✅/⚠️/❌ table; any ❌ blocks recording) → Sources doc.
- Long-form: use the `deep-research` skill. Shorts: direct web search.
- Correct the user's premise when it's wrong (e.g. it was a tiger, not a lion). Real deaths: no gore, no unverified names.
- Never remake a Kurzgesagt episode; take a different angle.

## 2. Script (needs the user's approval)
- **Short:** 35–45 s, about 10 lines, ~100 words.
- **Long-form:** 9–20 min, about 1,400–3,000 words, in chapters (see DESIGN.md "Long-form structure").
- Write as an explainer, not news: hook → escalating facts → turn → closing question. Avoid "breaking news" tone.
- Each line must be drawable. **The script and the visuals must match line by line**, so if a line changes, its scene changes too (the user notices).
- Save as `motion/<slug>/script.txt`, one line per scene (long-form: one line per beat). Flag any line that isn't backed by a source.

## 3. Build scenes (Remotion)
- New project: copy `motion/tiger` to `motion/<slug>` (skip `node_modules` and `out`, then `npm i`), or scaffold with the remotion-create skill.
- Reuse the shared kit: `BG`, `Headline`, `Person`, and the character files. New recurring characters go in their own file, like `Tiger.tsx`.
- HTML text (`Headline`) must be passed through BG's `head` prop. HTML inside `<svg>` doesn't render.
- Avoid circular imports at module level (build scene arrays inside components).
- Style check: render one still per scene, tile them into a contact sheet with ffmpeg, and Read it. Send scene 1 (or a contact sheet) to the user before building everything.
- No floating particle dots anywhere (the user dislikes them).
- **Fidelity level 2** is the standard (DESIGN §8 + STYLING §8): fill the frame edge to edge, give every shape gradient shading plus micro-texture, set a warm subject against a cool world, use big cropped heroes, and build density with seeded generators. Run the DESIGN §8.5 fidelity check on every contact sheet before showing the user.

## 4. Voiceover sync
- **ElevenLabs is connected as an MCP tool (2026-10-20).** I can generate the takes directly (`creative_generate_speech`, voice design), so the user no longer has to paste and download. **Confirm voices and credit use with the user first**, then save files to `<slug>/elevenlabs/` with the same names and run `tools/stitch.py`.
- The user records the script in ElevenLabs and gives a file path. Copy it to `motion/<slug>/vo_full.mp3` and `public/vo.mp3`.
- Align with Whisper through `tools/build.py` (`transcribe` + `align`, loaded via importlib from `H:/Infomercials/tools/build.py`). Each scene starts 0.15 s before its line's first word; the last scene ends at the audio end + 0.8 s. Write `src/timing.json` as `{dur:[frames…], total}`.
- Compare what Whisper heard against the script, and tell the user about any lines they recorded differently. If the visuals no longer match, update the scene text.
- `Main` plays `<Audio src={staticFile("vo.mp3")} />` from `@remotion/media`.

## 5. Render and deliver
- `npx remotion render Main out/<slug>_final.mp4` (local, free). Render once, after the voiceover is in; before that, only stills or a draft.
- **No burned-in captions.** The user adds captions in CapCut.
- Send the file with SendUserFile and mention any risky claims in one line.

## Channel notes
- Plan: YouTube long-form first, then cut it down for TikTok and Instagram.
- Motion graphics did better than Seedance shorts and cost about a tenth as much. The zombie and spooky fiction format flopped; the explainer and fact format works.
