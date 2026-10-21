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
- **Batch 2 (APPROVED):** `Jungle` (canopy foliage, god rays, butterfly, bird), `Canyon` (striped mesa strata), `Swamp` (fog, murky water, lily pads; **actors stand on the left mudbank**, slot x≈420), `VolcanoIsland` (smoking volcano at sunset, waves), `Savanna` (acacias, giant setting sun, birds). Sheet: `landscapes_v2_sheet.png`. Per-landscape slots: `LAND_SLOTS` in `LandscapeSheet.tsx`.

## Home & family interiors: APPROVED v1 (2026-10-20)
- **Code:** `sick-on-purpose/anim/src/interiors.tsx`. One `Room` engine: wall colour + wallpaper micro-texture (stripes/dots/diamonds/plain), crown and baseboard trim, floor type (wood/tile/carpet), light pool, vignette, plus a `Window` (day with drifting clouds and sun shafts, or `night`).
- **Presets:** `Bedroom` (`night` option), `LivingRoom`, `Kitchen` (counter, upper cabinets, tiled backsplash, stove), `HomeOffice`. **Actor slot:** floor, feet at y≈960–1010, s≈0.65–0.7.
- **Previews use the avatars** (Priya, Amara, Sofia, Kenji) to check the cast in sets. Sheet: `interiors_v1_sheet.png`.

## City & urban: REVIEW v1 (2026-10-20)
- **Code:** `sick-on-purpose/anim/src/urban.tsx`. Seeded `Building` facades (gradient, rim, window grid with lit and flickering windows, rooftop boxes, blinking antennas) and `Skyline` rows with haze for depth, plus `Lamp`/`Glow`.
- **Presets** (`URBAN`):
  - `Street`: storefronts with striped awnings, sidewalk, lamps, traffic light, a car and bus driving past. Slot: sidewalk, feet y≈930, s≈0.6.
  - `Alley`: brick walls in perspective, a fire escape with landings and stairs, a dumpster, steam, a hanging lamp cone, puddles. Slot: centre, feet y≈1000, s≈0.62.
  - `Highway`: an elevated perspective road with lane dashes flowing, cars outbound and inbound, an overpass with a sign, a sunset skyline. Use Doc as presenter.
  - `Downtown`: 3-layer dusk skyline, skyscraper, waterfront reflections, a helicopter crossing. Slot: presenter or a big foreground actor.
  - `Rooftop`: night city below, water tower, spinning AC fans, antenna, solar panel, foreground ledge. Slot: roof deck, feet y≈930, s≈0.62.
- **Sheet:** `urban_v1_sheet.png` (+ `urban_<Name>_v1.png`).

- **Next set families:** inside the body (vessel tunnel, tissue), outdoors (park, forest, farm, street), home (bedroom, living room), space (orbit, surface, hangar), machine dives.
- **Performance note (user, 2026-10-20):** the landscapes render fast. Keep generators lean: seeded, no per-frame heavy filters except a few blurred framers.
