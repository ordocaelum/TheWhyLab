# Sets (scene templates): REVIEW v1 (2026-10-20)

- **Code:** `sick-on-purpose/anim/src/sets.tsx`. Each set is a 1920×1080 component following the DESIGN §1 layer stack (wall/backdrop → light pools → midground props → **actor layer** → foreground framers → vignette), dressed with approved objects (`<Thing>`).
- **Contract:** sets take `children` (actors and props in the actor layer). Some have named slots (`actor`, `props`, `screen`). Every set documents its **SLOTS**: where Doc/avatars stand so scale, floor contact and light match.

| Set | Use for | Slots |
|---|---|---|
| **LabWide** | Establishing shot, chapter openers, walking in the lab | doc `{x:1290, y:1010, s:0.62}` (on the rug) · `lights` prop dims the room for serious beats |
| **LabBench** | Doc demonstrates a prop (e.g. points at the desk thermostat) | doc `{x:760, y:960, s:1.0}` behind the bench · `props` replaces the two hero props (default: desk-thermostat, flask) |
| **LabScreen** | Graphs, charts, diagrams on the big wall monitor | doc `{x:300, y:1260, s:1.0}` · `screen` = content in a 1100×600 box (example: `DemoGraph`) |

- **Previews:** `set_LabWide_v1.png`, `set_LabBench_v1.png`, `set_LabScreen_v1.png`.
## Landscapes: APPROVED v1 (2026-10-20)
- **Code:** `sick-on-purpose/anim/src/landscapes.tsx`. One engine (`Sky`, seeded `Ridge` kinds: hills/peaks/dunes/pines/ice, `Haze` for atmospheric depth, textured `Ground`, drifting `Clouds`) plus presets dressed with approved objects.
- **Presets:** `Forest`, `Desert`, `Mountains`, `Beach`, `Farm`, `Arctic` (`LANDSCAPES`). **Actor slot:** ground line, feet at y≈930–1000, Doc/avatars at s≈0.5.
- **Animated details:** waves and a sailboat drifting (beach), river ripples (mountains), aurora (arctic), turbine and drifting clouds (farm), heat shimmer (desert), swaying plants.
- **Sheet:** `landscapes_v1_sheet.png` (+ `land_<Name>_v1.png`).
- New presets = a new combination of sky, ridges, ground and objects (~25 lines each).
- **Batch 2 (review):** `Jungle` (canopy foliage, god rays, butterfly, bird), `Canyon` (striped mesa strata), `Swamp` (fog, murky water, lily pads; **actors stand on the left mudbank**, slot x≈420), `VolcanoIsland` (smoking volcano at sunset, waves), `Savanna` (acacias, giant setting sun, birds). Sheet: `landscapes_v2_sheet.png`. Per-landscape slots: `LAND_SLOTS` in `LandscapeSheet.tsx`.

- **Next set families:** inside the body (vessel tunnel, tissue), outdoors (park, forest, farm, street), home (bedroom, living room), space (orbit, surface, hangar), machine dives.
- **Performance note (user, 2026-10-20):** the landscapes render fast. Keep generators lean: seeded, no per-frame heavy filters except a few blurred framers.
