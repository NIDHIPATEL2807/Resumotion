# THEME: Prospectus

> **The person's career filed as a premium deal document.**
> Deep navy canvas, ivory serif type, gold rule lines. A horizontal timeline axis anchors the reel; each scene advances a marker along it. Analytical visuals — bar charts, waterfall, league table — render as if lifted from an actual deal book.

Reference build: `reference.html`. Read it before writing; copy its primitives and values, not its content.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| Finance undergrads building toward IB / ER / consulting | Active deal-makers with confidential transactions (use IPO Day instead) |
| MBA and pre-MBA candidates with case competition wins | Anyone who wants energy or speed — use IPO Day |
| Policy, law, NGO, public sector — calm editorial weight | Technical engineers (use Blueprint or Perception) |
| Researchers and academics wanting editorial gravitas | People with no quantitative wins or formal experience |

Tone: measured, precise, authoritative. The person is the analyst who wrote this document about themselves.

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0B1F3A` | Main canvas — deep navy |
| `bg2` | `#0F2747` | Panel / card backgrounds |
| `iv` | `#F5F1E8` | Primary text — ivory |
| `mu` | `#93A0B4` | Subdued text, labels, captions |
| `gd` | `#C8A55A` | Gold — accent, rules, live axis marker, "1st" badges |
| `gn` | `#3FA37A` | Green — positive metrics, upward bars |
| `ln` | `#22395C` | Border lines, tick marks, dividers |
| `dk` | `#081629` | Darkest background — behind charts |

Swap `gd` (gold) for the user's brand colour if given. Keep the navy world — it is the identity. Check that any brand colour reads with ≥ 4.5:1 contrast against `#0B1F3A`.

---

## 3. Typography

Two families — a serif display and a monospace. No Syne. This is what separates Prospectus visually from all other themes.

| Role | Family | Weight / Style | Size |
|---|---|---|---|
| Name, section headlines, deal titles | Serif display (e.g. **Fraunces**) | 600 upright | 52–140 px |
| Italic subtitles, taglines, roles | Serif display | 400 italic | 30–56 px |
| Labels, monogram ring text, tickers, stats | Monospace (e.g. **Pitch Sans Mono** or **JetBrains Mono**) | 400 / 600 | 18–28 px |

Fit-to-width on the name — it can be any length. Headlines in sentence case (not UPPERCASE). Gold italic for the role / positioning line.

> **Font sourcing:** the reference build uses custom embedded fonts. For new builds, use Fraunces (OFL, available at @fontsource/fraunces) + JetBrains Mono (already in `assets/fonts/`). Embed both as base64 woff2 via `scripts/fonts.py`.

---

## 4. Layout & world

- 1920×1080, 30 fps.
- **Horizontal timeline axis** at y ≈ 968: a fine gold line spanning the full canvas width, with small dot markers placed at year/milestone positions. A live marker advances left-to-right as the reel progresses, tracking the current scene's timestamp on the career timeline.
- **Content zone** (y 160–880): each scene occupies the full content zone; no persistent sidebar.
- **Chrome bar** (y 138–148): a fine horizontal line that frames the top of the content zone. Visible from beat 4 onward, fades before the outro.
- **Scene wipe transition**: at each scene boundary, a vertical gold gradient sweeps in from the right edge — a single `fillRect` with a `createLinearGradient` — lasting ~0.6 s.
- **Monogram**: a large circular glyph built from the person's initials, used on the cover and the outro. Drawn procedurally — no image needed.
- Light film grain (alpha 0.03, 6-frame cycle) on top of every frame.
- No vignette — the navy fills to the edges.

---

## 5. Motion system

- **Reveal (`R`)**: opacity 0→1 with ease-in-out-cubic. Used for every text element. Duration ~0.5–0.8 s per element.
- **Stagger**: consecutive elements in a list reveal 0.6–1.0 beat apart.
- **Rule lines**: draw left-to-right via a width clip, ease-in-out-cubic, ~0.7 s.
- **Bar charts**: bars grow upward from the baseline, ease-in-out-quad, staggered 0.4–0.8 s apart.
- **Waterfall**: each column drops from a floating baseline, ease-out-expo.
- **Axis marker**: interpolates between scene timestamp targets with ease-in-out-cubic as the reel plays.
- **Scene exit**: scene elements fade out over ~1.5 s before the wipe transition arrives — never a hard cut.
- Beat-locked events: the first reveal in each scene lands on its opening beat.

