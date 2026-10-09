# THEME: Perception

> **The reel is the output of the person's own perception model.**
> A computer-vision pipeline "looks at" their career: detector boxes lock onto their name, words and stats; depth maps, lidar point clouds and segmentation masks are the transitions.

Reference build: `reference.html` (from `nidhi-reel-v2.html`). Read it before writing; copy its primitives and values, not its content.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| ML / computer vision / robotics / AI engineers | Finance, consulting, design, non-tech roles |
| Anyone whose work is "making machines see, think, act" | People who want calm or playful (use Prospectus / Speedrun) |
| Full-stack engineers with at least one AI project | Very thin resumes (< 2 projects) – the theme needs things to "detect" |

Tone: cinematic, dark, precise, a little dangerous. Like a model booting up.

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `bg` | `#000000` | Background, always |
| `cream` | `#F2EDE6` | Main text |
| `orange` | `#FF6B2B` | Accent: boxes, labels, wipes, the dot. **The only accent.** |
| `muted` | `#7A726B` | Secondary text, HUD |
| `dim` | `#2B2622` | Lines, empty meters, horizon |
| `ember` | `#3A1206` | Depth-map dark tone |

- If the user has brand colours, their main brand colour replaces `orange` only. Background stays black.
- **One inverted scene per reel**: orange background, black ink. Use it for the hero story (biggest internship / job / case study). Never two.

## 3. Typography

| Role | Font | Weight | Size (1080p) |
|---|---|---|---|
| Name slam | Syne | 800 | 255 px, letter-spacing −8 |
| Headlines / thesis | Syne | 800 | 140–150 px, ls −4.5 |
| Project titles | Syne | 800 | 92 px, ls −3 |
| Stats (big) | Syne | 800 | 120–140 px |
| Sub-lines | Syne | 600 | 30–44 px |
| Detector labels, HUD, typed text | JetBrains Mono | 700 / 400 | 17–22 px (labels 19 px bold) |

Rules:
- Mono is **only** for machine output (labels, HUD, typed strings, file names). Human statements are Syne.
- Every headline goes through a fit-to-width helper (Syne 800 is extremely wide). Max text width = 1920 − 280.
- Lowercase for labels (`builder 0.99`), Title/Upper for headlines.

## 4. Canvas, layout, texture

- 1920×1080, 30 fps. Left margin 140 px for scene content; HUD margin 56 px.
- **HUD (always on after boot):** four corner brackets (64 px arms, 2 px, cream at 50%), opening from a small centred viewfinder during boot. Corner text in mono 17 px muted:
  - top-left: `<first>_<last>.<nickname-or-onnx>` (e.g. `jane_doe.nino`)
  - top-right: `open to: <role>` cycling every 2.5 s, typed in, accent colour
  - bottom-left: `frame 000123`; bottom-right: timecode `ss:ff`
- **Texture:** film grain (8 pre-rendered 960×540 noise frames, drawn at alpha 0.055), radial vignette (transparent at 35% radius → 72% black at edge).
- **Impact FX:** on every hard hit, screen shake `Σ v·e^(−9d)·16 px` plus RGB channel split `Σ v·e^(−11d)·12 px`. Glitch slices (9 horizontal strips shifted ±130 px) on 3–4 transitions only.

## 5. Motion language

Easing: `easeOutExpo` for entrances, `easeInExpo` for exits, `easeInOutCubic` for morphs, `easeOutBack(1.9)` for the dot pop.

**Signature primitives (copy from reference):**

- **BOX – the detector box.** The heart of the theme.
  - 2 px rectangle + 5 px corner brackets (arm = min(26, w·0.2, h·0.2)).
  - Enters by scaling 1.22 → 1 over 0.32 s (expo-out) and **flickers** (alternating 100% / 25%) for the first 45%.
  - Jitters ±1.6 px per frame from a seeded hash (looks like real tracking).
  - Label pill above (or below) the box: mono 700 19 px, black text on accent, 32 px tall, format `label  0.97`.
  - On the inverted scene, box is black and label text is orange.
- **RISE / OUT:** text rises from behind a clip mask (offset = size × 1.15, expo-out); exits upward (expo-in).
- **Letter slam:** each letter scales 1.7 → 1 over 0.28 s, staggered 0.0625 s; two ghost echoes at 18% opacity trail during entry and on exit.
- **Box morph:** when a word changes inside a box, the box width eases between old and new word widths (cubic in-out) – the box "re-detects".
- **Depth field:** 128×72 field, values quantised to 6–7 steps, mapped through LUT `black → ember → #A03410 → orange → cream`, upscaled nearest-neighbour. Revealed by random 120×90 tile grid.
- **Segmentation wipe:** an orange polygon sweeping across with a jagged edge (36 px steps, random ±70 px, re-rolled 12×/s).
- **Pixel dissolve:** 48 px black blocks filling in random order (exit for computer-vision scenes).
- **Typed text:** 25–40 chars/s, blinking `_` cursor.

