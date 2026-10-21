# STYLING.md: how everything is painted

Pairs with **DESIGN.md** (composition, scenes, motion). Use these tokens, and don't invent colours ad hoc.

---

## 1. Principles

1. **Flat vector, no outlines.** Shapes are separated by value and colour, never by black strokes. (Stripes and mouth lines are the only "lines", and they're drawn as filled tapered strokes.)
2. **Everything is rounded.** Corner radius ≥ 25% of the shorter side; capsules, circles and blobs. No sharp corners except fangs, crystals and stars.
3. **Every object gets at least 3 tones** (§3). A single flat fill is a bug.
4. **Saturated complementary pairs:** orange/teal, magenta/cyan, yellow/violet, red/green.
5. **Light comes from one direction per scene** (default: top-left, warm), and every object agrees with it.

## 2. Palette keys

Each scene (and in long-form, each chapter) uses one key. Values are hex.

| Key | Backdrop (edge → centre) | Light | Accent | Use for |
|---|---|---|---|---|
| **Dusk** | `#1A0B3D` → `#4A1470` → `#B52E7A` → `#FF7A45` | `#FFD27A` | `#3FD1C4` | Openings, nature, the tiger |
| **Deep space** | `#05030F` → `#14205A` → `#3A2A8F` | `#CFD8FF` | `#FF4FD8` | Cosmic, "the scale of things" |
| **Jungle** | `#0B1A40` → `#123B2A` → `#1E6B4A` | `#E8FF7A` | `#FF8A1F` | Biology, animals, behaviour |
| **Alarm** | `#2A0508` → `#7A0F1A` → `#FF4D3D` | `#FFE066` | `#3FE0E8` | Danger, deaths, threats |
| **Lab** | `#0B1033` → `#13406B` → `#3FC1C9` | `#B8FFFA` | `#FFD23F` | Mechanisms, diagrams, numbers |
| **Verdict** | `#0E3A2B` → `#0B1033` | `#B8FFD8` | `#2FE08A` / `#FF4D6D` | Decisions, debates |

**Neutrals:** ink `#2A0F5A` (text shadows, dark details), white `#FFFFFF`, cream `#FFF4E2`.

## 3. The shading recipe (apply to every object)

From back to front, inside each shape:

| Tone | How | Typical value shift |
|---|---|---|
| **Base** | The object's main colour | — |
| **Core shadow** | The same shape, offset away from the light, about 15–25% darker and **shifted toward the backdrop hue** (cool or violet), never grey or black | −20% lightness, +10° toward blue |
| **Lit face** | A smaller shape on the light side | +10% lightness |
| **Rim light** | A thin crescent or strip on the edge facing the light (or the backlight), often in the light colour, not white | Light colour at 60–80% |
| **Specular** | 1–2 small soft ellipses or dots on glossy things (eyes, noses, metal, liquid) | White at 60–90% |
| **Contact shadow** | A dark ellipse under anything touching the ground | `#000` at 25–35% |
| **Ambient occlusion** | Darker tone where shapes meet (under the head, between legs) | −15% |

Glossy or "magical" objects add an **inner glow** (a radial gradient from the light colour at the centre to transparent) and a **bloom halo** behind them (2–3× their size, at 15–30% opacity).

## 4. Light and effects tokens

- **Light rays:** 8–16 wedge shapes from the light source, alternating at 6–12% opacity, rotating slowly (≤ 3°/s).
- **Bloom:** a radial gradient circle, light colour at the centre (40–90%) to 0 at the edge. Use it on suns, eyes, screens and magic.
- **Sparkle:** a four-point star (two thin crossed diamonds) plus a small glow circle. Scale-pop in, twinkle once, fade out. **3–8 per frame, placed by hand, never a constant field.**
- **Motion trail:** a tapered shape behind fast objects, from the subject colour to transparent, plus 2–3 speed lines.
- **Vignette:** a radial gradient, transparent at 60% of the radius to `#000` at 45–60% opacity at the corners.
- **Grain (optional, long-form):** a monochrome noise overlay at 3–5% opacity to kill gradient banding.
- **Atmospheric perspective:** far layers are mixed 40–60% toward the backdrop colour.

## 5. Characters

**Mascot (the tiger template, `Tiger.tsx`)**
- Fur: base `#FF8C2A`, shade `#E06A14`, light `#FFB15C`, stripes `#4A1E0C` (tapered, round caps).
- Cream (muzzle, belly, paws): `#FFF4E2` / shade `#F2DCC0`. Pink (ears, nose, blush): `#FF9EB0`, `#E8607A`, `#FF7A8A` at 45%.
- **Eyes:** a dark rounded oval `#2B140A`, an amber iris wash at the bottom, **two highlights** (a big one top-left, a small one bottom-right). Big eyes = likeable.
- Proportions: head ≈ 40% of total height, paws oversized, no visible claws or teeth except in "cutaway" beats.

**Humans**
- Skin `#E8C9A8` / lit `#FFE4C9`. Shirt key teal `#16A3B5` / `#3FE0E8` / rim `#B8FFFA`. Pants `#2B2470` / `#3B33A0`.
- Faceless by default: the head gets one specular ellipse at the top-left.

New mascots follow the same rules: big head, big glossy eyes with 2 highlights, at least 3 tones, a blush, and rounded limbs.

## 6. Typography

- **Headline:** Arial Black (until we license a rounded display face; candidates are "Baloo 2" or "Fredoka" from Google Fonts). All caps, white, 100–130 px (vertical) or 120–160 px (horizontal). Hard drop shadow `0 10px 0 #2A0F5A` plus a soft shadow `0 18px 40px rgba(0,0,0,.5)`.
- **Sub-label pill:** orange `#FF8A1F` fill, ink `#2A0F5A` text, 44–50 px, radius 40, a 3D bottom edge `0 8px 0 #B5480A`. Max ~24 characters, so it fits on one line.
- **Big numbers** (`300 KG`, `0.8 SEC`): 200–240 px white, a 10 px ink stroke painted under the fill.
- **Callout labels** (`7 CM`): 80–110 px in the light colour (`#FFE066`), with an ink stroke and a thin leader line.
- Max 2 text elements per frame (headline plus one number or label). Text never overlaps the subject's face.

## 7. Don'ts

- No floating particle or bokeh dot fields.
- No outlines, drop-shadow-only depth, or flat single-tone shapes.
- No pure black (`#000`) except in shadows at low opacity; no pure grey.
- No gore. Implied danger uses scale, eyes, shadows and the Alarm palette instead.
- Don't copy Kurzgesagt characters, logos, thumbnails or exact scenes.

---

## 8. Fidelity level 2 paint rules (adopted 2026-10-20)

### 8.1 Gradient shading, not flat steps
- Level 1 used 3 flat tones per object. Level 2 gives **every large shape its own gradient** (light side → shadow side, 5+ perceptual steps), *plus* the flat shadow, rim and specular shapes on top.
- Skin: warm gradient (e.g. `#E86A4A` → `#B83A3A`), with a **subsurface glow** (a thin saturated orange-red band) where skin meets shadow.
- Use SVG `linearGradient` / `radialGradient` per shape type, defined once per scene and reused.

### 8.2 Micro-detail texture
- Large surfaces carry a **low-contrast pattern** (8–15% value difference) so they never read as plain fills:
  - foliage: vein lines and a darker rim;
  - planets and terrain: tiny dot grids or city-light stipple;
  - fabric and fur: short parallel strokes;
  - skin: none (keep faces clean), but a beard or hair gets 2–3 lighter strand highlights.
- Implement with SVG `<pattern>` fills or generated dots/lines. Keep strokes ≥ 2 px at 1080p so they survive compression.

### 8.3 Organic shape vocabulary
- **Leaves:** at least 4 silhouettes (monstera with splits, palm frond, fern, round), each with a midrib highlight.
- **Clouds and explosions:** cauliflower clusters, 5 tones from the hot top highlight to the dark base (`#FFF2A8` → `#FFC23A` → `#FF7A1F` → `#C2381F` → `#5A1A2A`), plus a bright rim on the light side.
- **Atmosphere:** planets get a glowing limb (a cyan or white outer ring with a soft blur) and haze bands.

### 8.4 Faces (crowd and supporting characters)
- Built from **simple geometry**: oval or rounded-rect heads, dot or almond eyes, short brow bars that carry the expression, a small mouth shape. The face reads through brows and the mouth, not detail.
- A **hair mass** is one solid shape plus 2 highlight strands; cover a big range of hairstyles and skin tones.
- Expressions in crowds: mix neutral, surprised, annoyed, happy and worried; never all the same.

### 8.5 Light
- One **key light** plus a **coloured ambient** (purple or teal) on the shadow side; rim light in the ambient colour on the back edge.
- **Dappled light** in environments: soft light patches (large, irregular, 10–20% opacity) on the ground and foliage, *not* floating particle dots.
- Grain overlay (`feTurbulence`, 3–4%) is now **on by default** for long-form; it kills gradient banding and adds richness.
