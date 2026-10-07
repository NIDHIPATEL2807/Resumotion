# RESUMOTION — Full Build Plan

> Drop this file in the root of a new repo and tell Claude Code:
> **"Read RESUMOTION_PLAN.md. We're starting Phase 1. Ask me anything unclear before writing code."**
>
> Also copy `nidhi-reel-v2.html` (the v2 reel) into `/reference/`. It is the quality bar and the starting point for the perception theme. Strip any personal details you don't want public before committing.

---

## 0. The one-paragraph summary

Resumotion is a free, open-source **Claude skill + Claude Code plugin** that turns a resume or portfolio into a ~30–50 second beat-synced motion video with synthesized sound. It's built in HTML/Canvas, uses Web Audio for sound, and exports to MP4. The goal is **presence, not money**: GitHub stars, people posting their reels, and the author (me) becoming known for it. Quality is the whole game. Every video must look like a pro motion designer made it.

---

## 1. Goals and non-goals

**Goals**
- A user installs the plugin, gives a resume, and gets a pro-looking MP4 (16:9, 9:16 in Phase 2).
- Output is deterministic on a pinned Playwright Chromium: the same script always gives the same video, with no random breakage.
- Adding a new theme = adding a folder. The community can contribute themes.
- Every reel carries a small tasteful end card: `made with resumotion · github.com/<me>/resumotion`.

**Non-goals (for now)**
- No website app, no accounts, no payments, no server.
- No LinkedIn scraping (it breaks their ToS). The user pastes text or gives a PDF.
- No voiceover, no AI-generated images.
- No hidden telemetry, ever.

---

## 2. Name check (do this before going public)

"Resumotion" is very close to **Remotion**, a well-known programmatic-video library in exactly this space. This risks confusion and possible trademark issues. Before publishing anything:
- Search GitHub, npm, X, and domains for both "Resumotion" and "Remotion" confusion.
- Backup names: Reelsume, Cutvitae, ProofReel, Résumé.exe, Showreel.md.
- Keep the repo name, plugin name, and X handle identical.

---

## 3. How it works (the pipeline)

```
resume.pdf / pasted text
        │
        ▼
[1] EXTRACT  → facts.json      (only real facts, nothing invented)
        │
        ▼
[2] GAPS     → ask ≤3 questions if minimum info is missing
        │
        ▼
[3] CONFIDENTIALITY CHECK → flag internal names / client details, ask before using
        │
        ▼
[4] DIRECT   → pick theme + write script.json (copy, scene order, metaphors)
        │
        ▼
[5] VALIDATE → scripts/validate.js checks script against schema + theme
        │
        ▼
[6] REVIEW   → Claude shows script.md (human-readable screenplay); user edits in plain language; loop until approved
        │
        ▼
[7] PREVIEW  → preview.html plays live in the browser with real-time audio
        │
        ▼
[8] RENDER   → Playwright steps frames + OfflineAudioContext renders WAV → ffmpeg → MP4
        │
        ▼
out/reel-16x9.mp4, out/preview.html, out/reel.srt
```

Steps 1–4 and 6 are done by Claude, guided by SKILL.md. Steps 5 and 7–8 are **plain code** (deterministic, no AI). That split is the core idea: the AI writes the script, code makes the movie.

**Critical separation:** facts describe what the person actually did. Visuals are the theme's metaphors. A visual key like `lidar_road` is a rendering choice, not a fact about the person. It must never appear in facts.json.

---

## 4. Repo structure

