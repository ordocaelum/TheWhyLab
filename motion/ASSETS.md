# ASSETS.md: asset library registry

Every reusable character, prop, plant, anatomy piece and set lives in `motion/assets/<category>/<name>/` with a README (status, version, component, previews). **Only APPROVED assets go into episodes.** Status flow: draft → review (sheet sent to the user) → APPROVED / changes.

| Category | Asset | Status | Version | Notes |
|---|---|---|---|---|
| humans | doc (host) | ✅ APPROVED | v2 | Hero tier; keep v1's charm. Expressions ✅ (7). Poses ✅ (8). Complete. |
| humans | cell (sidekick) | draft | v1 | Needs a level-2 pass and a voice |
| humans | avatars ×10 (Human2 + Look) | 🔍 review | v1 | 2 per group, man + woman; Doc's rig → all expressions and poses |
| humans | sick person (supporting) | todo | — | Will be built from an avatar Look |
| anatomy | blood vessel tunnel, blood cells, brain | todo | — | Replace the floating filler cells |
| animals | sheep, cow, horse, dog | todo | — | The v1 sheep looked low-poly |
| plants | bushes (6+), trees, leaves | todo | — | |
| props | lab monitor, desk thermostat | todo | — | Doc *shows* data on lab props |

## Fidelity tiers (humans)
- **Hero** (Doc): gradient skin with warm shadow edges, a full face (irises, lids, lips), hair and beard strands, clothing folds and details, rim light, 6 expressions, 3+ poses.
- **Supporting** (sick person, the vet): gradient skin and clothes, simple face (eyes, brows, mouth), 1–2 clothing details, 3 expressions, 2 poses.
- **Crowd:** face geometry per STYLING §8.4, flat-plus-one-gradient, many seeded variants.
