# Concepts — How to invent an original reel

Read this before proposing concepts. The goal: a complete stranger from the person's field watches 3 seconds and thinks "yes, that's one of us."

---

## Step 1: Find their world

Read the resume for:
- **Field vocabulary** — the words their peers use that outsiders don't. "Tape-out" not "deploy". "Coverage beats" not "publish". "Inference" not "run". These become on-screen labels.
- **Signature story** — the one thing they're proudest of or that changed how they work. This becomes the hero scene.
- **Hobby / mascot / pen name** — something personal that could become the visual identity.
- **Where they're going** — what they're open to. This shapes the outro.

---

## Step 2: Pick one metaphor

The metaphor maps resume parts to visuals. One metaphor per reel — don't mix.

Good metaphors that have worked:
| Metaphor | Maps to | Best for |
|---|---|---|
| Career as game | projects = levels, internship = boss, wins = trophies, skills = coins | Hackers, game devs, fast builders |
| Career as IPO | certifications = analyst coverage, wins = earnings beats, CTA = investor relations | Finance, MBA, founders |
| Career as chip | projects = macro blocks, skills = pins, goal = tape-out, first silicon | VLSI, chip design, hardware |
| Career as agent session | experience = tool calls, hero story = `<thinking>` block, summary = final response | LLM/agent builders |
| Career as scientific paper | experiments = sections, methodology = figure plates, conclusion = abstract | Researchers, academics |
| Career as city | experiences = buildings that light up floor by floor, skills = infrastructure | Architects, urban planners, ops |
| Career as editorial | roles = chapters, skills = footnotes, thesis = pull quote | Teachers, HR, generalists |

New metaphors: if none of these fit, invent one. The test is in Step 5.

---

## Step 3: Choose the system

Once the metaphor is chosen:

| Decision | Options | Guidance |
|---|---|---|
| **Palette** | Dark (ink on black) or light (ink on cream/white) | Dark for tech/finance; light for general/editorial |
| **Accent** | One colour only | Use their brand colour if given; default to theme's accent |
| **Fonts** | Two OFL fonts from @fontsource | One display, one body — don't mix more than 2 families |
| **BPM** | 80–160 | Fast (140+): hackers, speedrun feel. Medium (100–120): ML/finance. Slow (80–96): editorial/general |
| **Key** | Major (hopeful, resolved) or minor (tension, drama) | Major for most; minor for the boss fight section only |
| **Signature primitive** | One visual device unique to this concept | Detector boxes, streaming text, XY scope, split panel, lidar sweep, etc. |

Write these decisions into a mini THEME.md using `assets/themes/_template/THEME.md`.

---

## Step 4: Write the mini THEME.md

Every original reel needs its own THEME.md, even if it's never promoted to a full theme. Fill in at minimum:
- Concept (one line)
- Palette (tokens + hex)
- Typography (2 families)
- BPM and key
- Scene structure (beats → what's on screen)
- Content → visual mapping

---

## Step 5: Check — "would they recognise it?"

The test: could a colleague of this person watch 3 seconds and say "yes, that's one of us"?

Common failures and fixes:
| Failure | Fix |
|---|---|
| Looks like a generic tech reel | Find the field-specific vocabulary and use it as labels |
| Looks like another person's reel | Check anti-sameness rules in SKILL.md; add the bespoke moment |
| Metaphor doesn't fit the person's seniority | A junior with 2 projects ≠ IPO; a 10-year career ≠ "level 1" |
| Visual is cool but wrong discipline | The oscilloscope was visually strong but wrong for a chip designer — it reads as signals/measurement, not VLSI |

---

## Step 6: Promote to a full theme

A great original reel can become a new theme if:
- The metaphor generalises (works for more than one person in that field)
- The reference HTML is built from a real person's reel (not invented content)
- A THEME.md following the full template is written
- It's meaningfully different from the 7 existing themes

Add one line to `assets/themes/index.md` and commit.

---

## Existing concept bank (for Remix option)

| Visual device | From | Can be remixed into |
|---|---|---|
| Detector boxes + confidence scores | Perception | Any analytical field (law, policy, design review) |
| Split-panel + streaming text | Context Window | Any workflow-heavy role (product, ops, research) |
| Level banner + boss fight | Speedrun | Sports, competitive anything, game-like careers |
| Trading terminal + bar fills | IPO Day | Any field with metrics and competition |
| XY scope audio drawing | Blueprint | Music engineers, signal processing, physics |
| Editorial timeline | General | Any long career with clear chapters |