```
resumotion/
├── .claude-plugin/
│   ├── plugin.json            # plugin manifest
│   └── marketplace.json       # lets people: /plugin marketplace add <me>/resumotion
├── skills/
│   └── resumotion/
│       ├── SKILL.md           # the instructions Claude follows (pipeline steps 1–4, 6)
│       └── references/
│           ├── script-schema.md
│           ├── copywriting.md # how to write punchy on-screen copy
│           └── themes.md      # which theme fits whom
├── commands/
│   └── resumotion.md          # /resumotion slash command
├── engine/
│   ├── timeline.js            # beat clock: beats ↔ seconds ↔ frames
│   ├── player.js              # loads script + theme, renders frame at time t
│   ├── text.js                # kinetic type helpers (letter slam, word morph, typewriter, script cycling)
│   ├── fx.js                  # shared effects (grain, jitter, glitch, masks, wipes)
│   ├── audio/
│   │   ├── synth.js           # instruments (kick, sub, pad, hats, risers, clicks)
│   │   ├── sequencer.js       # schedules notes on the beat clock
│   │   └── mixer.js           # sidechain, master bus, limiter
│   └── seek.js                # window.seek(t) API for frame-exact rendering
├── themes/
│   ├── perception/            # theme 1 (ported from reference/nidhi-reel-v2.html)
│   │   ├── theme.json
│   │   ├── scenes/*.js
│   │   ├── score.js           # music + sfx map for this theme
│   │   └── README.md          # preview GIF + who it's for
│   ├── terminal/              # theme 2
│   ├── swiss-grid/            # theme 3
│   └── _template/             # starter for new themes
├── scripts/
│   ├── validate.js            # schema + theme compatibility + text overflow + flash rate checks
│   ├── build-preview.js       # script.json + theme → standalone preview.html
│   ├── render.js              # Playwright + ffmpeg → MP4 (chunked, resumable)
│   ├── check-audio.js         # loudness (LUFS), peaks, silence, drop level
│   └── export-captions.js     # script.json → reel.srt
├── assets/fonts/              # bundled OFL fonts (Syne, JetBrains Mono, etc.)
├── examples/                  # 3–5 sample resumes (fake people) + their outputs
├── reference/
│   └── nidhi-reel-v2.html     # v2 reel = quality bar (personal details stripped)
├── gallery/                   # community reels (linked, not committed as video)
├── site/                      # Next.js showcase app (section 13.5)
│   ├── app/
│   │   ├── layout.tsx         # root layout, OG meta, fonts
│   │   ├── page.tsx           # home: hero + how it works + themes + gallery + install
│   │   ├── gallery/
│   │   │   └── page.tsx       # full gallery page
│   │   └── globals.css
│   ├── components/
│   │   ├── HeroReel.tsx       # live canvas reel (engine loaded client-side)
│   │   ├── ThemeCard.tsx      # looping 6 s clip + who it's for
│   │   ├── GalleryGrid.tsx    # reel cards with owner link
│   │   ├── InstallBlock.tsx   # copy-paste install commands
│   │   └── NavBar.tsx
│   ├── lib/
│   │   └── gallery.ts         # reads site/gallery.json at build time
│   ├── public/
│   │   ├── clips/             # 720p MP4 + WebM theme previews (≤8 MB each)
│   │   └── og-image.jpg       # Open Graph card
│   ├── gallery.json           # gallery entries (updated via PRs)
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── CONTRIBUTING.md            # how to add a theme
├── README.md
└── LICENSE                    # MIT
```

> Verify the exact plugin manifest and marketplace format against the current Claude Code plugin docs before Phase 2. The format may have changed.

---

## 5. Data formats

### 5.1 facts.json (step 1 output)

```json
{
  "name": "Nidhi Patel",
  "role": "AI-first full-stack engineer",
  "tagline": null,
  "projects": [
    {
      "title": "Volkswagen Hazard Detection",
      "what": "camera-based road hazard detection using YOLO, MiDaS depth, and Fast-SCNN",
      "metric": null,
      "tags": ["cv", "pytorch", "real-time"],
      "confidential": false
    }
  ],
  "experience": [
    {
      "role": "ML Engineer Intern",
      "company": "Barclays",
      "dates": "Jun–Aug 2024",
      "what": "built a pipeline that cut manual review time",
      "confidential": true,
      "confidential_note": "internal team name and tool names flagged; user confirmed OK to show company name only"
    }
  ],
  "wins": [
    { "label": "Winner", "event": "Infosys Springboard iAccelerate", "detail": "6,000+ participants", "logo": null }
  ],
  "stack": ["PyTorch", "ONNX", "OpenCV", "React", "FastAPI"],
  "contact": { "email": "...", "github": null, "linkedin": null, "site": null },
  "brand": { "colors": ["#FF6B2B"], "fonts": ["Syne", "JetBrains Mono"] },
  "persona_image": null,
  "looking_for": null,
  "source_notes": "Everything here appears in the input. Nothing inferred. Confidential fields flagged and confirmed with user."
}
```

