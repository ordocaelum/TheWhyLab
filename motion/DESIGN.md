# DESIGN.md: scene grammar for our motion-graphics videos

What goes where, how scenes are built, how they move. **STYLING.md** defines how things look (colours, shading, type). Use both together: DESIGN decides the composition, STYLING decides the paint.

Inspired by the *techniques* of Kurzgesagt-style explainers. We never copy their characters (the duck/bird, their specific planets), logos, layouts or thumbnails. Our recurring characters, palette and scene designs are our own.

---

## 1. The layer stack (back to front)

Every frame is built from these 9 layers. Studying the reference thumbnails, nearly every one uses at least 6 of them, and that layering is most of the "refined" look.

| # | Layer | What it is | Reference example |
|---|---|---|---|
| 1 | **Backdrop** | Full-frame gradient, dark at the edges and bright behind the subject. Never a flat fill. | Red-to-orange behind the duck; deep purple behind the brain battery |
| 2 | **Light source** | One big glow (sun, halo, explosion core) placed right behind the subject. Often with **radiating rays or bands**. | The yellow radial burst behind the baby; rays behind the amphetamine face |
| 3 | **Far scenery** | Silhouettes with low contrast, shifted toward the backdrop's hue (atmospheric perspective). Lots of small repeated detail. | The tiny city grid under the asteroid; distant leaves |
| 4 | **Midground** | The setting: ground plane, horizon, props, with medium detail. | The cliff edge with two figures; the glass |
| 5 | **Subject** | The star of the scene. Fully shaded (STYLING §3), highest contrast and saturation, biggest shape. **One subject per frame.** | The baby, the asteroid, the fish face |
| 6 | **Subject FX** | Rim light, glow halo, motion trail, sweat drops, electricity, all hugging the subject. | The asteroid's pink trail; lightning around the crystal |
| 7 | **Foreground framers** | Big, dark, slightly blurred shapes at the frame edges (leaves, hands, rocks) that push the subject back into depth. | The giant hands around the baby; the weed leaves |
| 8 | **Sparkles / accents** | Four-point star glints, small bubbles, highlight pops. **Sparse: 3–8 per frame, never a constant field.** | The glints around the beer |
| 9 | **Vignette + type** | An edge darkening of 40–60%, then headline text. | Every thumbnail |

Rules:
- **Depth = value plus saturation.** Layers further back are lower contrast and closer to the backdrop's hue. The subject is the most saturated thing on screen.
- **Never** let two layers have the same brightness where they overlap. Separate them with a rim light or a contact shadow.
- **No uniform particle fields.** Layer 8 is deliberate accents only, placed by hand.

## 2. Composition (vertical 1080×1920 and horizontal 1920×1080)

- **Subject placement:** centre or lower-third centre. The vertical safe area is x 60–1020, y 200–1650 (TikTok and Instagram UI cover the top and bottom).
- **Headline zone:** vertical y 200–420; horizontal is top-centre or left third.
- **Scale contrast sells facts.** Put a tiny human next to a huge thing (a bus, the tiger, an asteroid), and always include a familiar reference object.
- **One idea per frame.** If a line has two facts, give it two beats (a cut or camera move between them).
- **Odd-numbered groups** (3 or 5 people, 3 bubbles) read better than even ones.
- **Leading lines:** rays, arrows and trails point at the subject or the number.

## 3. Scene grammar

Each script line maps to one **scene** made of 1–3 **beats**.

```
Scene = Establish (0.3–0.5 s) → Reveal (main action) → Hold (≥ 0.6 s, readable) → Exit (cut, or a transition into the next scene)
```

Reusable scene types (build them once, reuse them forever):

| Type | Use for | Recipe |
|---|---|---|
| **Hook** | Line 1 | The subject is revealed with its light source flaring on, a short headline, a slow push-in |
| **Size compare** | "As big as…" | Human plus subject side by side; the subject scales up with a spring overshoot |
| **Scale / balance** | Weights, counts | A seesaw or scale; items drop in one at a time; a number counts up |
| **Race / timer** | Speed, time | A reference object, the subject streaking past, a timer counting |
| **Top-down map** | Movement, strategy | A bird's-eye view, a dotted path drawing on, the subject's head as the marker |
| **Cutaway / diagram** | Anatomy, mechanism | Subject close-up, the key part glowing, a measurement callout with a leader line |
| **Mood beat** | Emotional turn | Slow camera, breathing subject, a light shift (warm ↔ cold) |
| **Verdict** | A decision | A big icon (✓/✗) stamping in over the subject |
| **Debate** | "Not everyone agrees" | A split crowd with ✓ and ✗ bubbles and a vs-bar |
| **Outro / question** | Last line | Subject close-up looking at the viewer, a comment bubble |
| **Chapter card** (long-form) | New section | The full-frame chapter title on its own palette, the subject icon, 2–3 s |

## 4. Motion principles

