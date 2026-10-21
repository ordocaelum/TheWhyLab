# SHOW.md: The Why Works show bible

The format, cast and sets. Works with RESEARCH.md (facts), DESIGN.md (composition) and STYLING.md (paint). The scripts and scene plans for every episode follow this.

---

## 1. Cast

### The Scientist ("Doc", working name)
- **Role:** the host. He runs the show and does **~85–90% of the talking**.
- **Personality:** brilliant, enthusiastic, slightly dramatic about science, a bit of a showman with his machines. Patient with the viewer, **not** amused by Cell.
- **Look:** adult, beard, grey temples, rectangular glasses, knee-length lab coat, teal tie (`chars.tsx → Scientist`).
- **Voice:** the main ElevenLabs narrator voice.

### Cell
- **Role:** the sidekick. An **adult**, not a kid or a pet. Dry, sarcastic, shameless with puns.
- **What Cell does:** asks the question the viewer is thinking ("Wait, so being miserable is a *feature*?"), makes snarky remarks, and tells **very cheesy dad jokes**, which Doc does not laugh at (deadpan stare, sigh, or he just carries on).
- **Frequency:** **6–10 lines per 10-minute episode, max.** Roughly once per chapter plus the outro. Never two Cell beats back to back.
- **On screen:** in **≤ 25% of scenes**. Sometimes helps with an illustration (points at the diagram, rides into the bloodstream, gets used as a size reference), but most explanation scenes have no Cell.
- **Voice:** a second ElevenLabs voice. It should be adult, dry and a bit nasal or deadpan, and clearly different from Doc.

**Line ratio rule:** if a script draft has Cell in more than ~10% of lines, cut Cell lines.

### PENDING CAST DECISION (2026-10-20)
The user is leaning toward making the **lab robot** the sidekick instead of Cell: it fits every topic (not just biology), fits the brand (gears, lab, "Works"), and a synthetic voice is in character. If confirmed: give the robot a hero-tier design pass (expressions and poses, like Doc), move Cell's role and rules to the robot, and keep Cell as a guest character for body/biology episodes.

## 2. Screen placement for Doc

Rotate between these so it never feels static:

| Mode | Where | Use for |
|---|---|---|
| **Presenter** | Lower third, waist-up, bottom-left or bottom-right corner; the illustration fills the rest | Most explanation beats |
| **Foreground** | Big, close to camera, partly out of frame; the scene behind him | Reactions, dramatic lines, "here's the strange part" |
| **In the lab** | Full body in the lab set | Chapter openings, demos with machines |
| **In the illustration** | Small, inside the diagram (riding the ship, standing next to the giant cell) | Scale comparisons, journeys |
| **Off screen** | Voice only, pure illustration | Fast montages, anything where he'd clutter the frame |

Rough mix per episode: Presenter 40%, Off screen 30%, In the lab 15%, Foreground 10%, In the illustration 5%.

## 3. The Lab (home set)

- **Mostly static:** one recurring wide shot (the establishing shot) plus 2–3 fixed angles (workbench, chalkboard or screen wall, doorway). It's reused every episode so it feels like home.
- **Base dressing:** a workbench with glassware, a big chalkboard or screen wall, shelves of odd specimens and gadgets, a window, a brass-gear motif (it matches the logo), navy-and-brass colours from the branding.
- **Easter eggs:** small props from past episodes stay on the shelves (the tiger plush, the gum jar…).

## 4. The Wild Machines (the "demo" sections)

Each episode gets **1–3 machine sequences**. Doc uses a crazy device to "go into" the topic, and the machine is the transition from the lab into the illustration.

| Machine | Topic area | Transition |
|---|---|---|
| **The Mega-Microscope** | Germs, cells, the body, chemistry | Doc looks into the eyepiece, the camera dives through the lens, and we're zoomed into the microscopic world |
| **Hangar Ship** | Space, planets, stars, deep time | Hangar doors open, Doc in the cockpit, launch, then we're in space |
| **The Earth Drill** | Geology, the planet's interior, deep biosphere | The drill punches through the floor, then a cross-section dive through the layers |
| **The Laser Rig** | Light, energy, physics, heat | A beam fires through optics into a split-screen diagram |
| **Plasma Rifle / Particle Gun** | Atoms, radiation, extreme physics | A shot slows down, and the camera follows the particle |
| **Shrink Ray** | The body, insects, anything "tiny" | Doc and Cell shrink and walk into the subject |
| **Time Portal** | History, evolution, the "how old is this" beats | Doc steps through a swirling portal into the past |
| **The Thermo-Chamber** | Temperature, fever, climate | Dials and gauges, a chamber heating up |

Rules:
- A machine sequence is **2–6 seconds of setup** plus the dive. Don't let gadget comedy eat the explanation.
- Machines can malfunction once in a while for a gag (smoke, a spring pops), usually after a Cell pun.
- New machines get added to this table when an episode invents one, so they become recurring props.

## 5. Script format

```
DOC: Narration line.                                     [C3]
  > SCENE: Presenter, bottom-left | Lab key | Microscope dive → germs
CELL: Snarky or pun line.                                 [op]
  > SCENE: Cell pops in from the right; Doc deadpan stare
```

- Every line starts with `DOC:` or `CELL:`. Facts stay tagged with claim IDs (RESEARCH.md); Cell lines are usually `[op]`, and **Cell never introduces an unsourced fact**.
- `script.txt` for ElevenLabs is split into **two files**: `script_doc.txt` and `script_cell.txt`, with line numbers so the takes can be stitched in order.
- **A Cell joke must never undercut a sensitive fact** (deaths, depression, medical safety). No jokes *about* those things.

## 6. Tone: made for adults, not "adult"

- **Audience:** grown-ups. The humour is dry, ironic, self-aware and a little awkward, the kind adults get and kids mostly miss. Never kiddie, never explicit.
- **Clean:** no swearing, no sexual content, no gore, no punching down at real people or groups. It should be safe to watch at work or with kids in the room, it just isn't *aimed* at kids.
- **The ill-timed joke (a recurring bit):** Cell sometimes cracks a joke at exactly the wrong moment, when Doc is getting serious or building tension. Doc reacts with a flat "Really, man?" (or a long stare, a sigh, or "…Anyway.") and carries straight on.
  - The **joke targets the moment, never the subject.** Cell is being clueless, not mocking the people or the issue. Doc's reaction makes it clear the show takes the topic seriously.
  - Okay: *DOC: "But there's a darker side to all this." / CELL: "Darker? I just got comfortable." / DOC: "Really, man?" → continues.*
  - Not okay: any joke about the actual depression, death, illness or victims.
  - Max **once per episode**, so it stays a surprise.
- **Doc's reactions vary:** deadpan stare at the camera, a sigh, "Really, man?", "No.", "I'm going to pretend you didn't say that", or ignoring Cell completely. Don't use the same one twice in an episode.