**Rules:**
- Every field is either copied from the input or `null`. Never guessed.
- `visuals` are the theme's metaphors and are **never stored in facts.json**. They live only in script.json.
- `confidential: true` means Claude asked the user before putting that item on screen. Document the answer in `confidential_note`.
- User corrections during the REVIEW step are also facts. If the user says "it's 6,000+ participants," update facts.json so future edits can't revert it.

### 5.2 script.json (step 4 output)

```json
{
  "version": 1,
  "theme": "perception",
  "theme_version": "1.2.0",
  "bpm": 120,
  "aspect": ["16:9"],
  "density": "detailed",
  "palette": { "bg": "#0A0A0A", "fg": "#F5F5F5", "accent": "#FF6B2B" },
  "scenes": [
    { "type": "opener",      "beats": 15, "data": { "boot_text": "loading nino.model" } },
    { "type": "name_slam",   "beats": 8,  "data": { "name": "NIDHI PATEL", "label": "nino", "conf": 0.99, "persona_image": null } },
    { "type": "thesis",      "beats": 8,  "data": { "prefix": "I build systems that", "words": ["see", "ship", "scale"] } },
    { "type": "case_study",  "beats": 12, "data": {
        "company": "Barclays",
        "context": "manual doc review",
        "pain": "hours per analyst",
        "bottleneck_label": "bottleneck",
        "stages": ["ingest", "classify", "route"],
        "outcomes": ["82% faster", "zero misroutes"]
    }},
    { "type": "project",     "beats": 8,  "data": { "title": "Volkswagen", "line": "hazard detection · camera + depth", "visual": "generic_detect" } },
    { "type": "wins_grid",   "beats": 8,  "data": { "items": [
        { "label": "Winner", "event": "iAccelerate", "detail": "6,000+ participants" },
        { "label": "Top 5",  "event": "Smart India Hackathon" }
    ]}},
    { "type": "stack_flash", "beats": 4,  "data": { "items": ["PyTorch", "React", "FastAPI", "ONNX", "OpenCV"] } },
    { "type": "silence",     "beats": 1 },
    { "type": "outro",       "beats": 8,  "data": { "cta": "Let's build something.", "email": "...", "label": "available", "conf": 1.0 } }
  ]
}
```

- Timing is in **beats**, never seconds. At 120 BPM, 1 beat = 0.5 s.
- `theme_version` is pinned at script creation so old scripts fail loudly (not silently) if the theme breaks compatibility.
- `density: "punchy" | "detailed"` controls how much copy Claude writes per scene. Default is `"punchy"`.
- Each theme declares which scene types it supports and their allowed beat ranges.
- `visual` keys must exist in the theme's visual library (validate.js checks this).

### 5.3 script.md (generated alongside script.json)

A human-readable screenplay shown to the user during the REVIEW step. Example:

```
PERCEPTION THEME · 120 BPM · ~48 s · 16:9

[00:00–07:5]  OPENER (15 beats)
              Boot text: "loading nino.model"

[07:5–11:5]  NAME SLAM (8 beats)
              NIDHI PATEL · label: nino · conf: 0.99

[11:5–15:5]  THESIS (8 beats)
              "I build systems that SEE / SHIP / SCALE"

[15:5–21:5]  CASE STUDY · Barclays (12 beats)
              Context: manual doc review
              Pain: hours per analyst
              Pipeline: ingest → classify → route
              Outcomes: 82% faster · zero misroutes

[21:5–25:5]  PROJECT · Volkswagen (8 beats)
              "hazard detection · camera + depth"

[25:5–29:5]  WINS (8 beats)
              Winner · iAccelerate · 6,000+ participants
              Top 5 · Smart India Hackathon

[29:5–31:5]  STACK (4 beats)
              PyTorch · React · FastAPI · ONNX · OpenCV

[31:5–32:0]  SILENCE (1 beat)

[32:0–36:0]  OUTRO (8 beats)
              "Let's build something."
```

The user edits by replying in plain language. Claude updates script.json and script.md, re-validates, and re-renders only the changed scenes as preview stills before doing a full render.

---

## 6. SKILL.md — what it must say

Frontmatter:

```yaml
---
name: resumotion
description: Turn a resume, CV, portfolio, or LinkedIn text into a pro, beat-synced motion video (MP4) with synthesized music and sound design. Use whenever someone wants a video resume, a portfolio reel, a showreel, a "make my resume move" video, a LinkedIn intro video, or an animated version of their career, even if they don't say "video".
---
```