## 6. Sound design

- **120 BPM, D minor.** 1 beat = 0.5 s. All cuts land on beats or 16ths.
- **Arrangement:** drone (boot) → **drop** on the name → groove → build → **½–1 beat of true silence** → resolve (outro).
- **Chords (4 beats each):** Dm `[50,53,57]` · B♭ `[46,50,53]` · F `[53,57,60]` · C `[48,52,55]`; bass roots `38, 34, 41, 36`.
- **Instruments (all synthesized, Web Audio):**
  - Drone: sines at 36.7 / 73.4 / 55 Hz + two saws, low-pass 140 → 600 Hz.
  - Kick: sine 165 → 44 Hz in 0.11 s + 15 ms noise click. Every beat from the drop.
  - Clap: 3 band-passed noise bursts (1.5 kHz), on off-beats from the thesis.
  - Bass: saw + square (1.004 detune) 16ths, resonant LP 1100 → 160 Hz (Q 6), octave jump on 16th #3 and #6; **side-chained** (gain 0.45 → 1 over 0.24 s each kick).
  - Hats: 16ths, accent pattern `.5 .25 .9 .3`, HP 7.5 kHz.
  - Pad: detuned saws ±9 cents, LP 500 → 1600 Hz, through convolution reverb.
  - Pluck arp: saw, LP 3800 → 500 Hz, pattern `0 1 2 1 0 2 1 2` two octaves up.
- **SFX map (every visual event has one):**

| Event | Sound |
|---|---|
| Box lock | two-note triangle blip (1760 + 2637 Hz) |
| Big hit (name, scene cuts, wins) | impact: kick + 41→30 Hz sub + noise LP 1100 + crack HP 2600 + 0.5 s reverse swell into it |
| Stat appears | soft hit (sine 120→50 Hz + filtered noise) |
| Each typed character | tick 2.6–4 kHz |
| Wipe / transition | band-pass noise whoosh 200 → 8000 Hz |
| Glitch | square wave at random pitches, gated |
| Scan candidates | ticks pitched by box height |
| Outro | bells (sine partials 1, 2.76, 5.4) + low boom |

- Master: compressor (−16 dB, 4:1), peak-normalised to −1 dBFS on export. Silence must be digitally silent (cut music gain in 30 ms).

## 7. Structure (beat map, ~55–60 s)

| Scene | Beats | What happens |
|---|---|---|
| Boot | 7 | Frame 1: orange dot in a viewfinder. Optional mascot says hi (dot drops and becomes its heart). `loading <name>.<nick>` types, `ready`, ring pulse, HUD brackets open. |
| Scan | 8 | Depth map tiles in; 60+ candidate boxes flicker (`obj 0.3x`), then converge onto where the name will be (`person 0.9x`). Glitch → hard cut. |
| Name | 8 | **Drop.** Letter slam, two lines. Box locks: label = one-word identity (`builder`, `problem_finder`, `ai_engineer`) + `0.99`. Role line + school/location rise in under it. |
| Thesis | 10 | One statement on its own beat ("I find the problem first." box `discover 0.98`), then "I build systems that **see. → think. → ship.**" with box morph and labels `perceive → reason → deploy`. Ends in segmentation wipe. |
| Hero (inverted) | 16–18 | The best experience told as a story (see §8). |
| Projects | 10 each | 2–4 projects, each with a bespoke visual. |
| Wins | 12–13 | One win per beat-pair, then summary grid. |
| Skills | 11 | One category per ~2 beats. |
| Silence | ½–1 | Black. Nothing moves except the HUD. |
| Outro | 14 | CTA, URL, email, links, mascot bye, dot. |

Scale to content: 2 projects → drop a project slot (~50 s). Never pad.

## 8. Content → visual mapping