---

## 6. Scene elements

- **Monogram**: circular, ~110–64 px radius (large on cover, small on outro). Built from initials, outlined in gold, monospace labels on the ring. Scales down as the cover scene exits.
- **Name slam**: large serif display, fit-to-width, fades in after the monogram settles.
- **Italic role line**: gold italic subtitle under the name. The person's positioning in one phrase.
- **Gold rule**: a horizontal line (1.5 px, gold) that draws in under the role line. Used to separate title from body across all scenes.
- **Bar chart**: for M&A, consulting, or strategy case results. Each bar has a label below and a value above. Gold bars for primary metrics, green bars for growth/positive outcomes.
- **Waterfall chart**: for deal structure, budget allocation, or phased outcomes. Columns float from a shared baseline; a final "total" column in green.
- **League table**: a ranked list with rank badge (left), event name (centre), host institution (right). "1st" badges in gold, others in muted. Rows reveal staggered top-to-bottom.
- **Step/flow diagram**: numbered stages in a horizontal row, each with a label and a brief note below. Used for methodology (DCF steps, M&A process, case framework).
- **Credential list**: name of institution left, credential name right. Rows reveal staggered. Used for certifications, coursework, programmes.
- **Skills columns**: 2–3 columns, each with a category headline (gold, italic serif) and a bulleted list below. Gold rule under each headline.

---

## 7. Sound design

- **96 BPM jazz-adjacent piano.** Sustaining piano-style notes (triangle + sine with convolution reverb), sub-bass pulses, slow pad chords. No drums, no percussion — this is a reading room, not a trading floor.
- **Progression:** Dm7 – Bm7 – Gmaj7 – Am7 (or equivalent jazz voicings). Minor feel throughout; resolve to major only on the outro.
- **Arc:** single sustained note on the cover → sparse melody over the first half → full pad chords for the hero scene → bell tones on the close.
- **SFX map:**

| Event | Sound |
|---|---|
| Cover name reveal | single piano note (D4), sustained 3.5 s |
| Rule line draw | no sound — silence emphasises the line |
| Bar appear | soft piano note (chord root), 2.6 s decay |
| League table row | faint piano tick (octave up), 1.5 s |
| Step/flow stage reveal | soft piano note (E4), 2 s |
| Credential row reveal | no sound |
| Outro monogram | bell-like piano (D5 + A5), 3.5 s |

- True silence never required — the music is ambient enough that natural gaps feel intentional.

---

## 8. Structure (beat map — scale to content, ~55–65 s at 96 BPM)

**Never pad.** The default below is for a medium-rich finance resume (~98 beats ≈ 61 s). Cut scenes with no content. The hero analysis scene (M&A / case / DCF) must always be the longest scene.

| Scene | Beats (default) | What happens |
|---|---|---|
| Cover | 0–8 | Monogram fades in centred. Name reveals below. Italic role line. Gold rule. Tagline and open-to line. Timeline axis begins drawing at beat 3. |
| Education / origin | 8–16 | Institution, degree, graduation year. Any academic distinction or relevant coursework. GPA on request only. |
| Experience / mentorship | 16–25 | Role title and org. 2–3 achievement lines revealing staggered. Any leadership or teaching role here. |
| Career pivot / positioning | 25–33 | The transition moment — from technical to finance, or the "why finance" anchor. An italic serif statement. |
| **Hero analysis scene** | 33–52 | The centrepiece. Bar chart, waterfall, or step-flow showing the key case study or internship project. Gold bars, green outcome. Honesty tag if academic. |
| League table / competitions | 52–68 | Ranked rows reveal top-to-bottom. "1st" in gold. Host institution in muted. |
| Skills / credentials | 68–82 | 2–3 skill columns, then credential list rows. |
| Close | 82–98 | Scene exits. Monogram returns (small). Name in monospace, wide letter-spacing. Contact info in muted. Timeline axis fades. |

**Scaling rules:**
- Each additional experience role: +6 beats.
- Each additional case competition scene: +4 beats.
- No hero analysis data (academic only) → replace with a 12-beat positioning/essay scene instead.
- Never exceed ~105 beats (~66 s). If content overflows, cut the credential list (least visual) first.

---

## 9. Content → visual mapping

