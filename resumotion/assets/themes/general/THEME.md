# THEME: General

> **The person's career told as a beautifully typeset page.**
> A warm, editorial canvas — cream paper, strong ink typography, a horizontal timeline with milestone nodes. No gimmicks, no metaphors. Just their story, told clearly and elegantly.

Reference build: `reference.html`. Read it before writing; copy its primitives and values, not its content.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| Teachers, counsellors, nurses, social workers | Engineers with strong technical identity (use Blueprint, Speedrun, or Perception) |
| HR, operations, project management, strategy | Finance/IB/consulting (use IPO or Prospectus) |
| Architects, designers, urban planners | AI/ML builders (use Perception or Context Window) |
| Healthcare professionals, researchers (non-ML), academics | Anyone who wants a bold, high-energy reel (use Speedrun) |
| Anyone whose work doesn't fit a technical or financial metaphor | |

Tone: warm, clear, confident without being loud. Like a well-designed annual report or a beautifully typeset cover letter.

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `bg` | `#F8F4EE` | Warm cream canvas background |
| `panel` | `#FFFFFF` | Card / section backgrounds |
| `ink` | `#1C1917` | Primary text, strong headlines |
| `warm` | `#78716C` | Subdued text, labels, captions |
| `line` | `#E7E5E4` | Timeline line, card borders, dividers |
| `accent` | `#DC2626` | Primary accent — overrideable with brand color |
| `accent2` | `#FEF2F2` | Accent tint for card highlights |
| `white` | `#FFFFFF` | Card fills, text on dark elements |

Swap `accent` for the user's brand colour if given. Keep the cream-and-ink world. If accent is dark, use it on the timeline nodes and chapter numbers; if it's light, keep ink as the dominant tone and use accent as the underline/highlight.

---

## 3. Typography

This theme uses **DM Serif Display** (headlines) and **DM Sans** (body) — not Syne. Using Syne would make General look like a sibling of Perception and Speedrun. The DM pair reads editorial and warm; Syne reads geometric and tech.

| Role | Font | Size |
|---|---|---|
| Name, section titles, outro headline | DM Serif Display 400 | 80–180 px |
| Tagline, role, chapter labels | DM Sans 400 | 28–48 px |
| Card body, company names, dates | DM Sans 400 | 22–32 px |
| Timeline node labels | DM Sans 700 | 18–24 px |
| Thesis statement | DM Serif Display 400 italic | 36–44 px |

DM Serif Display has no weight variants — use italic for emphasis. Fit-to-width on the name — it can be any length. Section titles UPPERCASE with wide letter-spacing (4–8 px). Dates in warm gray, right-aligned.

> **Font sourcing:** embed DM Serif Display and DM Sans from Google Fonts as base64 woff2 in the HTML. The toolkit/fonts/ directory does not bundle them — fetch them once, convert, and embed. If the person needs an Indic script, add a separate `@font-face` family (`Indic0`) for their script alongside DM Sans.

---

## 4. Layout & world

- 1920×1080, 30 fps.
- **Horizontal timeline** at y=680: a line running left to right with circular nodes. Each node is a role or milestone. Timeline enters from the left as the reel progresses.
- **Content zone** (y 120–620): cards, titles, and text float in the upper area above the timeline.
- **Footer strip** (y 880–1040): always-present warm strip with the person's name (small) and the current chapter label.
- Subtle paper texture: very faint noise layer (alpha 0.015), no visible grain.
- A thin 2 px accent-coloured line at the top of the canvas acts as a chapter progress bar.
- No vignette — keep the warmth even to the edges.

---

## 5. Motion system

- **Card entrances:** ease-out-expo slide in from 30 px below, opacity 0→1 over 0.4 s.
- **Card exits:** ease-in fade (opacity 1→0), 0.25 s. No movement on exit.
- **Timeline draw:** the line draws left-to-right with ease-out. Each node pops in with a quick scale 0→1.1→1 bounce (ease-out-back).
- **Text reveals:** large headlines scale from 95%→100% opacity 0→1 over 0.5 s.
- **Chapter bar** (top progress line) fills steadily across the whole reel.
- All major entrances are beat-locked. Exits are timed to clear one beat before the next entrance.

