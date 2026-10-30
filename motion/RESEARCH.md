# RESEARCH.md: the research and fact-check layer

How every episode goes from topic → verified script. This sits *before* DESIGN.md and STYLING.md. A beautiful video with a wrong fact loses trust (and Kurzgesagt-tier audiences check). Our edge is speed, but accuracy is non-negotiable.

Pipeline: **1. Pick → 2. Brief → 3. Research → 4. Outline → 5. Script → 6. Fact-check → 7. Sources doc → (DESIGN/STYLING → build)**

---

**Channel rule (user, 2026-10-29): we don't lie.** We report what credible sources have reported, attributed to them. Anything we can't trace to a published source gets cut, not guessed.

---

## 1. Pick the topic

What their catalogue shows works (from the reference grid): every title is either a **provocative question about you** ("Do You Have a Free Will?", "Why Does Fentanyl Feel So Good?"), an **absurd what-if** ("What If It Rains Bananas For A Single Day?"), a **hidden-world reveal** ("There is Life Hiding Inside Earth"), or a **body or brain mechanism** ("Fever Feels Horrible, but is Actually Awesome"). Thumbnails use a 1–3 word noun phrase: `FEVER`, `MEAT`, `DEEP BIOSPHERE`.

Score each candidate from 1 to 5 on each criterion; build only topics scoring ≥ 20/30:

| Criterion | Question |
|---|---|
| **Personal stakes** | Does it touch the viewer's body, mind, money, or future? |
| **Surprise** | Is there a counterintuitive "turn" (fever is *good*, your brain *blinds* you)? |
| **Visualisable** | Can every beat be drawn with our mascot and scene types (DESIGN §3)? |
| **Evidence depth** | Are there ≥ 5 solid sources (reviews, textbooks, agencies)? |
| **Search and trend demand** | Is it trending, evergreen-searched, or newsworthy right now? |
| **Not already owned** | Has Kurzgesagt (or another big channel) done this exact angle? If yes, find a different angle or skip it. |

**Rule:** never remake one of their episodes. Covering a nearby topic with a different angle is fine (e.g. they did "Fever"; we could do "Why Your Body Makes You Feel Sick on Purpose", which is about sickness behaviour, not fever).


### 1b. Story rules (added 2026-10-25, from the Infographics Show teardown: ANALYSIS_infographics_show.md)
Score three more criteria (1–5); build only if each is ≥ 3:
| **Conflict** | Is there a villain, a cover-up, a fight, a scandal or a scientific dispute? |
| **Viewer stakes** | Does it threaten the viewer's money, body, safety, kids or privacy? |
| **Escalation** | Can it get worse 4–5 times, chapter after chapter? |

Science "why" topics are framed through the stakes ("Why the flu keeps beating your vaccine", not "How flu mutates").

