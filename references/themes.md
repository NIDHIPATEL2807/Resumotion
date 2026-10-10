# Theme Picker — Claude Reference

Read the resume. Match to the first theme that fits. If two fit equally, pick the bolder one. If nothing fits → `general` (not built yet — tell the user and pick the closest available).

Say why in one line before writing anything else. Example: *"Going with Perception — camera systems and depth models are the core of your work."*

---

## Theme → person match

| Theme | Pick if the resume mentions… |
|---|---|
| `perception` | ML, AI, computer vision, robotics, deep learning, PyTorch, YOLO, LLMs, agents, data science, neural networks, ONNX, OpenCV |
| `speedrun` | game dev, hackathons, hacker culture, fast shipping, open source, side projects, a personal mascot or strong online identity |
| `ipo` | finance, investment banking, equity research, consulting, MBA, private equity, trading, valuation, case competitions, BCG/McKinsey/Bain/Goldman |
| `prospectus` | premium finance, long-form editorial, policy, law, public sector, NGO — wants calm and weight over adrenaline |
| `blueprint` | electronics, VLSI, electrical, power, embedded, mechanical, civil, chemical, aero, instrumentation — any core engineering discipline with technical projects |
| `context_window` | LLM/agent builders, context engineering, MCP, AI infra, anything where the person's actual job is building AI systems (not just using them) |
| `general` | teaching, HR, operations, healthcare, architecture, anything that doesn't fit above |

---

## When the person is between themes

- ML + finance → `perception` (their technical work is the differentiator; finance background shows in the case study)
- Finance + lots of wins/competitions → `ipo` (the numbers and deal energy fit)
- Agent builder with also a lot of CV work → `context_window` (the agent/LLM framing is more forward-looking)
- Core eng student with some software → `blueprint` (the hardware is rarer, lead with it)
- Hacker with a real job history → `speedrun` only if they have personality/mascot energy; else `perception` or `general`

---

## Theme-specific opening line (say this to the user)

| Theme | What to say |
|---|---|
| `perception` | "Going with Perception — the visual language of your CV/ML work applied to your career." |
| `speedrun` | "Going with Speedrun — your career as a world-record run, with [mascot/dino] as your player character." |
| `ipo` | "Going with IPO Day — your career as a listing on a live trading terminal." |
| `prospectus` | "Going with Prospectus — premium editorial weight, like a deal book for your career." |
| `blueprint` | "Going with Blueprint — your career drafted as an engineering drawing, discipline pack: [VLSI/Mechanical/Civil/…]." |
| `context_window` | "Going with Context Window — your career as a live agent conversation, tool calls and all." |

---

## Build order (status)

Two statuses:
- **ready** — THEME.md + a reference.html built from a real person's reel. Safe to use normally.
- **draft** — THEME.md only. The first real build for an actual person becomes the reference. See SKILL.md §"Draft themes" for how to handle.

| Theme | Status |
|---|---|
| `perception` | ✅ ready |
| `speedrun` | ✅ ready |
| `ipo` | ✅ ready |
| `prospectus` | ✅ ready |
| `blueprint` | 🟡 draft — THEME.md exists; first real build becomes reference.html |
| `context_window` | 🟡 draft — THEME.md exists; first real build becomes reference.html |
| `general` | 🟡 draft — THEME.md exists; first real build becomes reference.html |