---

## 6. Scene elements

- **Name scene:** full-screen. Name in Syne 800, fit-to-width. Role below in Syne 400 warm gray. Tagline below that in ink, smaller. A thin accent underline animates under the name.
- **Thesis card:** a wide panel with the person's core statement — what they stand for. Left-bordered with a thick accent line (6 px). Text in Syne 800 40 px.
- **Timeline:** horizontal line at y=680. Each node is a filled circle (28 px radius) in accent, with a white label underneath (company/org), and a small date above. The current node pulses with a ring animation. Past nodes are solid; upcoming nodes are dim.
- **Experience card:** floats above the active timeline node. White panel, rounded 16 px corners, 2 px accent-border on the left. Contains: role (Syne 800 32 px), company (Syne 400 26 px warm), date range (right-aligned warm), 2–3 one-line bullet achievements in ink 24 px.
- **Project card:** smaller card variant, 560 px wide. Grid of 2–3 cards. Title in Syne 800 28 px, one-line description below, one stat in accent below that.
- **Skills row:** chips on a warm bg. Each chip is a rounded rect with ink border, label in Syne 400 22 px. Chips appear left to right, one per beat.
- **Outro:** name centred large (Syne 800 160 px), role in warm gray below, contact info in accent, `open to:` in warm, a thin accent line below the name.

---

## 7. Sound design

- **88 BPM warm acoustic-electronic.** A soft piano-style melody (triangle oscillator), muted pulse bass, quiet brushed hats (noise envelope).
- **Progression:** C – Am – F – G (warm, resolved, hopeful). Stays in major throughout.
- **Arc:** gentle intro melody → builds a pad layer on the hero story → calm and full on skills → warm resolution on outro.
- **SFX map:**

| Event | Sound |
|---|---|
| Name reveal | soft chime strike (sine C5), 300 ms |
| Timeline node pop | short sine ping (E5), 150 ms |
| Card entrance | subtle soft click (noise burst, 30 ms, 400 Hz) |
| Achievement line reveal | very faint sine tick (A4), 80 ms |
| Section transition | soft two-note chime (C5–G5), 250 ms |
| Skills chip appear | coin-like ping (G5 + D6 arpeggio), 100 ms |
| Outro name reveal | warm sustained chord (C–E–G), triangle, 2 s |

- No silence beat. The warmth should carry through without drama.

---

## 8. Structure (beat map — scale to content, target ~55–62 s)

**Never pad.** Set beat count from what the person has, not from a template. A thin resume (1–2 roles, 2 projects) should be ~50 s. A rich one (3+ roles, wins, 3 projects) can reach 62 s. The default below is for a medium resume (~88 beats at 88 BPM ≈ 60 s). Cut any scene with no content. Never add filler transitions to hit a round number.

| Scene | Beats (default) | What happens |
|---|---|---|
| Title / name | 0–10 | Cream bg fades in. Name reveals. Role fades in below. Tagline. Accent underline draws. |
| Thesis | 10–20 | Thesis card slides in from below. Core statement reveals. Left accent border draws. |
| Hero experience | 20–48 | Timeline draws. Hero node pops. Experience card rises — role, company, date, 2–3 achievements one per beat. Ring pulses. |
| Projects | 48–66 | 2–3 project cards staggered 4-beat spacing. Each: name, description, one stat (if available). Skip if fewer than 2 projects. |
| Skills | 66–78 | Chips left-to-right, one per beat. Category label per row. Skip if resume has no distinct skill categories. |
| Outro | 78–88 | Name centred large. Role. Contact info line by line. Accent underline. Footer holds. |

**Scaling rules:**
- Each experience role beyond the hero adds 8 beats (card + 2 achievements).
- Each project adds 4 beats.
- Wins/awards: if ≥ 2, add a 6-beat honours row between projects and skills; else fold into the hero card.
- Skills: skip the scene entirely if the person's skills are already obvious from their roles.
- Never go below 44 beats (~30 s) or above 95 beats (~65 s).

