# Zack D. Films–Style Shorts: Playbook

A guide to making short, vertical explainer videos rendered in 3D, in the style of Zack D. Films. Higgsfield makes the visuals and narration, and FFmpeg puts everything together.

---

## 1. What makes the style work

| Element | What to do |
|---|---|
| **Look** | Smooth 3D CGI that feels a bit uncanny: plastic-looking skin, soft studio lighting, a plain gradient or simple background, shallow depth of field |
| **Hook** | Grab attention in the first second: "This is what happens if you…" / "This man survived…" |
| **Signature shot** | X-ray, cross-section and inside-the-body cutaways (transparent skin, glowing skeleton, highlighted organ) |
| **Pacing** | 30–60 s total, a new shot every 2–4 s, one idea per shot |
| **Audio** | One consistent narrator who speaks quickly, plus light music and punchy sound effects |
| **Captions** | Bold, white with a black outline, 1–3 words at a time, lower-middle of the screen |
| **Format** | 9:16, 1080×1920, 30 fps |

---

## Quick start: the build script

The script [tools/build.py](tools/build.py) runs every FFmpeg step in section 6 in one go:

```bash
python tools/build.py shorts/001-swallow-gum
```

- **Edit `shots.json`** in the short's folder. Each shot has a `line` (what's said), a `type` (`video` or `still`), and a `zoom` (`in` or `out`) for stills.
- **Narration** is generated one line at a time, and each shot is cut to exactly the length of its line, so cuts land on the sentences automatically.
  - `"tts": "sapi"` uses the offline Windows voice. It sounds robotic and is meant as a placeholder.
  - `"tts": "edge"` uses Microsoft's free neural voices. They're currently blocked (403 error); the script falls back to the Windows voice automatically.
  - **ElevenLabs (or any real voice):** export the whole script as **one file**, save it as `audio/vo_full.mp3`, and rebuild. Whisper finds every word's timing, splits the file by line in the pauses, and syncs the cuts and captions automatically. Nothing needs syncing by hand. Per-line files (`audio/vo_01.mp3` …) also work.
- **Images:** save each shot as `stills/NN.png`. Stills get a slow zoom.
- **Video clips:** save each as `clips/NN.mp4`. Video shots without a clip fall back to the still; a shot with neither gets a placeholder.
- **Music and sound effects (optional):** `audio/music.mp3` is ducked under the voice automatically, and `sfx/NN.mp3` plays at the start of shot NN.
- **Captions** are karaoke style: 1–3 words at a time, with the current word in yellow and a small pop.
- **Output:** `final.mp4`, 1080×1920, 30 fps, loudness at -14 LUFS.
- **FFmpeg** comes from PATH, the `FFMPEG` environment variable, or the `imageio-ffmpeg` pip package (installed).

---

## 2. Folder layout (one folder per short)

```
H:\Infomercials\
  PLAYBOOK.md
  shorts\
    001-swallow-gum\
      script.md        # narration and shot list
      stills\          # Higgsfield images (01.png, 02.png, …)
      clips\           # Higgsfield videos, or stills animated with FFmpeg
      norm\            # clips normalized to 1080x1920 / 30 fps
      audio\           # vo.mp3, music.mp3, sfx\
      captions.srt
      list.txt         # FFmpeg concat list
      final.mp4
```

---

## 3. Script template (~120 words ≈ 45 s)

```
TITLE: What happens if you swallow gum
HOOK (0-3s):    "This is what happens when you swallow gum."
BEAT 1:         <first thing that happens>
BEAT 2:         <the surprising part>
BEAT 3:         <the consequence / myth vs reality>
PAYOFF:         <one-line twist or takeaway>
```

**Shot list:** one row per sentence.

| # | Line | Shot description | Type | Dur |
|---|---|---|---|---|
| 01 | "This is what happens…" | Bald 3D man about to swallow gum, push-in | video | 3s |
| 02 | "It slides down…" | X-ray cutaway, gum in esophagus | video | 3s |
| 03 | "Your stomach can't…" | Cross-section of stomach, gum glowing pink | still + zoom | 4s |

Use **"still + zoom"** (section 6.2) wherever motion isn't needed. It costs no video credits.

---

## 4. Higgsfield prompts

### Style lock
Paste this at the end of **every** image prompt so the shots match:

> 3D CGI render, stylized realistic medical animation, smooth plastic-like skin, soft even studio lighting, plain soft gradient background, shallow depth of field, clean and minimal, vertical 9:16 composition

### Recurring character
Make one character sheet and reuse it on every short (in Higgsfield, use a reference/character element). Something like:

> bald middle-aged man, neutral expression, plain grey t-shirt, slightly uncanny 3D look

### Cutaway prompt pattern
> [character] seen with transparent skin, glowing blue skeleton visible, [ORGAN] highlighted in bright red, [ACTION], + style lock

### Video (image → clip) prompts
Give each clip **one simple motion**. That hides AI artifacts and suits the clean look.
- "slow camera push-in, subject still"
- "the man swallows, subtle throat movement"
- "x-ray effect fades in over the body"
- "camera slowly orbits the cross-section"