| Content | Visual |
|---|---|
| **Name** | letter slam + identity box |
| **Hero experience / case study** (internship, job, research) | Inverted orange scene. Story: problem → bottleneck → fix → outcomes. A messy hand-drawn diagram (wobbly boxes, dashed lines) builds slowly; detector locks on it: `manual · bottleneck 0.97`; on a hard hit it snaps into a clean pipeline of 4–6 labelled stages that fire left→right, each locked by a box; then 3–4 outcome stats rise one per 1.5 beats. Company logo top-right, tinted black. |
| **CV / autonomous / robotics project** | Lidar road: perspective point cloud, orange lane dots, a sweep line, drivable-area gradient, wireframe 3D cuboid for a vehicle, boxed hazards (`pothole 0.87`). Live `fps` counter. |
| **Security / NLP / text project** | Password decode: a weak string typed, PII spans boxed (`name · pii`), scramble-decode to the strong output, weak→strong meter. Adapt: any input → detected entities → transformed output. |
| **Agents / RAG / API / route / graph project** | Route draw: nodes on a dot field connected by curved arcs one per beat; node labels = pipeline stages (`query → agent → rag → api → package`); zoom into the last node to exit. |
| **Multilingual / social-impact project** | Script cycle: one word cycling through scripts on 16ths (one font family per script). |
| **Generic project (fallback)** | Title + one-line description; a depth-map strip behind; 2–3 key terms boxed with labels; stats rise. |
| **Wins** | One per beat: huge word (`Winner`, `Top 5`), event line, detail in mono; logo above; box `achievement 0.99`; alternate left/right/centre alignment. Then a grid of all wins with `track n` boxes. |
| **Skills** | Category name huge + box `skill n/5`, tools as orange-outlined chips filling in left→right; category index row at the bottom. Group by what they *do*, not a tool dump. |
| **Certifications** | Usually skip; or 1 beat as a mono list if they matter. |
| **Leadership** | A stat row (members, events) inside the hero or as a generic scene. |
| **Outro** | "Let's build something." words blur in; portfolio URL big in orange; email typed with box `available 1.00`; small row of GitHub/X/LinkedIn; last frame = the orange dot alone (rhymes with frame 1). |

Logos: only user-supplied; converted to one colour (cream on black, black on orange). Never redrawn.

## 9. Copy rules

- Headlines ≤ 6 words. Stats: big number + ≤ 8-word caption.
- Box labels: lowercase, 1–2 words, snake_case allowed. Confidence 0.79–0.99 (never 1.00 except `available`/mascot).
- Use the person's real numbers only. No number → no stat; use a keyword instead.

## 10. Questions to ask (theme-specific)

1. One word that should be your detector label (e.g. builder, problem_finder)?
2. Which experience is the hero story? What was the pain point you found?
3. A nickname/handle for the boot line and file name?
4. Mascot/avatar image for hi/bye? (optional)
5. Logos for companies / hackathons? (PNG/SVG, ≥ 500 px)
6. Which roles to cycle in "open to:"?

## 11. Personalisation add-ons

Mascot hi/bye (the dot becomes its heart) · nickname in boot line · "open to" role cycler · hello in their languages during scan · brand colour as accent · logos · captions file · 9:16 version · README GIF loop (name slam → thesis → one project → skills).

## 12. Don'ts

- No second accent colour, no gradients on text, no rounded friendly shapes.
- No more than one inverted scene. No glitch on every cut (max 4).
- Don't let boxes sit perfectly still – always jitter.
- Don't show internal team/tool/client names from an internship without asking.
- Don't invent fps, accuracy or % numbers to fill the stats.

## 13. Build contract

- One self-contained HTML: fonts base64-embedded, images as data URIs, canvas 1920×1080.
- `window.__render(t)` draws the exact frame at time `t` (pure function of t; no setTimeout, no Math.random – use a seeded hash).
- `window.__audio()` renders the same score in an `OfflineAudioContext` and returns base64 WAV. Live mode schedules the same `score(ctx, t0)` on a real AudioContext behind a "Play with sound" button.
- Before frame 0: `await document.fonts.load()` for every family/weight used (not `fonts.ready`) and await all images.
- Text helpers must **multiply** `globalAlpha`, never set it, or scene fades break.
- Render: frames in chunks via headless Chromium → ffmpeg H.264 (`-crf 20` master, `-crf 25 -tune grain` social < 30 MB).

## 14. Theme quality check

- [ ] Frame 1 = dot + viewfinder (designed). Last frame = dot alone.
- [ ] Every box flickers in and jitters; every box lock has a blip.
- [ ] The drop lands exactly on the name's first letter.
- [ ] Exactly one inverted orange scene.
- [ ] Silence before the outro is truly silent.
- [ ] No text overflow (Syne 800 is wide – check `Rank 240`, long names).