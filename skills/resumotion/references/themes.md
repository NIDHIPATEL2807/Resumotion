# Theme Picker — Claude Reference

Claude reads this file to pick a theme and ask the right personal-touch questions.
Never show theme names or technical terms to the user.

---

## How to pick a theme

Read the resume. Match to the first theme that fits. If two fit equally, pick the bolder one.
If nothing fits → use `general`.

| Theme | Pick if resume mentions... |
|---|---|
| `perception` | ML, AI, computer vision, robotics, deep learning, PyTorch, YOLO, LLMs, data science, research, neural networks |
| `terminal` | backend, devops, infra, systems, Kubernetes, Docker, Linux, Go, Rust, compilers, databases, platform eng |
| `growth_chart` | finance, investment banking, consulting, MBA, private equity, trading, valuation, BCG/McKinsey/Bain, CFA |
| `swiss_grid` | product design, UX, brand, creative director, PM, design systems, Figma, typography, art direction |
| `campus` | current student, fresher, no full-time work experience, placement season, internship only |
| `annual_report` | legal, policy, editorial, non-profit, academia, research publishing, government, public sector |
| `general` | electrical, mechanical, civil, chemical engineering, teaching, HR, operations, healthcare, anything else |

Say why in one line before writing the script. Example: "Going with the ML/perception theme — camera systems and depth models are the core of your work."

---

## Universal personal-touch questions (ask these for every theme, max 2)

Ask only what you don't already have from the resume. Never ask all of these at once.

**Q1 — Feel**
"One word for how you want this to feel?"
→ `calm` / `fast` / `precise` / `bold` / `playful`
→ Maps to: transition speed, music energy, text density

**Q2 — Brand color**
"Any brand color or accent color you love? (hex, name, or just describe it)"
→ If yes: use as accent, override theme default
→ If no: use theme's approved palette

That's it. Don't ask about fonts, layout, or anything technical.

---

## Theme-specific add-ons (ask after Q1 + Q2 if relevant)

### All themes — optional logo
"Want to add a logo or photo? Attach it and I'll drop it in."
- Only use what the user attaches. Never fetch from the web.
- Auto-tint logo to accent color so it integrates with the palette.
- `persona_image` goes in the name_slam scene if provided.

### perception
**Mascot / model name**
"Do you have a nickname for your work or a model name you use? (e.g. 'nino.model', 'v2', 'the pipeline')"
→ Used in the opener boot text: `loading nino.model`
→ Makes it personal and instantly distinct from anyone else's reel

### terminal
**Shell / stack identity**
"What's your terminal look like — dark Dracula? Gruvbox? Tokyo Night?"
→ Maps to background shade and accent
"Any alias or function you're known for? Or a repo name?"
→ Used as the `$` prompt line in the opener

### growth_chart
**Deal / project label**
"Any project, deal, or case study you're proud of? Even a rough number is fine."
→ Used as the annotated milestone on the chart
→ Finance rule: label as 'valuation project' / 'case study' if it's academic. Never imply real deal.
"Any firm logo or school crest to include?" → attach only

### swiss_grid
**Tagline**
"One line that describes your design philosophy?"
→ Drops as the hero statement in huge type
"Portfolio URL?" → shown as a clean typographic link in the outro

### campus
**What you're looking for**
"What kind of role or company are you targeting?"
→ Used in the outro CTA: "open to [X] roles"
"Any club, project, or hackathon you want featured prominently?"
→ Wins grid priority

### annual_report
**Institution / publication**
"Any institution, journal, or organization you want featured?"
→ Shown with editorial weight in the opener
"A quote or line from your work you like?"
→ Used as the thesis line

### general
**What you do in plain English**
"How would you describe what you do to someone outside your field?"
→ Used as the thesis line — keeps it human, not jargon
"Anything visual that represents your work? (a tool, a diagram, a place, an object)"
→ Maps to a generic visual in the scene

---

## Theme design specs (for developers building new themes)

Each theme lives in `themes/<id>/` and must have:
- `theme.json` — id, name, version, for, bpm, key, palette_default, fonts, safe_motion, scenes
- `score.js` — music sections, instruments, sfx map
- `scenes/*.js` — one file per scene type
- `README.md` — preview GIF + who it's for + one-line concept

### Planned themes and their visual DNA