---

## 9. Content → visual mapping

| Content | Visual |
|---|---|
| **Hero experience** | Timeline hero node (largest) + experience card with 3 achievements, one per beat. If there are multiple roles at one org, stack them in the card. |
| **Other experience** | Additional timeline nodes, smaller cards. Show 1–2 achievements each. |
| **Projects** | Project card grid. Name + description + one number (if available). |
| **Wins / awards** | Small achievement chips below the project cards, or inline in the experience card if space allows. |
| **Skills** | Chip rows, one category per row. 4–6 chips per row max. |
| **Outro / contact** | Name + role + email · portfolio · LinkedIn. `open to:` line in warm gray. |
| **Persona image / headshot** | Circle crop, 180 px, top-right of the name scene. Fades in after the name reveals. |

---

## 10. Copy rules

- Name in Syne 800 — exactly as written, no caps transformation.
- Section titles UPPERCASE (e.g. `EXPERIENCE`, `PROJECTS`, `SKILLS`).
- Role names and company names sentence case.
- Achievement lines start with a number if one exists: `"Reduced onboarding time 40%"`. If no number, use a strong verb: `"Redesigned the intake process"`.
- Sub-lines ≤ 8 words.
- Thesis card: one strong sentence, ≤ 12 words, their actual words if possible.

---

## 11. Questions to ask (theme-specific)

1. What's the one thing you'd want someone to remember after watching this? (Becomes the thesis card.)
2. Any brand color or palette you'd like? (Overrides the accent red.)
3. Want to include a headshot or photo?

---

## 12. Personalisation add-ons

Brand accent color · headshot in circle crop · custom thesis statement · footer tagline · portfolio URL as a live link in the outro · section order reordering (skills before projects for non-technical people) · language/Indic font support.

---

## 13. Don'ts

- Don't make it feel corporate or cold — the warmth of the cream bg must come through.
- Don't use more than 3 achievement lines per experience card — white space matters here.
- Don't overlap cards with the timeline nodes.
- Don't pack the skills section — 4–6 chips per row, generous padding.
- Don't change the background to white — cream (#F8F4EE) is intentional.
- Don't use Syne — this theme is DM Serif Display + DM Sans. Syne makes it look like Perception.
- Don't use JetBrains Mono — there is no code in this theme.

---

## 14. Build contract

- One self-contained HTML: **fonts base64-embedded** as `@font-face src: url('data:font/woff2;base64,…')`. DM Serif Display and DM Sans are not in toolkit/fonts/ — fetch the woff2 files, convert to base64, and embed them. Load every family/weight with `await document.fonts.load('400 1em DM Serif Display')` etc. before frame 0. Never use relative font paths or `fonts.ready`.
- `window.__render(t)` pure function of t; seeded hash randomness only.
- `window.__audio()` → OfflineAudioContext → base64 WAV; live mode uses the same `score()`.
- `window.__meta = {DUR, FPS, BPM}` — render toolkit reads this.
- `window.__ready` — a Promise that resolves only after all `document.fonts.load()` calls settle and the canvas is ready to draw frame 0.
- Text helpers multiply `globalAlpha`. No direct assignment.
- Timeline is drawn incrementally — measure node positions from content, don't hardcode x values.
- All card heights are dynamic — measure text, compute height, never assume.

---

## 15. Theme quality check

- [ ] Frame 1 reads warm and editorial — cream bg, name large, clean.
- [ ] Last frame echoes frame 1 (name centred, clean outro).
- [ ] Timeline nodes pop exactly on their beat.
- [ ] Experience achievements reveal one per beat — readable rhythm.
- [ ] Thesis card is the visual anchor of the first half.
- [ ] Skills section has visible breathing room between chips.
- [ ] Contact info readable ≥ 2 s on the outro with no animation competing.
- [ ] Accent color has ≥ 4.5:1 contrast against cream background.
