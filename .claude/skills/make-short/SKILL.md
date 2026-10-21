---
name: make-short
description: Make a vertical 3D-rendered short (Zack D. Films look) for the user's TikTok channel, from a topic to final.mp4. Use when the user says "make a short about X", "new video", "next post", or gives a story idea. The channel does psychological stories: fictional spooky tales (ghosts, shadow people), perception and mind topics (inattentional blindness, solipsism, déjà vu) and fictional sci-fi.
---

# Make a short

The pipeline: topic → script → Higgsfield stills → Seedance clips → the user's ElevenLabs voice → `tools/build.py` → `final.mp4`.
Work from `H:\Infomercials`. The user's rule: **make it first, then make it better.** Ship a working cut fast; don't over-polish or over-investigate.

## 1. Script (needs the user's approval; the only checkpoint before spending credits)

Make the folder `shorts/NNN-slug/` (next number after the existing ones) and write `shots.json`. Copy the structure of `shorts/001-swallow-gum/shots.json`.

- 30–45 s, 8–10 shots, one sentence per shot, **≤ 15 words per line**.
- **Hook in line 1**, in the second person, unsettling: "If you ever see a shadow move in the corner of your eye…" / "There's a reason you can't see the gorilla."
- Story arc: hook → escalate → twist or unsettling payoff in the last line. Fiction is fine, but don't present a made-up claim as real science; real concepts (inattentional blindness, solipsism) should be stated accurately.
- Each shot has: `id`, `line`, `type: "video"`, `prompt` (still), `motion` (clip).
- Keep the recurring character (bald man, grey t-shirt) for "you" shots unless the story needs someone else.

Show the user the lines as a numbered list and wait for an OK. Then also write `script.txt` (just the lines, one per line) for them to paste into ElevenLabs.

## 2. Stills (Higgsfield `generate_image`, about 0.25 credits each)

- Model `gpt_image_2_5`, `aspect_ratio: "9:16"`, `use_unlim: false`.
- Generate shot 01 (the character anchor) first. For every other shot with the character, pass `medias: [{role: "image_references", value: <shot 01 job id>}]`.
- Append a style lock to every prompt. For this channel use the **dark variant**:
  > 3D CGI render, stylized realistic animation, smooth plastic-like skin, moody low-key lighting, cold blue and teal tones with deep shadows, subtle film grain, minimal clean environment, eerie quiet atmosphere, vertical 9:16 composition
- Save each job id into `shots.json` as `higgs_image_job`.
- You can't download stills (there's no job-status tool). That's fine, because the clips are what matter.

## 3. Clips (Seedance 2.5 through 3D Jutsu)

- Create a project once per short: `scene_builder_3d_create_project` named "Shorts NNN - Title".
- For each shot, `scene_builder_3d_generate_video` with `mode: "omni_reference"`, `medias: [{role: "start_image", data: {id: <image job>, type: "image_job"}}]`, `aspectRatio: "9:16"`, `resolution: "720p"`, `generateAudio: false`, `duration`: 5 (6 for long lines). Prompt: one simple motion + slow camera move + "no text, no cuts".
- **About 6 run at once.** Submit 6, then the rest after some finish. A result of `submission_unknown` with `jobs: []` means nothing was created; resubmit with a **new** requestId (re-sending the same id just replays the dead result).
- An `nsfw` failure is usually a false positive (gore-adjacent or body-interior words). Reword it, or use `mode: "t2v"` without the image.
- Wait with a background `sleep 150`, not rapid polling. Then `scene_builder_3d_get_generation` → `curl -sfL -o shorts/NNN/clips/NN.mp4 <result_url>`.
- Spot-check with a contact sheet: one ffmpeg frame per clip, `hstack`, then Read the image.

## 4. Voice

The user records the ElevenLabs take from `script.txt` and saves it as `shorts/NNN/audio/vo_full.mp3`. Don't generate a voice. Until it arrives, the build uses the robotic Windows voice as a timing placeholder.

## 5. Build

```bash
python tools/build.py shorts/NNN-slug
```

- With `vo_full.mp3` present, faster-whisper aligns each word, splits the audio by line, cuts each clip to its line, and adds karaoke captions. A clip shorter than its line holds its last frame.
- Optional: `audio/music.mp3` (auto-ducked), `sfx/NN.mp3` (plays at the start of shot NN). Dark ambient drones and low whooshes suit this channel.
- Send `final.mp4` with SendUserFile (`display: "render"`). Mention any obvious issues in one line rather than investigating at length.

## Environment notes

- FFmpeg comes from the `imageio-ffmpeg` pip package (no system ffmpeg). Python 3.14; edge-tts is blocked (403).
- More detail in `PLAYBOOK.md`.
