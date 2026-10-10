# THEME: Context Window

> **The person's career plays out as a live agent session.**
> A dark terminal splits into a streaming chat on the left and a context meter on the right. Tool calls retrieve each experience, a `<thinking>` block tells the hero story, and the final assistant message is their professional summary — written by the model, about them.

Reference build: `reference.html`. Read it before writing; copy its primitives and values, not its content.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| LLM/agent builders, context engineers, MCP developers | Computer vision, robotics, depth estimation, SLAM — use **Perception** |
| AI infra engineers, people whose job is building AI systems | Pure frontend or hardware engineers — use Blueprint or Speedrun |
| Researcher → engineer → builder arc with a language-model-native identity | People who *use* AI tools as part of another discipline — use Perception |
| Devtools builders, SDK authors, prompt engineers | Very formal targets (banking, law) — use Prospectus |

**The Perception boundary:** if the person's core output is trained models, sensor pipelines, or visual inference systems, use Perception. Context Window is for people whose output is the *infrastructure around* models: context handling, tool orchestration, agent loops, RAG pipelines, API design.

Tone: precise, self-aware, quietly impressive. The joke is that an agent is being asked to evaluate the person — and it does a very good job.

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0D1117` | Canvas background (GitHub Dark) |
| `panel` | `#161B22` | Chat bubbles, card backgrounds |
| `code` | `#21262D` | JSON/code block backgrounds |
| `border` | `#30363D` | Panel borders, separator lines |
| `user` | `#D29922` | User message labels, query text |
| `assistant` | `#3FB950` | Assistant output, success states |
| `tool` | `#58A6FF` | Tool call labels, JSON keys, accent |
| `think` | `#BC8CFF` | `<thinking>` block text and border |
| `dim` | `#8B949E` | Subdued text, placeholders |
| `txt` | `#E6EDF3` | Primary body text |
| `red` | `#F85149` | Errors, warnings, failed tool calls |
| `white` | `#FFFFFF` | Highlights |

Swap `tool` (the accent) for the user's brand colour if given. Keep the dark terminal world.

---

## 3. Typography

| Role | Font | Size |
|---|---|---|
| Section headlines, "CONTEXT COMPLETE" | Syne 800 | 80–160 px |
| Chat labels (`user:`, `assistant:`, `tool_call`) | JetBrains Mono 700 | 18–22 px |
| All body text, JSON, streaming output | JetBrains Mono 400 | 20–26 px |
| Context meter label | JetBrains Mono 700 | 18 px |

Everything except the final headline is monospace. The monospace is the identity.

---

## 4. Layout & world

- 1920×1080, 30 fps.
- **Left panel** (x 40–1160, width 1120): scrolling chat window — messages appear from top to bottom as the session progresses.
- **Right panel** (x 1200–1880, width 680): persistent context sidebar — token/context meter bar, retrieved chunks summary, model info.
- **Header bar** (y 30–86): full-width; shows `context_window` centred in Syne 800, `● live session` right-aligned in green.
- Subtle dot grid on the background (48 px spacing, 1.5 px dots, 40% opacity).
- Faint scanline overlay (every 3rd row, 2% alpha) for CRT feel.
- No grain — keep it crisp.

---

## 5. Motion system

- **Streaming text:** characters appear left-to-right at a rate driven by `progress * str.length`. A blinking cursor follows the last character while streaming.
- **JSON blocks expand** top-to-bottom: each line appears one at a time, paced by a progress value.
- **Panel entrances:** `ease-out-expo` slide in from 20 px below (opacity 0→1, y+20→y).
- **Panel exits:** `ease-in-expo` fade out (opacity 1→0) — no movement on exit.
- **Context meter** fills left-to-right with `ease-out-expo`. Color shifts from `tool` (blue) to `assistant` (green) as it approaches 100%.
- Beat-locked events: tool call pings, thinking block appearance, final response reveal all land on their beat.

---

## 6. Scene elements

- **Boot screen:** centred dark card, monospace lines typing in: `> context_window vX.Y`, `> loading tools...`, `> awaiting query...`. Cursor blinks.
- **User message:** panel with amber border. Label `user` in amber top-left. Text streams in.
- **Tool call block:** dark code-bg panel with blue border. Label `tool_call` + function name in blue. JSON result lines expand below.
- **`<thinking>` block:** panel with purple border. Opening `<thinking>` tag, body text streams, closing tag appears at the end.
- **Assistant message:** panel with green border. Label `assistant` in green. Final summary streams in — this is the most readable scene, no competing elements.
- **Context meter:** right sidebar, persistent from beat 18 onward. A labelled progress bar (`context: 30%` → `100%`). Below it: retrieved chunk count, estimated tokens, model name.
- **Outro:** `CONTEXT COMPLETE` in a gradient (blue→purple) in Syne 800, centred. Contact info below in dim monospace.

---

## 7. Sound design

- **100 BPM minimal electronic.** Triangle bass on the downbeat, square hi-hats on 16ths (quiet), soft pad chords every 4 beats.
- **Progression:** Am – F – C – G cycling. Calm and thoughtful, not driving.
- **Arc:** sparse boot → builds slightly on tool calls → full pad on thinking block → open space on final response → release on outro.
- **SFX map:**