Keep clips to 3–5 s.

### Narration
Make one narrator voice (`create_voice`) and reuse it on every short. It should be fast, neutral, and slightly dry.

### Saving credits
1. Generate **stills first** and approve them.
2. Animate only the shots that need motion. Do the rest with FFmpeg zooms.

---

## 5. Installing FFmpeg (not installed yet)

```bash
winget install Gyan.FFmpeg
```

Then open a new terminal and check it works:

```bash
ffmpeg -version
```

For automatic captions, also install Whisper:

```bash
pip install -U openai-whisper
```

---

## 6. FFmpeg cookbook

Run these commands from inside the short's folder.

### 6.1 Normalize every Higgsfield clip to 1080×1920, 30 fps, no audio
Higgsfield outputs vary in size and frame rate, so normalize them first or the concat step will fail.

```bash
for f in clips/*.mp4; do ffmpeg -y -i "$f" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -an "norm/$(basename "$f")"; done
```

### 6.2 Still → slow zoom clip (Ken Burns, no credits)
4 s = 120 frames at 30 fps. Change `d=` and `-t` together.

```bash
ffmpeg -y -loop 1 -i stills/03.png -vf "scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='min(zoom+0.0012,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1080x1920:fps=30,setsar=1" -t 4 -c:v libx264 -crf 18 -pix_fmt yuv420p norm/03.mp4
```

(Scaling up to 2× first stops zoompan from jittering.)

### 6.3 Get the voiceover length (to plan shot timing)
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 audio/vo.mp3
```

### 6.4 Trim a clip to an exact length
```bash
ffmpeg -y -i norm/02.mp4 -t 2.8 -c:v libx264 -crf 18 -pix_fmt yuv420p norm/02_cut.mp4
```

### 6.5 Join the shots
`list.txt`:
```
file 'norm/01.mp4'
file 'norm/02.mp4'
file 'norm/03.mp4'
```
```bash
ffmpeg -y -f concat -safe 0 -i list.txt -c copy video.mp4
```

### 6.6 Add the voiceover and music, ducking the music under the voice
```bash
ffmpeg -y -i video.mp4 -i audio/vo.mp3 -i audio/music.mp3 -filter_complex "[1:a]asplit=2[vo][sc];[2:a]volume=0.35[m];[m][sc]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=300[duck];[vo][duck]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest mixed.mp4
```
- `loudnorm I=-14` brings the audio to the typical loudness target for Shorts, TikTok and Reels.
- To add a sound effect at 2.5 s, add another input with `adelay=2500|2500` and include it in the `amix`.

### 6.7 Word-by-word captions with Whisper
```bash
whisper audio/vo.mp3 --model small --word_timestamps True --max_words_per_line 2 --output_format srt --output_dir .
```
Rename the output to `captions.srt` and fix any misheard words by hand.

### 6.8 Burn in the captions
```bash
ffmpeg -y -i mixed.mp4 -vf "subtitles=captions.srt:force_style='FontName=Arial Black,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=3,Shadow=0,Alignment=2,MarginV=70'" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy final.mp4
```
- Keep `captions.srt` in the current folder. Windows drive paths like `C:\…` break the `subtitles` filter unless escaped.
- `FontSize`/`MarginV` are measured against libass's default 288-pixel-tall canvas, so 20 comes out big on 1080×1920. Adjust to taste.
- Yellow highlight: `PrimaryColour=&H0000FFFF` (the colour order is BGR).

### 6.9 Quick checks
```bash
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate -of compact final.mp4
```

```bash
ffplay final.mp4
```

---

## 7. Production checklist (per short)

1. [ ] Pick a topic and write `script.md` (hook, beats, payoff, shot list)
2. [ ] Generate narration → `audio/vo.mp3` → get its length (6.3)
3. [ ] Generate stills with the style lock → approve
4. [ ] Animate only the motion shots in Higgsfield → `clips/`
5. [ ] Normalize clips (6.1) and make zoom clips from the stills (6.2)
6. [ ] Trim shots to match the voiceover timing (6.4) → `list.txt` → concat (6.5)
7. [ ] Mix the voiceover, music and sound effects (6.6)
8. [ ] Whisper captions → fix → burn in (6.7–6.8)
9. [ ] Watch it once on a phone, then post

---

## 8. Topic bank

**Body and medical**
- What happens if you swallow gum
- How a tapeworm gets inside you
- What a kidney stone does on its way out
- Why your foot "falls asleep"
- What happens when you crack your knuckles

**Survival "what if"**
- What happens if you fall into quicksand
- Where lightning travels through your body
- What happens if you drink seawater
- What happens to your body in space without a suit

**History and procedures**
- Surgery before anesthesia
- How the plague doctor mask was supposed to work
- How astronauts go to the bathroom
- How ancient Egyptians mummified a body

**Everyday mechanisms**
- What happens inside a lock when you turn the key
- How a stun gun affects your muscles
- What happens inside a microwave
- How a parachute actually opens