#### `perception` ✅ (built)
- **For:** ML / CV / AI / robotics engineers
- **Concept:** your work sees the world — detector boxes, confidence scores, depth maps
- **Sound:** 120 BPM D minor, drone → drop → groove → silence → resolve
- **Palette:** near-black `#0A0A0A`, off-white `#F5F5F5`, burnt orange `#FF6B2B`
- **Fonts:** Syne 800 + JetBrains Mono
- **Signature moments:** bounding box locks onto name with conf score, pipeline stages build left to right, stack flash on beat

#### `terminal` 🔜 (Month 2)
- **For:** backend / devops / systems / infra engineers
- **Concept:** your career as a build log — everything typed, compiled, deployed
- **Sound:** clicky mechanical keys, glitchy bit-crushed beat, ~130 BPM
- **Palette:** near-black `#0D0D0D`, terminal green `#00FF41` or amber `#FFB000`, muted grey
- **Fonts:** JetBrains Mono only (monospace throughout)
- **Signature moments:** name types out letter by letter with cursor, `git log` of career milestones, build bar fills on beat, stack items `npm install`-style
- **Variants:** dark-green retro / amber hacker / minimal grey

#### `growth_chart` 🔜 (Month 2, highest priority after perception)
- **For:** finance / IB / consulting / MBA / trading
- **Concept:** your career as a rising chart — milestones as annotated data points
- **Sound:** soft piano, ~100–110 BPM, clean and restrained
- **Palette:** navy `#0A2342`, white, slate `#5B6B82`, gold `#C9A227`
- **Fonts:** IBM Plex Sans + IBM Plex Mono
- **Signature moments:** line chart draws upward across the screen, each role is an annotated point, numbers tick up, deal/project label drops at the peak
- **Rule:** always label case study numbers as "valuation project" or "case study" — never imply real transactions

#### `swiss_grid` 🔜 (Month 2–3)
- **For:** product designers / UX / brand / creative directors / PMs
- **Concept:** strict typographic grid, hard cuts on the beat, color blocks
- **Sound:** minimal techno, crisp percussion, lots of negative space, ~118 BPM
- **Palette:** white `#FFFFFF`, black `#000000`, one bold accent (red `#E63946` default, overrideable)
- **Fonts:** Neue Haas Grotesk or Aktiv Grotesk + mono for labels
- **Signature moments:** huge type slams in on grid, color block wipes between scenes, portfolio URL as typographic hero

#### `campus` 🔜 (Month 3, placement season priority)
- **For:** students / freshers / placement season / first internship
- **Concept:** potential over experience — energy, ambition, learning velocity
- **Sound:** upbeat, bright, ~125 BPM, more playful than other themes
- **Palette:** bright but not childish — deep blue + electric yellow, or dark + coral
- **Fonts:** Syne + Inter
- **Signature moments:** skills building up like a loading bar, hackathon wins as hero moments, CTA is "open to opportunities" with target role

#### `annual_report` 🔜 (Month 3)
- **For:** academics / lawyers / policy / editorial / non-profit / public sector
- **Concept:** weight and credibility — editorial gravitas, not startup flash
- **Sound:** chamber strings or minimal piano, slow, ~80–90 BPM
- **Palette:** ivory `#F6F3EC`, ink `#141414`, oxblood `#7A1E2C`
- **Fonts:** DM Serif Display + Inter
- **Signature moments:** text fades in slowly with weight, institution name in large serif, quote from their work as thesis

#### `general` 🔜 (Month 2, needed to unblock non-tech users)
- **For:** electrical / mechanical / civil / chemical eng / teaching / HR / ops / healthcare / anyone else
- **Concept:** clean, human, universally readable — no domain metaphors, just bold storytelling
- **Sound:** neutral electronic, ~110 BPM, neither hype nor sleepy
- **Palette:** near-black + off-white + one warm accent (user's brand color if given)
- **Fonts:** Syne + Inter
- **Signature moments:** name in big clean type, role as a plain strong statement, timeline of experience, skills as a clean grid
- **Note:** this is the safety net — it must look good on ANY resume type. No bounding boxes, no charts, no terminal. Pure typographic storytelling.

---

## Build order

1. `perception` — done ✅
2. `general` — needed now, unblocks non-tech users
3. `growth_chart` — biggest untapped audience (finance/MBA crowd)
4. `terminal` — strong dev community appeal
5. `swiss_grid` — design community, slower to reach
6. `campus` — placement season (time it for Aug–Oct India cycle)
7. `annual_report` — niche but high credibility