| Event | Sound |
|---|---|
| Boot text line | soft square tick 1000–1400 Hz, 40 ms |
| Tool call start | two-note ping (root + fifth), sine, 150 ms |
| JSON line appear | faint square tick 800 Hz, 30 ms |
| Streaming text | random square ticks 1100–1400 Hz, 40 ms, ~60% density |
| `<thinking>` block open | soft sine sweep 300→600 Hz, 200 ms |
| Context meter reach 100% | two-note chime (C5 + E5), sine, 300 ms |
| Final response start | bass hit + chime cluster |
| Outro chord | held major chord (C–E–G–C), sine+triangle, 2 s fade |

- No silence beat required — this theme breathes through negative space in the chat.

---

## 8. Structure (beat map, ~72 s at 100 BPM ≈ 120 beats)

| Scene | Beats | What happens |
|---|---|---|
| Boot | 0–8 | Terminal boots. Three lines type in. Cursor blinks. |
| User query | 8–18 | Header bar appears. User message panel streams in the query: *"who is this person? give me their story."* |
| Tool call 1: retrieve_experience | 18–36 | Tool call panel slides in. JSON result lines expand: role, company, duration, impact, team size, stack. Context meter starts at 0%, reaches 30%. |
| Tool call 2: analyze_projects | 36–58 | Three project cards appear staggered. Each has name + one-line result. Context meter reaches 65%. |
| `<thinking>` block | 58–80 | Purple-border panel. Agent reasons about the person — the hero story told as internal monologue. Context meter reaches 85%. |
| Assistant final response | 80–108 | Green-border panel. The summary streams in clean. Context meter fills to 100%, chime. |
| Outro | 108–120 | `CONTEXT COMPLETE` gradient headline. Contact info in dim mono. Session timestamp. |

---

## 9. Content → visual mapping

| Content | Visual |
|---|---|
| **Hero experience** | `<thinking>` block — the agent reasons about the real problem, the insight, the solution, and the result. 3–4 sentences, streaming text. |
| **Projects** | Tool call 2 result — 3 project cards, each with name and one stat line. Staggered entrance. |
| **Wins / awards** | Extra JSON lines in tool call 1 (`awards:`, `recognitions:`), or a second `retrieve_wins()` tool call if content warrants. |
| **Skills** | JSON line in tool call 1 (`stack:`), or a `list_skills()` tool call showing a comma-separated string. |
| **Outro / contact** | Plain dim monospace below the `CONTEXT COMPLETE` headline: email · GitHub · LinkedIn · open to line. |
| **Persona image** | Small circle crop, top-right of the header bar, fades in after the query scene. |

---

## 10. Copy rules

- All labels (`user:`, `assistant:`, `tool_call`) in lowercase.
- JSON keys lowercase with underscores. Values in quotes where they're strings.
- The `<thinking>` block writes naturally — not bullet points. It's the agent thinking, not a list.
- The final assistant message is 2–3 sentences max. Clear, direct, specific to this person.
- `CONTEXT COMPLETE` in the outro is the only UPPERCASE text.
- Real numbers only. JSON values should match the resume exactly.

---

## 11. Questions to ask (theme-specific)

1. What's the single most interesting problem you've solved in AI/ML/agents? (Becomes the `<thinking>` hero story.)
2. What tool calls should name your actual projects? (Becomes the function names and JSON keys.)
3. What do you want the final assistant message to feel like — concise/analytical or warm/narrative?

---

## 12. Personalisation add-ons

Custom tool call function names from their real project names · their actual model name in the right panel (`model: claude-opus-4` etc.) · custom `<thinking>` opening phrase · persona image in header · their actual GitHub/LinkedIn in the outro · `open to:` line in the context meter footer.

---

## 13. Don'ts

- Don't make the tool calls feel generic — `retrieve_experience()` is a starting point, use names that echo the person's actual work.
- Don't let the `<thinking>` block read like a resume bullet list — it's prose reasoning, not enumeration.
- Don't show the full context meter at 100% until the final response starts.
- Don't overlap the left panel content with the right sidebar.
- Don't use `Math.random()` — seed all randomness from the person's name.
- Don't use a font other than JetBrains Mono and Syne — the monospace identity is the theme.

---

## 14. Build contract

- One self-contained HTML: **fonts base64-embedded** as `@font-face src: url('data:font/woff2;base64,…')`. Load every family/weight with `await document.fonts.load('700 1em JetBrains Mono')` etc. before frame 0. Never use relative paths or `fonts.ready`.
- `window.__render(t)` pure function of t; seeded hash randomness only.
- `window.__audio()` → OfflineAudioContext → base64 WAV; live mode uses the same `score()`.
- `window.__meta = {DUR, FPS, BPM}` — render toolkit reads this.
- `window.__ready` — a Promise that resolves only after all `document.fonts.load()` calls settle and the canvas is ready to draw frame 0.
- Text helpers multiply `globalAlpha`. No direct assignment.
- Streaming text: `Math.floor(progress * str.length)` chars visible, blinking cursor on the last char.
- JSON block height is dynamic — measure `lines.length * lineHeight + padding * 2`.

---

## 15. Theme quality check

- [ ] Frame 1 looks like a terminal/IDE — immediately legible as the context_window theme.
- [ ] Last frame echoes frame 1 (dark, monospace, terminal feel).
- [ ] Tool call pings land exactly on their beats.
- [ ] The `<thinking>` block text is fully readable before it exits (min 4 s visible).
- [ ] The assistant final response is the cleanest scene — no competing animations.
- [ ] Context meter reaches 100% exactly on the final response beat.
- [ ] Contact info readable ≥ 2 s on the outro.
- [ ] Right sidebar never overlaps left panel content.
