# Theme Index

One line per theme. Claude reads this at concept-proposal time to know what exists.

**Status:** ✅ ready (THEME.md + reference.html from a real reel) · 🟡 draft (THEME.md only — first real build becomes reference.html)

| Theme | Who it's for | Signature device | Status |
|---|---|---|---|
| `perception` | ML engineers, CV/robotics, AI researchers, LLM practitioners who *build* models | Lidar scan opening, detector boxes with confidence scores, depth-map terrain | ✅ ready |
| `speedrun` | Hackers, hackathon people, game devs, anyone with a mascot or strong online identity | Side-scrolling platformer; mascot on a kart; projects = levels; boss = hero experience; NEW PB outro | ✅ ready |
| `ipo-day` | Finance, IB, equity research, consulting, MBA, founders, traders | Live trading terminal; IPO filing bar; earnings beats; investor-relations outro | ✅ ready |
| `prospectus` | Premium finance, long-form editorial, policy, law, public sector, NGO | Monogram cover; horizontal timeline axis; gold rule lines; bar/waterfall/league-table analytics; navy + ivory + gold | ✅ ready |
| `blueprint` | Core engineering — electronics, VLSI, mechanical, civil, embedded, aero | Engineering drawing with title block; RTL-to-tape-out flow; XY scope for signal work | 🟡 draft |
| `context_window` | LLM/agent builders, context engineers, MCP devs, AI infra — people whose *output* is the infrastructure around models | Dark terminal; tool calls stream in; `<thinking>` block tells the hero story; context meter fills to 100% | 🟡 concept only — THEME.md exists, no reference.html yet. First real build becomes the reference. |
| `general` | Teachers, nurses, HR, ops, architects, anyone whose work doesn't fit a technical or financial metaphor | Warm cream editorial; horizontal timeline; DM Serif headlines; clean card entrances | 🟡 concept only — THEME.md exists, no reference.html yet. First real build becomes the reference. |

---

## What to borrow from each theme

| Theme | Primitives to reuse | Do not copy |
|---|---|---|
| `perception` | Detector box (`BOX`), scan sweep, confidence score animation, boot sequence, depth terrain, XY audio engine | The lidar road, the specific detector labels, the Barclays boss |
| `speedrun` | Speed-distance table (`D(t)`), split panel, jump parabola, coin collect, chiptune synth, kart body | Nino's mascot, the C4 diagram scene, the specific level names |
| `ipo-day` | Trading halt flash, bar fill animation, ticker tape, earnings beat card, market-style typography | The "ENGINEER TURNED ANALYST" headline, Rameshwari's specific deal |
| `prospectus` | Tombstone layout, waterfall chart primitives, editorial grid, slab-serif treatment | The Nari Shakti script cycle, the specific deal numbers |
| `blueprint` | Title block, XY scope drawing engine, pin diagram layout, tape-out timeline | Kaustubh's name in XY, the specific chip flow labels |

---

## For draft themes

First build on a draft theme:
1. Tell the person it's the first build — their reel becomes the reference.
2. Run stills after every scene.
3. After approval, strip personal details → commit as `reference.html`.
