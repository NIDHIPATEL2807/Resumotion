# resumotion°

**Turn your resume into a beat-synced motion reel in one conversation.**

A Claude skill. Works in claude.ai and Claude Code. No timeline software, no After Effects, no design skills needed.

---

## what it makes

A 40–60 second MP4 reel — your name, your work, your stack — animated to music. The kind of thing you post on LinkedIn and people screenshot.

[example: Nidhi Patel reel →](examples/nidhi/)

---

## how it works

You paste your resume. Claude asks you two questions max. You approve a screenplay. You approve three preview frames. You get an MP4.

```
you: paste resume
claude: asks ≤2 questions ("one word for your work style?")
claude: writes screenplay → you approve
claude: renders 3 preview frames → you approve  
claude: renders full MP4 + social cut (1280×720)
```

That's it.

---

## using it in claude.ai (no setup)

1. Open [claude.ai](https://claude.ai)
2. Add this skill to your project
3. Start a new conversation, paste your resume
4. Claude does the rest — the reel plays in your browser and you click **Download video**

The browser records the canvas + audio directly. No installs needed. Works on Chrome and Edge. The downloaded file is WebM (plays everywhere).

---

## using it in Claude Code (best quality)

Claude Code renders frame-by-frame via Playwright and encodes with ffmpeg. You get a proper H.264 MP4, a social cut at 1280×720, and a framesheet.

**one-time setup:**

```bash
# 1. clone the repo
git clone https://github.com/nidhipatel/resumotion
cd resumotion

# 2. install dependencies
npm install
npx playwright install chromium

# 3. install ffmpeg
# mac:     brew install ffmpeg
# windows: winget install ffmpeg
# linux:   sudo apt install ffmpeg

# 4. check everything works
node scripts/check-deps.js
```

**then just talk to Claude:**

```
/resumotion  →  paste your resume when asked
```

Output lands in `out/`:
- `reel-yourname-16x9.mp4` — master (CRF 20)
- `reel-yourname-16x9-social.mp4` — 1280×720 for LinkedIn/Instagram
- `reel-yourname-16x9-framesheet.jpg` — contact sheet of key frames

---

## personalization

Claude tailors every reel to the person. Things that change:

| what | how |
|------|-----|
| name animation | letter positions, slam timing, line breaks |
| color accent | you can specify any hex — default is `#FF6B2B` orange |
| work style word | "precise" → tighter, cooler palette; "bold" → bigger type, more impact |
| scene selection | Claude picks which scenes to include based on your resume |
| scan box seed | name-hashed so your grain/jitter pattern is unique to you |
| mascot | optional — add your own character image (see below) |
| brand logo | optional — shown in the opener and outro |

Two resumes in the same theme will always look clearly different.

---

## adding your mascot / logo (optional)

Drop files in `assets/`:

```
assets/
  mascot.png     ← your character (transparent PNG, ~280px tall)
  logo.png       ← your logo (transparent PNG)
  brand-color.txt ← one line: #FF6B2B
```

Claude detects them automatically and includes them in:
- opener scene (mascot rises in, gets a detector box)
- outro scene (mascot waves goodbye)
- name slam scene (logo top-right)

If no mascot is provided, the opener uses a clean boot sequence instead.

---

## the two gates

Claude will not render the full MP4 without your approval at two checkpoints.

**Gate 1 — screenplay**
Claude writes a scene-by-scene screenplay in plain English before touching any canvas. You read it, say "looks good" or ask for changes. Nothing renders until you approve.

**Gate 2 — preview frames**
Three stills (beginning / middle / settled) per scene render first. You review them, flag anything off. Full render only after you say go.

This stops you from waiting 3 minutes for a render only to find the name is spelled wrong.

---

## themes

**Perception** (v1, included)
Dark background, orange accent, detector boxes, depth-map scanner, beat-synced impacts. Built for ML / CV / AI / robotics engineers. Works for anyone.

More themes coming. If you want to build one: copy `themes/perception/`, edit `theme.json` and the scene files. Each scene is a single `render(ctx, localT, data, script, theme, frame)` function — no framework to learn.

---

## what Claude writes (and what it doesn't touch)

Claude writes `script.json` — the screenplay: scene order, text content, timing in beats, variant choices. It never touches the rendering engine. The engine is deterministic: same script always produces the same frames.

This means you can version-control your reel. Commit `script.json`, re-render any time, get pixel-identical output.

---

## privacy

Your resume text is sent to Claude's API as part of the conversation. It is not stored in this repo. The rendered MP4 is generated entirely on your machine (Claude Code) or in your browser (claude.ai). Nothing is uploaded.

If your resume contains confidential project names or unreleased products, Claude will ask before including them and suggest redactions.

---

## quality checks (automatic)

Before the final render, Claude runs:

| check | target |
|-------|--------|
| words ÷ 3 + 1s ≤ scene duration | no rushed text |
| all text inside 5% safe area | nothing cropped on mobile |
| contrast ratio ≥ 4.5:1 | readable on any screen |
| loudness -14 LUFS ±1 | sounds right on phone speakers |
| A/V sync within 2 frames | audio hits land on time |

Anything that fails gets flagged with a fix, not silently skipped.

---

## repo structure

```
resumotion/
  SKILL.md              ← Claude reads this (the skill instructions)
  README.md             ← you are here
  package.json
  engine/               ← deterministic render engine (JS)
    timeline.js         ← beat clock, single source of truth for timing
    easing.js
    prng.js             ← seeded randomness (mulberry32)
    fx.js               ← text, boxes, grain, shake
    audio/
      synth.js
      mixer.js
  themes/
    perception/
      theme.json
      score.js          ← the music
      scenes/           ← one file per scene type
        opener.js
        name_slam.js
        thesis.js
        case_study.js
        project.js
        wins_grid.js
        stack_flash.js
        outro.js
  scripts/
    build-preview.js    ← script.json → standalone preview.html
    render.js           ← preview.html → MP4 via Playwright + ffmpeg
    validate.js         ← quality checks
    check-deps.js       ← node / ffmpeg / playwright check
  examples/
    nidhi/
      script.json       ← example screenplay
  assets/
    fonts/              ← Syne + JetBrains Mono woff2 (bundled, no network needed)
```

---

## faq

**does it work for non-engineers?**
Yes. The Perception theme works for anyone. The scene selection adapts to what's in your resume — a designer gets different scenes than a backend engineer.

**can i edit the MP4 after?**
Yes, it's a standard H.264 file. Drop it in Premiere, DaVinci, CapCut, whatever.

**can i change the music?**
Edit `themes/perception/score.js`. Every instrument and timing is in there. BPM is set in `theme.json`.

**can i do 9:16 (vertical / reels format)?**
Not in v0. On the roadmap.

**i found a bug / the reel looks wrong**
Open an issue with your `script.json` (redact anything sensitive) and the framesheet. That's enough to reproduce it.

---

## built with

- [Playwright](https://playwright.dev) — headless Chromium for frame capture
- [ffmpeg](https://ffmpeg.org) — H.264 encoding
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — synthesized score, runs offline
- [Claude](https://claude.ai) — writes the screenplay

---

*resumotion° is open source. MIT license.*
*made by [Nidhi Patel](https://nidhipatel28.vercel.app)*