**Script rules:**
- **Cold open:** a contrarian claim + stakes + a promise. Never the answer.
- **Hook line every 30–40 s (~1 per 90 words):** a one-sentence turn that closes a beat and opens a question ("But was it enough?", "And it doesn't stay in the bottle."). Mark them ⚡ in script.md.
- **Escalation ladder:** each chapter raises the stakes; a midpoint twist.
- **Numbers with consequences:** every stat answers "what does it cost me / who gets hurt?"
- **End on a verdict + a next-video hook.**
- **Narration:** one confident narrator (Doc's voice) carries it. Sidekick jokes are optional and rare.
- **Contested science:** present both the alarming result and the critique, frame allegations as allegations with the denial, and never claim causation from correlation.

## 2. Brief (one paragraph, before any research)

- **Question:** the single question the video answers.
- **Turn:** the counterintuitive payoff we *suspect*. (Research may kill it. That's fine; find the real one.)
- **Audience takeaway:** what the viewer says to a friend afterward.
- **Format:** short (40 s) or long-form (9–20 min).

## 3. Research

Use the `deep-research` skill (parallel research subagents) for long-form; direct web search for shorts.

**Source tiers.** Every fact in the script needs a tier ≤ 2 source, or must be cut or softened.

| Tier | Source types | Use |
|---|---|---|
| **1** | Systematic reviews and meta-analyses, major textbooks, government or intergovernmental agencies (NIH, CDC, WHO, NASA, IPCC), peer-reviewed papers in established journals | Any claim, including numbers |
| **2** | Reputable science journalism (Nature News, Science, Quanta, Ars Technica), university press releases *with* the paper linked, major news outlets for events | Context, events, quotes |
| **3** | Wikipedia, popular books, other YouTube channels | **Leads only.** Follow them to tier 1 or 2. Never cite them. |
| **✗** | Tabloids, content farms, social posts, AI-generated pages, single preprints for big claims | Don't use. (The tiger short's "victim name" rumour came from here.) |

**The research file** (`motion/<slug>/research.md`) is organised by claim:

```
## Claim: Amur tigers can weigh up to 300 kg
- Status: ✅ verified | ⚠️ contested | ❌ false
- Number used in script: "up to 300 kilos"
- Sources: [T1] <title, author, year, URL> — exact supporting quote/figure
           [T2] ...
- Nuance: typical wild males 180–220 kg; 300+ are rare/historical. → script says "up to"
```

Research rules:
- **Two independent sources** for every number and every surprising claim.
- Record the **exact figure and range** the source gives; pick wording that's true across the range ("up to", "about", "as many as").
- **Note the date** for anything that changes (statistics, ongoing events, "the largest ever…").
- Hunt for **counter-evidence** for the main turn. If experts disagree, the script says so ("some researchers think…").
- Collect **visual anchors** while researching: comparisons that make numbers drawable ("4 grown men", "the length of a bus").

**Length planning:** budget about 1 verified claim per 60–80 words. A 10-minute episode (~1,500 words) needs about 20–25 claims. Episode 1 found 17 and came in at ~8 minutes.

**Keep a process log:** every episode gets `motion/<slug>/process.md` recording each step, the corrections found, and lessons learned. Add the lessons back into this file.

## 4. Outline

Long-form follows DESIGN §6 (cold open → 4 chapters → outro). For each chapter, list the claims (by research-file heading) it uses. A beat with no claim behind it is either opinion (label it as such) or gets cut.

## 5. Script

- Explainer voice: curious, slightly wry, second person ("your body"), short sentences. Roughly 150 words per minute.
- Each line is drawable (DESIGN §3), and the script and visuals match line by line.
- Hedge exactly as much as the evidence does: "can", "up to", "probably", "scientists think".
- Mark every factual line with its claim id in a hidden column (`script.md`), while `script.txt` stays clean for ElevenLabs.

## 6. Fact-check pass (separate from writing)

Done as a **fresh pass**: an independent agent or a new reading, never "re-read what I wrote". For every line:

1. Does the cited source *actually say this*? (Open it and find the sentence.)
2. Is the number still current?
3. Did simplification change the meaning? ("Tigers attack from behind" → true as an ambush tendency, not an absolute.)
4. Could this hurt a real person? (Real deaths, crimes and medical advice need extra care: no names from unverified sources, no medical instructions, and "talk to a doctor" where relevant.)

Output: a ✅/⚠️/❌ table. Any ❌ blocks recording; ⚠️ gets reworded or hedged.

## 7. Sources doc

Publish the sources the way they do: a public doc linked in the YouTube description, listing every claim → source. It builds trust and costs us nothing because `research.md` already has it. Deliver it as a Claude Doc or Google Doc, whichever the user prefers.

---

## Topic backlog (our angles, not their episodes)

| Working title | Thumbnail word(s) | Turn | Format |
|---|---|---|---|
| Why Your Body Makes You Feel Sick on Purpose | SICK ON PURPOSE | Lethargy and appetite loss are an immune *strategy* | Long |
| What If You Stopped Sleeping Entirely? | NO SLEEP | The timeline, from microsleeps to fatal familial insomnia | Long |
| The Animal That Can't Die (Turritopsis) | IMMORTAL | Biological immortality exists, and it's a jellyfish | Long |
| Why Tigers Are the Perfect Ambush Machine | APEX | Extend the tiger short | Long |
| How Much of You Is Actually You? | NOT YOU | Microbes, mitochondria, cell turnover | Long |
| What Happens to Your Brain on Social Media | DOPAMINE TRAP | Variable rewards, the same mechanism as slot machines | Long |
| Why You Can't Tickle Yourself | TICKLE | The brain's prediction cancels the signal | Short |
| What If the Moon Disappeared? | NO MOON | Tides, the axis wobble, nights | Long |
| Why Cats Purr (Nobody Is Sure) | PURR | Real open science question, with competing theories | Short |
