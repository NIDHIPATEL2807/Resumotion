# resumotion°

**Turn your resume into a beat-synced motion reel in one conversation.**

A Claude skill. Works in claude.ai and Claude Code. No timeline software, no After Effects, no design skills needed.

---

<!-- drop reel-readme.gif here once export-readme.js is built -->
<!-- ![resumotion demo](out/reel-readme.gif) -->

---

## examples

Three reels, three completely different films — same skill, different people.

### Perception — ML / CV / AI engineers
> detector boxes, depth maps, beat-synced impacts, dark orange palette

<!-- ![Perception theme](gallery/perception-preview.gif) -->
*preview coming — [see reference reel](themes/perception/) · dark background · Syne + JetBrains Mono · 120 BPM D minor*

---

### Speedrun — game devs / hackers / fast builders
> dino mascot, pixel energy, rapid cuts, neon on black

<!-- ![Speedrun theme](gallery/speedrun-preview.gif) -->
*preview coming — [see reference reel](themes/speedrun/) · black + neon · pixelated type · high BPM*

---

### Prospectus — finance / consulting / MBA
> career as a rising chart, annotated milestones, restrained and premium

<!-- ![Prospectus theme](gallery/prospectus-preview.gif) -->
*preview coming · navy + gold · IBM Plex Sans · ~105 BPM soft piano*

---

## what it makes

A 30–50 second MP4 reel — your name, your work, your stack — animated to music you didn't have to compose. The kind of thing you post on LinkedIn and people screenshot.

Every reel is written fresh for the person. Two resumes in the same theme look clearly different.

---

## how it works

```
you:   paste resume
claude: ≤2 questions ("one word for your work style?")
claude: writes screenplay → you approve (Gate 1)
claude: renders 3 preview frames per scene → you approve (Gate 2)
claude: renders full MP4 + social cut + README GIF
```

That's it. You never touch a timeline or a canvas.

---

## install — claude.ai (no setup)

1. Download `resumotion.zip` from [Releases](../../releases)
2. Go to Claude → Settings → Skills → upload the zip
3. New conversation → attach your resume → "make my resume into a video"
4. Claude does the rest — the reel plays in your browser, click **Download video**

Works on Chrome and Edge. Downloaded file is WebM (plays everywhere). Code execution must be on.

---

## install — Claude Code (best quality, full MP4)

```bash
# 1. clone into your skills folder
git clone https://github.com/NIDHIPATEL2807/Resumotion ~/.claude/skills/resumotion
cd ~/.claude/skills/resumotion

# 2. install node dependencies
npm install
npx playwright install chromium

# 3. install ffmpeg
# mac:     brew install ffmpeg
# windows: winget install ffmpeg
# linux:   sudo apt install ffmpeg
```

Then in any folder with your resume:

```
claude
> turn my resume into a reel
```

Output in `out/`:
- `reel-yourname-16x9.mp4` — master (CRF 20)
- `reel-yourname-16x9-social.mp4` — 1280×720 for LinkedIn/Instagram
- `reel-yourname-16x9-framesheet.jpg` — contact sheet of every second
- `reel-readme.gif` — silent loop for your GitHub profile README

---

## personalization

Claude tailors every reel to the person. Things you can specify:

| what | how |
|---|---|
| feel | "one word: precise / bold / calm / playful" → maps to speed + music energy |
| accent color | any hex, or describe it — default is theme's approved palette |
| mascot / nickname | "nino.model", a dino, a handle — shows in the opener and outro |
| logo | attach a PNG — Claude tints it to match your palette |
| "open to" roles | shows in the outro CTA |
| density | punchy (default, ≤6 words per beat) or detailed |

If you don't specify anything, Claude picks sensible defaults from your resume.

---

## the two gates

**Gate 1 — screenplay**
Claude writes a scene-by-scene screenplay in plain English before touching any canvas. Every scene, every word, every time range. You edit in plain language ("make the stats section slower", "change 'engineer' to 'builder'"). Nothing renders until you say go.

**Gate 2 — preview frames**
Three stills (start / mid / settled) per scene render first. You review the contact sheet, flag anything off. Full render only after you approve.