Body steps:

1. **Extract** facts.json from the input. Copy facts only. Mark unknowns `null`.
2. **Check the minimum:** name + role + at least one thing they did. If missing, ask at most 3 short questions:
   - "What do you do, in a few words?"
   - "One thing you're proud of?"
   - "What are you looking for next?"
   Never ask more than 3. Never invent answers.
3. **Confidentiality check.** Before writing the script, flag any internal team names, internal tool names, client details, or employer-confidential metrics. Ask the user: "I noticed [X] — is it OK to show this on screen?" Wait for the answer. Log it in facts.json under `confidential_note`.
4. **Pick a theme** using `references/themes.md`. Say in one line why it fits.
5. **Find the metaphor.** Per project, pick a `visual` from the theme library that matches what the project *is*, not a generic card. Visuals are rendering choices — they never flow back into facts.json.
6. **Write the copy** using `references/copywriting.md`. Default is `density: "punchy"` (≤6 words per beat group, verbs over adjectives, numbers when real). If the user asks for more detail, switch to `density: "detailed"`.
7. **Write script.json and script.md.** Scale the length to the content: thin resume ≈ 30 s, rich resume ≈ 50 s. Skip scenes with no data. Don't pad.
8. Run `node scripts/validate.js script.json`. Fix errors and rerun.
9. **REVIEW loop.** Show the user script.md — the full screenplay as a readable list: every scene, its time range, every piece of on-screen text. Say: "Here's the full script. Reply with any changes in plain language — I'll update and show you stills of changed scenes before the full render." Apply changes, update facts.json for any corrections, re-validate, show stills. Repeat until the user approves.
10. Run `node scripts/build-preview.js` and then `node scripts/render.js`.
11. Run `node scripts/check-audio.js`. Report the result.
12. Run `node scripts/export-captions.js`. Include `reel.srt` in the output.
13. Reply with: files, theme used, one-line concept, and "anything to change?"

Keep SKILL.md under ~300 lines. Detailed stuff goes in `references/`.

---

## 7. The engine (technical decisions)

### 7.1 Time is the single source of truth
- `timeline.js` converts beats → seconds → frames (30 fps default, 60 optional).
- Every scene is a pure function: `render(ctx, localTime, data, theme)`. **No `setTimeout`, no CSS animations, no `Math.random()` without a seed.**
- Use a seeded PRNG (e.g. mulberry32) for jitter, grain, and glitch. This makes renders identical **on a pinned Playwright Chromium build**. Text rendering differs across OS and browser versions, so the guarantee is scoped to the render pipeline, not any browser.

### 7.2 Visuals
- Canvas 2D first. Add WebGL only if a theme truly needs it.
- Shared effects in `fx.js`: film grain, box jitter, chromatic split, scanlines, masks/wipes, easing library (expo, back, custom springs).
- Text in `text.js`: letter-by-letter slam, word morph with a box resizing around it, typewriter with cursor, script cycling (e.g. शक्ति across scripts). **Indic and non-Latin scripts:** use one `FontFace` per script family (`Indic0`, `Indic1`, …) — bundling multiple scripts under one family name breaks canvas rendering.
- **Font preloading:** do NOT rely on `document.fonts.ready`. Canvas fonts don't load until used, so `fonts.ready` resolves too early. Call `document.fonts.load("800 1em Syne")` (etc.) for every family/weight combination and await all promises before frame 0. Also preload images.
- Layouts are defined per aspect ratio. 16:9 in Phase 1, 9:16 designed in Phase 2 (not just cropped).
- **User-supplied images:** logos (only ones the user provides — never fetch from the web or bundle trademarks) and an optional `persona_image`. Auto-tint logos to the accent colour so they integrate with the palette.
- **Film grain and file size:** grain is computed at a lower intensity for the social encode. Use `-tune grain` in ffmpeg. Target ≤30 MB for the social file.

### 7.3 Audio
- Live preview: Web Audio `AudioContext` scheduled from the beat clock.
- Export: the **same score code** runs in an `OfflineAudioContext` → WAV. Same code means perfect sync.
- Each theme's `score.js` defines: sections (drone → drop → groove → build → silence → resolve), instruments, and an **sfx map** binding scene events (box lock, keystroke, wipe, stat hit) to sounds.
- Mixer: sidechain duck on kicks, soft limiter on master, true silence where the script says `silence`.
- Seeded randomness throughout.
- **Loudness:** measure LUFS via ffmpeg's `loudnorm` filter in measurement mode inside `check-audio.js`. Target −14 LUFS integrated. Checks: peaks below −1 dBFS, silence is truly zero, drop is louder than intro.