| Content | Visual |
|---|---|
| **Hero experience / case study** | Bar chart (outcomes/metrics) or step-flow diagram (methodology). Label academic work "case study" — never imply real money. |
| **Deal / transaction** | Waterfall chart for deal structure; league table row if ranked. |
| **Internship / role** | Achievement lines (staggered reveal), not bullet points. Start with the outcome, not the task. |
| **Case competition wins** | League table with rank badge. "1st" in gold. Multiple competitions → one scene. |
| **Certifications / programmes** | Credential list, two columns: issuer left, credential right. No logos unless user-supplied. |
| **Skills** | Category columns: 2–3 categories, 4–6 items each. Finance skills → left column; tools/quant → right. |
| **Outro / contact** | Monogram + name in monospace + email + LinkedIn + open-to line in muted. No large CTA — the document speaks. |
| **Headshot** | Small circle crop, 80–100 px, top-right of the name scene only. Optional — never forced. |

---

## 10. Copy rules

- Name in sentence case, exact spelling (confirm with the person).
- Role line in **gold italic** — one phrase, ≤ 8 words. Example: *"Finance & Strategy, Class of 2027"*.
- Scene headlines in sentence case serif. Not UPPERCASE — this is editorial, not a trading terminal.
- Achievement lines: outcome first, then context. "Reduced operating cost $120M" not "Worked on a project to reduce costs."
- Honesty tags are non-negotiable: `"case study"` on any academic transaction, `"indicative"` on any chart with estimated values, `"in progress"` on an ongoing role.
- Numbers from the resume only. If none exist, use qualitative wins without inventing figures.
- League table: use exact rank, event name, and host — no embellishment.

---

## 11. Questions to ask (theme-specific)

1. Which case study or analysis should be the centrepiece — and should it show a methodology (step-flow) or an outcome (bar chart)?
2. Any competitions or rankings to include? What were the exact placements?
3. What's the one-line positioning — your italic gold subtitle? *(e.g. "Finance & Strategy" or "Policy & Public Finance")*

---

## 12. Personalisation add-ons

Brand colour swapping the gold · headshot circle crop · custom monogram ring text (the open-to line cycling around the ring) · 9:16 version (vertical, stacked layout) · README GIF (cover → hero chart → close, 6 s loop) · SRT captions.

---

## 13. Don'ts

- Don't invent deal values, rankings, or firm names — label everything or leave it out.
- Don't use UPPERCASE headlines — this theme is sentence case throughout.
- Don't add a beat drop, percussion, or high-energy transitions — calm is the point.
- Don't use Syne — this theme uses a serif display + monospace pair.
- Don't show the cover monogram at full size again until the outro — it's a bookend device.
- Don't overlap the timeline axis with scene content — keep y ≥ 900 clear for the axis.
- Don't use green for anything other than positive financial outcomes.

---

## 14. Build contract

- One self-contained HTML: **fonts base64-embedded** (`@font-face src: url('data:font/woff2;base64,…')`). Use `scripts/fonts.py` to fetch Fraunces woff2 if not in `assets/fonts/`. Load every weight with `await document.fonts.load('600 1em Fraunces')` etc. before frame 0.
- `window.__render(t)` pure function of t; seeded hash randomness only.
- `window.__audio()` → OfflineAudioContext → base64 WAV; live mode uses the same `score()`.
- `window.__meta = {DUR, FPS, BPM}` — render toolkit reads this.
- `window.__ready` — resolves after all `document.fonts.load()` calls settle.
- Text helpers multiply `globalAlpha`. No direct assignment.
- Timeline axis position is computed from the scene table — never hardcoded pixel offsets.
- Bar chart heights derived from the data values at render time — never hardcoded.
- Honesty tags rendered inline as small monospace suffixes, same line as the value they qualify.

---

## 15. Theme quality check

- [ ] Frame 1: monogram centred, navy background, no text yet — recognisably Prospectus.
- [ ] Last frame echoes frame 1 (monogram returns, name in monospace).
- [ ] Timeline axis marker tracks the correct year position for every scene.
- [ ] Hero analysis scene is the longest and most visually dense scene.
- [ ] Every number on screen matches `facts.json` exactly.
- [ ] All academic/case study work is labelled `"case study"` or `"indicative"`.
- [ ] No UPPERCASE headlines anywhere.
- [ ] Gold rule lines appear under the name and under each section headline.
- [ ] Contact info readable ≥ 2 s on the outro with no competing animation.