- **Nothing is ever fully still.** Use a background drift (0.5–1% scale per 5 s), character breathing (±1.5%), blinking (every 2.5–3 s) and a tail or hair sway.
- **Entrances use springs** (damping 9–14). Big things overshoot slightly; text eases in without overshoot.
- **Stagger groups** by 4–8 frames per item.
- **Anticipation:** before a big move (a lunge or dash), add a 4–6 frame wind-up in the opposite direction.
- **Parallax:** far layers move at about 0.3× and the foreground at about 1.2× the midground speed.
- **Numbers count up** over 0.8–1.5 s with ease-out, landing just as the voiceover says the number.
- **Cuts land on the voiceover.** A scene starts 0.15 s before its line (handled automatically by `timing.json`).
- **Transitions** (long-form): a match cut on shape (round tiger head → round planet), a zoom into a detail, or a whip pan with a motion-blur smear. Shorts can hard-cut.

## 5. Characters

- **Recurring mascot per topic.** It must be likeable: big head (≈ 40% of its height), big glossy eyes, small mouth, rounded everything. The tiger in `Tiger.tsx` is the template.
- **Humans:** a faceless capsule body with a round head and a shirt colour as identity. Faces only for close-up emotion (eyes plus a simple mouth).
- **Expressions:** blink, head tilt, eye look-direction, mouth open/yawn, sweat drop, "!" pop.
- Characters cast a contact shadow (a dark ellipse at 30% opacity) on every ground.

## 6. Long-form structure (9–20 min YouTube)

```
0:00  Cold open: the most surprising fact, as a visual (no intro card)       20–40 s
0:30  Title card plus the premise ("Here's what happens if…")                  10 s
      Chapter 1: Basics (what is X)                                            2–4 min
      Chapter 2: Escalation (scale, the numbers get bigger)                    2–4 min
      Chapter 3: The turn (the counterintuitive part)                          2–4 min
      Chapter 4: Consequences / what it means for you                          2–3 min
      Outro: a reflective closing line plus a question                         30–60 s
```

- **Chapter cards** between chapters, each chapter with its own **palette key** (STYLING §2) so the video feels like it moves somewhere.
- **A visual change every 3–6 s.** Reuse scene types, but vary the camera and palette.
- **Running gags and callbacks:** the mascot reappears in each chapter.
- **Clip-ability:** design each chapter so 30–60 s of it works as a standalone short, with its own hook line and a vertical-safe composition (or a recomposed vertical version).

## 7. Thumbnails

From the references: **1–2 words in huge white type** at the top (`YOU'RE TOO OLD`, `PLANET KILLER`), one giant expressive subject, a radial light burst behind it, high saturation, and an optional red arrow or circle on the key detail. Use our mascot with a strong expression. Never reuse their characters or layouts.

---

## 8. Fidelity level 2 (adopted 2026-10-20)

Studied from three reference frames: a bearded early human in a jungle, a crowd of overpopulation faces, and explosions seen from orbit. Our level-1 scenes have the right *structure* (the layer stack), but they're too **empty**, too **flat inside each shape**, and too **centred**. Level 2 fixes that.

### 8.1 Density: fill the frame edge to edge
- **No empty backdrops.** Every frame has scenery reaching all four edges. The gradient backdrop is only the deepest layer, never the main thing you see.
- **Repetition with variation:** big counts of a thing (leaves, faces, buildings, cells), each one slightly different in size, rotation, hue (±8°) and shape variant. The crowd reference has ~30 faces and no two share a haircut, skin tone or expression.
- **Detail budget by depth:** foreground = big shapes, few details; midground = most detail; far background = tiny repeated micro-detail (city grids, distant trees) at low contrast.

### 8.2 Scale and crop
- **Subjects are big and cropped.** A hero character's head and shoulders often fill 50–70% of the frame and run off the bottom edge (bearded-human ref). Don't shrink a subject to fit politely inside the frame.
- **Extreme scale shots** for "how big/how many": a high orbital or aerial view with a tiny reference object (the planes beside the explosions).
- **Off-centre:** put the subject on a third and let the environment fill the rest. Centre only for confrontational or iconic beats (thumbnails, title cards).

### 8.3 Temperature contrast
- **Warm subject, cool world** (or the reverse). The red-skinned human pops against a teal jungle; the orange explosions against a blue planet. Pick the scene's palette key for the world, then make the subject its complement.

### 8.4 Crowds and procedural sets (how we build density cheaply)
- Build **generators**, not hand-placed copies: `Crowd({count, seed})`, `Foliage({kinds, seed})`, `CityGrid({seed})`, `CloudBank({seed})`. A seeded random keeps every frame identical between renders.
- Each generator mixes **3–6 variants** of its part (leaf types: monstera, palm frond, fern, round; face parts: hair shapes, brows, mouths).
- Back rows are cooler and darker (atmospheric), front rows warm and lit.

### 8.5 Fidelity check (run on every contact sheet before showing the user)
1. Does scenery reach all four edges? No large empty gradient areas.
2. Does every major shape have at least a 5-step tonal gradient plus a rim light (STYLING §8)?
3. Is there micro-detail texture somewhere in the midground or background?
4. Is the subject warm against a cool world (or the reverse)?
5. Is the hero big, cropped and off-centre where appropriate?
6. Are repeated things varied (no visible copy-paste)?
Fail any point → fix it before sending.