### 7.4 Render
- `render.js` launches headless Chromium (Playwright), loads preview.html, and for each frame calls `window.seek(t)` then screenshots the canvas.
- **Chunked, resumable rendering:** support `--from <frame> --to <frame>` flags. Write frame chunks to disk, encode as a separate step. This is required for the claude.ai sandbox where commands have a ~5-minute time limit. Stdin piping stays as the fast path for Claude Code only.
- Output H.264, yuv420p, `-movflags +faststart`, CRF ~20 (master) plus CRF ~26 with `-tune grain` (social). 720p H.264 + WebM for site clips.
- **Cached scene renders:** if only one scene changed, re-render only those frames and re-encode. Cuts re-render time from ~3 min to ~30 s.
- Requirements: Node 20+, ffmpeg in PATH, Playwright (pinned version). The skill checks for all three at startup.

### 7.5 Checks
- `validate.js`:
  - JSON schema against script-schema.json
  - All scene types exist in theme; beat ranges within allowed min/max
  - `theme_version` is compatible
  - `visual` keys exist in theme's visual library
  - Text overflow: measure actual pixel widths in headless Chromium (character count is not enough — Syne 800 is very wide)
  - Contrast ratio of palette (WCAG AA minimum)
  - Flash rate: no scene emits more than 3 full-screen flashes per second (photosensitivity safety)
- `check-audio.js`: LUFS measurement, peak check, silence check, drop-level check.
- `export-captions.js`: generates `reel.srt` from scene timestamps and on-screen text in script.json.

---

## 8. Theme system

### 8.1 theme.json contract

```json
{
  "id": "perception",
  "name": "Perception",
  "version": "1.0.0",
  "for": "ML / computer vision / robotics / AI engineers",
  "bpm": 120,
  "key": "D minor",
  "palette_default": { "bg": "#0A0A0A", "fg": "#F5F5F5", "accent": "#FF6B2B" },
  "fonts": ["Syne", "JetBrains Mono"],
  "safe_motion": false,
  "scenes": {
    "opener":      { "beats": [8, 16] },
    "name_slam":   { "beats": [4, 8] },
    "thesis":      { "beats": [6, 10], "max_words": 3 },
    "case_study":  { "beats": [10, 16], "max_stages": 5 },
    "project":     { "beats": [6, 10], "visuals": ["generic_detect", "route_draw", "script_cycle", "depth_map", "build_bar"] },
    "experience":  { "beats": [6, 10] },
    "wins_grid":   { "beats": [6, 10], "max_items": 4 },
    "stack_flash": { "beats": [2, 6],  "max_items": 16 },
    "silence":     { "beats": [1, 2] },
    "outro":       { "beats": [6, 10] }
  }
}
```

Notes on changes from v1:
- `version` field added so scripts can declare `theme_version` and validate compatibility.
- `safe_motion: true` disables effects that exceed 3 flashes/s.
- `case_study` and `experience` scene types added (see section 5.2 and 8.3 below).
- `name_slam` max beats raised to 8 (v2 reel uses 8).
- `opener` min beats: 8, v2 reel uses 15.
- Removed `lidar_road` visual (it was a metaphor, not a fact; replace with `depth_map` or `generic_detect`).

### 8.2 New scene types

**`case_study`** — for internships and jobs where there's a real problem→solution story.
```json
{
  "type": "case_study",
  "beats": 12,
  "data": {
    "company": "Barclays",
    "context": "manual doc review",
    "pain": "hours per analyst",
    "bottleneck_label": "bottleneck",
    "stages": ["ingest", "classify", "route"],
    "outcomes": ["82% faster", "zero misroutes"]
  }
}
```

**`experience`** — for roles where there's no single pipeline story, just the job.
```json
{
  "type": "experience",
  "beats": 8,
  "data": {
    "role": "ML Engineer Intern",
    "company": "Barclays",
    "dates": "Jun–Aug 2024",
    "line": "shipping ML to production",
    "logo": null
  }
}
```