This catches layout problems in seconds, not minutes.

---

## themes

| Theme | For | Look | Sound |
|---|---|---|---|
| **Perception** ✅ | ML / CV / AI / robotics | Detector boxes, depth maps, scanner wipes | D minor, 120 BPM, drone → drop |
| **Speedrun** ✅ | Game devs, hackers, fast builders | Dino mascot, pixel energy, rapid cuts | High BPM, chiptune energy |
| **Prospectus** 🔜 | Finance, IB, consulting, MBA | Career chart, annotated milestones | Soft piano, ~105 BPM |
| **General** 🔜 | Anyone else (electrical, teaching, ops…) | Clean bold type, no domain metaphors | Neutral electronic |

Each theme is a `THEME.md` brief + a reference HTML. Claude reads the brief and writes a bespoke HTML per person — same theme, different film every time.

Want to build a theme? Copy `themes/_template/THEME.md` and fill it in.

---

## privacy

Your resume text goes to Claude's API as part of your conversation — same as any other message you send Claude. The rendered video is generated on your machine (Claude Code) or in your browser (claude.ai). Nothing is uploaded to a server.

If your resume contains confidential project names or unreleased products, Claude will flag them and ask before including anything sensitive.

---

## quality checks (automatic)

Every render runs these. Each returns **pass**, **fixed**, or **n/a** — nothing is silently skipped.

| check | rule |
|---|---|
| text duration | ≥ words ÷ 3 + 1 s per block |
| safe area | all text ≥ 5% inside every edge |
| contrast | ≥ 4.5:1 at worst frame |
| loudness | −14 LUFS ±1, true peak ≤ −1 dBTP |
| A/V sync | each hit within 2 frames of its sound |
| text overflow | zero — measured with real fonts |
| flash rate | ≤ 3 full-screen flashes/second |

---

## repo structure

```
resumotion/
├── SKILL.md                  ← Claude reads this (the workflow)
├── references/               ← Claude reads these too
│   ├── discovery.md          ← facts extraction + personalization menu
│   ├── story.md              ← what to showcase, scene order, length
│   ├── quality-bar.md        ← all quality checks
│   ├── craft.md              ← technical lessons (fonts, globalAlpha, etc.)
│   └── themes.md             ← which theme fits which person
├── themes/
│   ├── _template/THEME.md    ← starter for new themes
│   ├── perception/THEME.md   ← ML/CV/AI theme brief
│   ├── speedrun/THEME.md     ← game dev / hacker theme brief
│   └── prospectus/THEME.md   ← finance / consulting theme brief
├── toolkit/
│   ├── helpers.js            ← easing, text helpers, font preload, seek API
│   ├── render.js             ← Playwright + ffmpeg → MP4 (chunked)
│   ├── stills.js             ← preview frames → contact sheet
│   ├── check-audio.js        ← LUFS + peaks + silence check
│   ├── export-captions.js    ← script → reel.srt
│   ├── export-readme.js      ← silent GIF loop for GitHub profile
│   └── fonts/                ← Syne + JetBrains Mono woff2 (bundled)
├── examples/                 ← fake people: facts.json + script.md
└── gallery/                  ← links to real reels (no video files committed)
```

---

## faq

**does it work for non-engineers?**
Yes — pick the right theme. Speedrun for game devs. Prospectus for finance. General (coming) for everyone else.

**can i edit the MP4 after?**
Yes, it's standard H.264. Drop it in Premiere, DaVinci, CapCut, whatever.

**can i do 9:16 (vertical / reels)?**
Not in v0. On the roadmap.

**i found a bug / the reel looks wrong**
Open an issue with your screenplay (redact anything sensitive) and the framesheet. That's enough to reproduce it.

**can i build my own theme?**
Yes — copy `themes/_template/THEME.md`, fill it in, open a PR.

---

## built with

- [Playwright](https://playwright.dev) — headless Chromium for frame capture
- [ffmpeg](https://ffmpeg.org) — H.264 encoding
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — synthesized score, runs offline
- [Claude](https://claude.ai) — writes the screenplay

---

*resumotion° is open source. MIT license.*
*made by [Nidhi Patel](https://nidhipatel28.vercel.app)*
