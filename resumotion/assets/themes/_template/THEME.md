# THEME: [Name]

> **One-line concept — what is the visual metaphor for this person's career?**
> One more sentence expanding on how that metaphor plays out on screen.

Reference build: `reference.html`. Read it before writing; copy its primitives and values, not its content.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| [describe the person type this fits] | [describe who should use a different theme] |
| [second fit] | [second doesn't-fit] |

Tone: [one line on the emotional register — e.g. calm and precise / joyful and fast / editorial weight]

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `bg` | `#______` | Main canvas background |
| `panel` | `#______` | Card / panel backgrounds |
| `ink` | `#______` | Body text, dark elements |
| `accent` | `#______` | Primary accent — overrideable with brand color |
| `accent2` | `#______` | Secondary accent |
| `dim` | `#______` | Subdued text, borders, lines |
| `white` | `#FFFFFF` | Light elements, text on dark |
| `red` | `#______` | Warnings, problems, denials |

Swap `accent` for the user's brand colour if given. Keep the [background world / palette base].

---

## 3. Typography

| Role | Font | Size |
|---|---|---|
| [Primary headline] | [Font name] weight | [size range] px |
| [Secondary/body] | [Font name] weight | [size range] px |
| [Code/mono if used] | JetBrains Mono 400/700 | [size range] px |

[Any key typographic rules — caps, fit-to-width, letter-spacing, etc.]

---

## 4. Layout & world

- 1920×1080, 30 fps.
- [Describe the main layout structure — split panels, centered column, scrolling world, etc.]
- [Describe any persistent UI elements — HUD, header, sidebar, timeline, etc.]
- [Describe texture, grain, vignette, or other surface treatment.]
- [Describe any ambient animation — parallax, particles, scanner lines, etc.]

---

## 5. Motion system

- [Describe the primary motion metaphor — scroll, stream, reveal, draw, etc.]
- [Describe default easing — ease-out-expo for entrances, ease-in for exits, etc.]
- [Describe any physics or special motion — spring, bounce, decay, etc.]
- [Describe how elements sync to the music — beat-locked events, BPM-driven, etc.]

---

## 6. Scene elements

- **[Element 1 name]:** [What it is and how it works visually]
- **[Element 2 name]:** [What it is and how it works visually]
- **[Element 3 name]:** [What it is and how it works visually]
- **[Element 4 name]:** [What it is and how it works visually]

---

## 7. Sound design

- **[BPM] BPM [genre/style] soundtrack.** [Describe the instruments and vibe.]
- **Progression:** [chord progression] ([major/minor], [mood]).
- [Describe the arc — intro, build, drop, outro.]
- **SFX map:**

| Event | Sound |
|---|---|
| [visual event] | [sound description] |
| [visual event] | [sound description] |
| [visual event] | [sound description] |

---

## 8. Structure (beat map, ~[X] s at [BPM] BPM ≈ [N] beats)

| Scene | Beats | What happens |
|---|---|---|
| [Scene name] | [b0]–[b1] | [Description of what appears on screen] |
| [Scene name] | [b0]–[b1] | [Description] |
| [Scene name] | [b0]–[b1] | [Description] |
| [Scene name] | [b0]–[b1] | [Description] |
| [Scene name] | [b0]–[b1] | [Description] |

---

## 9. Content → visual mapping

| Content | Visual |
|---|---|
| **Hero experience** | [How the hero story plays out in this theme's visual language] |
| **Projects** | [How projects appear] |
| **Wins / awards** | [How wins are shown] |
| **Skills** | [How skills are shown] |
| **Outro / contact** | [How the ending looks] |

---

## 10. Copy rules

- [Rule about case — uppercase, sentence case, etc.]
- [Max word count per element]
- [Tone guidance — formal / casual / punchy]
- Real numbers only — no invented metrics.

---

## 11. Questions to ask (theme-specific)

1. [Theme-specific question 1]
2. [Theme-specific question 2]
3. [Theme-specific question 3]

---

## 12. Personalisation add-ons

[Comma-separated list of optional personalisations for this theme]

---

## 13. Don'ts

- [What not to do in this theme]
- [Another constraint]
- [Another constraint]

---

## 14. Build contract

- One self-contained HTML: fonts from `../../toolkit/fonts/`, images as data URIs, canvas 1920×1080.
- `window.__render(t)` pure function of t; seeded hash randomness only.
- `window.__audio()` → OfflineAudioContext → base64 WAV; live mode uses the same `score()`.
- `window.__meta = {DUR, FPS, BPM}` — render toolkit reads this.
- `window.__ready` — resolves after `document.fonts.load()` per family/weight and image decode.
- Text helpers multiply `globalAlpha`. Iris/cut-outs: `evenodd` fill rule.
- Render in chunks → ffmpeg; social encode < 30 MB.

---

## 15. Theme quality check

- [ ] Frame 1 is immediately recognisable as this theme.
- [ ] Last frame echoes frame 1 (closing rhyme).
- [ ] Every major visual event lands on its beat.
- [ ] Hero scene is the visual peak of the reel.
- [ ] Contact info is readable for ≥ 2 s with no competing animation.
- [ ] No layout overlaps between any two simultaneous elements.
- [ ] Audio levels: −14 LUFS ±1, true peak ≤ −1 dBTP.