### 8.3 The first 3 themes

| Theme | For | Visual language | Sound |
|---|---|---|---|
| **Perception** | ML/CV/AI/robotics engineers | Detector boxes with confidence scores, depth maps, segmentation-mask wipes, build pipelines | 120 BPM D minor, drone → drop → groove → silence → resolve |
| **Terminal** | Backend, devops, systems devs | Everything typed, compiled, logged; build bars, stack traces resolving into words, `git log` of a career | Clicky mechanical keys, glitchy bit-crushed beat |
| **Swiss Grid** | Designers, PMs, creatives | Strict grid, huge type, hard cuts, color blocks snapping on beat | Minimal techno, crisp percussion, lots of space |

Each theme must have a **generic fallback visual** for projects that match nothing specific.

### 8.4 Adding a theme (CONTRIBUTING.md)
1. Copy `themes/_template/`.
2. Fill in theme.json, write scenes and score.js.
3. Run `npm run theme:test <id>`, which renders the 5 example resumes in your theme.
4. Add a 6-second GIF to the theme README.
5. Open a PR. It's reviewed against the quality bar (section 10).
6. The PR template asks for explicit permission to feature the contributor's reel publicly, and confirms they are 18 or older if a real reel is included.

---

## 9. When info is missing (rules)

- **Never invent** facts, numbers, awards, employers, or metrics. This is the #1 rule.
- Minimum to proceed: name + role + one thing they did. Otherwise ask ≤3 questions (section 6).
- Length scales with content: 2 projects ≈ 30 s, 5+ projects/roles ≈ 50 s.
- Empty scene types are skipped, not filled with fluff.
- No-data backup scenes: `looking_for`, `currently_learning`, `values` (from the user's answers only).
- No brand colors → theme default palette.
- No email → outro shows whatever contact exists. If none exists, the outro shows just the name.
- Changes the user makes during REVIEW are facts. Write them into facts.json immediately so they survive future edits.
- **Ask before cutting.** If a user request would push the reel over the length target, tell them what would be shortened instead of silently squeezing scenes.

---

## 10. The quality bar ("would a pro make this?")

Every theme and every render must pass:

- [ ] **Frame 1 is designed**, not black, not a loading state. The last frame rhymes with the first.
- [ ] Every cut lands on a beat or a 16th note.
- [ ] Every visual event has a sound. Nothing big happens silently, except deliberate silence.
- [ ] One clear concept per theme (a metaphor from the person's world), not a slideshow.
- [ ] Type is big, tight, and readable on a phone in 9:16.
- [ ] No text overflow, no clipped letters, contrast passes.
- [ ] There's texture (grain, jitter, imperfection) so it doesn't feel sterile.
- [ ] Silence and negative space are used on purpose.
- [ ] It works on mute too (meaning is carried by the visuals).
- [ ] End card is tasteful and short.
- [ ] Flash rate ≤ 3 per second (photosensitivity safety).

If a theme draft feels like a template, **start over**.

---

## 11. Build phases

### Phase 1 — Engine + Perception theme, 16:9 only (week 1–2)
- [ ] Set up repo, MIT license, Node project, Playwright (pinned version), ffmpeg check.
- [ ] `timeline.js`, seeded PRNG, `seek.js`, `player.js`.
- [ ] Font preloading via `document.fonts.load()` per family/weight (not `fonts.ready`).
- [ ] Port `reference/nidhi-reel-v2.html` into the engine as the `perception` theme, split into scenes. Include `case_study` and `experience` scene types.
- [ ] Port the audio into `score.js` + shared `synth.js` and `mixer.js`; OfflineAudioContext export.
- [ ] `render.js` with chunked/resumable mode + cached scene re-renders.
- [ ] `validate.js` with text overflow (measured in headless Chromium) and flash rate checks.
- [ ] `export-captions.js`.
- **Done when:** `node scripts/render.js examples/nidhi/script.json` outputs a 16:9 reel as good as nidhi-reel-v2.html.

### Phase 2 — 9:16 + Skill + plugin (week 2–3)
- [ ] 9:16 layouts for all Perception scenes (designed, not cropped).
- [ ] Write facts.json and script.json schemas.
- [ ] Write SKILL.md, `references/copywriting.md`, `references/themes.md`.
- [ ] `/resumotion` slash command.
- [ ] `.claude-plugin/plugin.json` + `marketplace.json`; test install from GitHub on a clean machine.
- [ ] Test on 5 fake resumes: thin, rich, non-tech, non-English names, missing email, one with confidential internship details.
- [ ] Test in the claude.ai sandbox: confirm chunked render completes within the time limit.
- **Done when:** a stranger can install the plugin and get a good MP4 in both aspect ratios with no help.

### Phase 3 — Two more themes + site (week 3–4)
- [ ] Terminal theme.
- [ ] Swiss Grid theme.
- [ ] `themes/_template/` + CONTRIBUTING.md.
- [ ] Hero and install sections of the GitHub Pages site (section 13.5).
- **Done when:** all 3 themes pass the quality bar on all example resumes.

### Phase 4 — Real-people test (week 4)
- [ ] Make reels for 10 real people (friends, X/LinkedIn volunteers), with explicit permission.
- [ ] Note every place the copy was weak, a fact was wrong, or a render broke. Fix it.
- [ ] Collect 3–5 of the best reels (with permission) for launch. Add gallery to site.

### Phase 5 — Launch (week 5)
See section 13.

### Phase 6 — Grow (ongoing)
- New theme every 1–2 weeks, each with a launch post.
- Merge community themes and credit contributors loudly.
- Later: MCP server (`make_reel` tool) for other AI apps, web app with WebCodecs render.

---

## 12. Tracking usage (honestly)

Skills run on the user's machine, so usage can't be seen directly. Track these instead:

| Signal | Where | How often |
|---|---|---|
| Stars, forks, watchers | GitHub | Weekly |
| Views, unique visitors, clones | GitHub → Insights → Traffic (only keeps 14 days, so **screenshot weekly**) | Weekly |
| Public reels | Search X/LinkedIn for "made with resumotion" + #resumotion | Weekly |
| Gallery submissions | GitHub issue template "Share your reel" | Ongoing |
| Site visits | GitHub Pages site + Umami or Plausible (free tier/self-host) | Weekly |
| Releases downloaded | GitHub release asset download counts | Per release |

Keep a simple `metrics.md` (or a sheet) with weekly numbers.
**No hidden telemetry.** If usage pings are ever added: opt-in, clearly documented, and anonymous.

---

## 13. Launch plan

### Before launch
- [ ] README: reel GIF at the very top, a one-line pitch, 3-step install, the 3 theme GIFs, a "share your reel" section.
- [ ] GitHub Pages site live (section 13.5).
- [ ] Final name decided; X handle, GitHub repo, and site match.
- [ ] 3–5 real reels ready (with permission), with their owners ready to repost.
- [ ] Personal details stripped from the reference reel before it's committed.

### Launch day (one day, all channels)
- **X:** native video of the best reel + "I built a free Claude plugin that turns your resume into this. Open source." Then a thread: concept → beat clock → synthesized sound → themes → link.
- **LinkedIn:** the same video with a story caption ("my resume didn't feel like my work, so…"). Weekday morning IST. Reply to every comment in the first hour.
- **Reddit:** r/ClaudeAI, r/ClaudeCode, r/SideProject, r/webdev (read each sub's rules first).
- **Communities:** Anthropic Discord, Peerlist launchpad, Show HN.
- **GitHub:** PRs to "awesome Claude skills / plugins" lists.

### After launch
- Reply "drop your resume, I'll make yours" and post results, tagging people (with permission).
- Post the making-of: sound design breakdown, a theme being built, failed versions.
- Every new theme or release gets a post.

---

## 13.5 Hosted showcase page

A public page that explains what this is and shows it off. It lives in the same repo under `/site` and deploys to **GitHub Pages** (free). Move to Vercel or a custom domain later if wanted.

### The big idea
The hero **is a live reel**. Instead of an embedded MP4, the page runs the engine in real time (canvas + Web Audio), so the first thing visitors see is the product working. Use an MP4 fallback for slow or old devices.

### Sections (top to bottom)
1. **Hero:** a live reel, muted by default with a big "▶ sound on" button (browsers block autoplay audio). One line: *"Your resume, as a 50-second film."* Two buttons: **Install** and **See reels**.
2. **How it works:** 4 steps with tiny animations: give resume → Claude writes the script → engine animates on the beat → MP4 out.
3. **Themes:** a card per theme with a looping 6 s clip, who it's for, and a "try this theme" snippet.
4. **Gallery:** real reels from real people (with permission), each linking to the owner's post. Visible count shows usage.
5. **Install:** copy-paste blocks for the Claude Code plugin and the claude.ai skill zip, plus requirements (Node 20+, ffmpeg).
6. **Privacy:** "Rendering runs on your machine. Your resume is only shared with Claude as part of your conversation — the same as any other message you send Claude." Short and accurate.
7. **Make a theme:** a link to CONTRIBUTING.md; credit contributors with their avatars.
8. **Footer:** GitHub, X, LinkedIn, made by <me>.

### Technical
- **Next.js 15 App Router** with Tailwind CSS. Reuses `engine/` client-side for the hero reel (dynamic import, no SSR for the canvas component).
- **Video weight:** never commit the master render. Use web encodes per clip: 720p H.264 MP4 + WebM, ~2–8 MB each, with a poster image, `preload="none"`, and lazy loading. Stay under GitHub's 100 MB per-file limit.
- **Link previews:** set Open Graph/Twitter meta (`og:image`, `og:video`, title, description).
- **Analytics:** Umami or Plausible, page views and Install clicks only. No cookies.
- **Gallery data:** `site/gallery.json` updated via PRs or "Share your reel" issues.
- **Quality:** the page must pass the same quality bar as the reels. It is the brand.

### Phase placement
Build hero + install section at the end of Phase 3, gallery during Phase 4. Live before launch day.

---

## 13.6 Distribution formats

| Format | Who it reaches | Effort | When |
|---|---|---|---|
| **Claude Code plugin** | Developers (they star, fork, and share on X/GitHub) | Low | Launch (v1) |
| **Skill zip for claude.ai** | Claude users who don't use a terminal | Very low | Launch (v1) — test chunked render in sandbox first |
| **Hosted page** | Everyone who sees a shared link | Medium | Launch (v1) |
| **Web app** (paste resume → video in browser; WebCodecs render; one LLM call) | Students, designers, LinkedIn crowd | High | Phase 6, once themes are proven |
| **MCP server** (`make_reel` tool) | Users of other AI apps (Cursor, etc.) | Medium | Only if people ask for it |

The plugin is the best first move: cheap, devs amplify it, stars give credibility. Build the engine so it runs in any browser and the web app becomes mostly a UI on top.

---

## 14. Risks and how to handle them

| Risk | Handling |
|---|---|
| AI invents facts | Facts-only extraction, `null` for unknowns, `source_notes` in facts.json, validate against schema |
| AI uses visual metaphors as facts | Hard rule in SKILL.md + schema: visuals live only in script.json |
| Renders break on some machines | Pin Playwright Chromium version; check Node + ffmpeg at startup with clear error messages |
| Output feels templated | Quality bar, concept-per-theme, start over if it feels generic |
| Name confusion with Remotion | Do the name check (section 2) before going public |
| Privacy: resumes contain personal data | Rendering runs locally; resume is only sent to Claude as part of the conversation — document this accurately (not "never leaves your machine") |
| Confidential internship/employer details on screen | Confidentiality check in pipeline step 3; user must confirm before anything sensitive appears |
| Text overflow | Validate with real font metrics in headless Chromium, not character count |
| File size too large to share | Lower-intensity grain for social encode; `-tune grain`; target ≤30 MB for social |
| Photosensitivity risk | Flash rate check in validate.js; `safe_motion` flag in theme.json |
| Font rendering differences across platforms | Determinism guarantee scoped to pinned Playwright Chromium only |
| Fonts/music licensing | Only OFL fonts; all sound synthesized in code |
| Indic/non-Latin script rendering breaks | One FontFace per script family; do not bundle multiple scripts under one family name |
| claude.ai sandbox time limit kills render | Chunked `--from`/`--to` flags in render.js |
| script.json breaks after theme update | `theme_version` pinned in script; validate.js checks compatibility and fails loudly |

---

## 15. First message to Claude Code

> "Read RESUMOTION_PLAN.md and reference/nidhi-reel-v2.html. We're doing Phase 1. First, propose the exact file list and the scene breakdown of the reference reel into the perception theme, including the case_study scene for the Barclays story and the updated beat counts from v2. Don't write code until I approve the breakdown."
