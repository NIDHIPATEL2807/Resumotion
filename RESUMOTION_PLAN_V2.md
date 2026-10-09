# RESUMOTION — Plan v2 (what we're actually doing)

> This file updates `RESUMOTION_PLAN.md`. Where they disagree, **this file wins**.
> Tell Claude Code: **"Read RESUMOTION_PLAN.md and RESUMOTION_PLAN_V2.md. V2 wins on conflicts. Start with Step 1. Ask before writing code."**

---

## 0. The big decisions (locked)

1. **Ship a skill first, not a plugin.** A plugin is just a box around a skill. The skill is the product core and works in claude.ai, Claude Code, and other agents. The plugin wrapper comes later.
2. **AI writes the script, code makes the movie.** At user time, Claude only writes `facts.json` + `script.json`. Claude does **not** write scene code for each user.
3. **Themes are written at dev time.** We (me + Claude Code) write and polish theme scenes, iterating on stills until they match the reference. Then we commit them. Users only get proven themes.
4. **Quality before features.** Nothing ships until the Perception theme looks as good as `nidhi-reel-v2.html`.
5. **Variety inside a theme is built in on purpose** (scene variants + per-person seed), so two people never get the same-looking reel.
6. **Never invent facts.** Still rule #1.

---

## 1. Step 1 — Faithful port (do this first)

The first-pass scenes looked rough because they were written cold. Fix:

- [ ] Move the reference HTMLs into `examples/reference/` (personal details stripped before any public commit).
- [ ] Embed Syne + JetBrains Mono (base64 or bundled woff2). Before frame 0, await `document.fonts.load()` for every family/weight. Never rely on `document.fonts.ready`.
- [ ] Re-port the Perception scenes **faithfully**: copy exact timings, easing curves, staggers, grain, and jitter values. **Do not redesign while porting.**
- [ ] Extract the reference primitives into shared code:
  - `RISE`, `BOX`, `DEPTH`, `wob`, `WIPE` → `engine/fx.js` / `engine/text.js`
- [ ] **Side-by-side check:** render stills from the reference and the port at 1 s, 5 s, 10 s, 15 s, 20 s, 30 s. Compare the images, list every difference, fix, repeat.
- **Done when:** I honestly can't tell the port from the reference.

### Decide early: our own engine vs HyperFrames
HyperFrames (heygen-com/hyperframes, Apache 2.0) already does HTML → headless Chrome → deterministic MP4, with lint, validate, preview, and render.
- [ ] Spike (half a day): rebuild one reference scene (name slam) in HyperFrames.
- [ ] Check: Can it reach the same quality? Can we add our own synthesized WAV as the audio track?
- [ ] If yes → build on HyperFrames and spend our time on themes + resume flow. If no → keep our own engine.

---

## 2. Variety inside a theme

Two different resumes in the same theme must look clearly different.

**Stays the same (theme identity):** fonts, motion style, sound style, texture, end card.
**Changes per person:**

| Lever | How |
|---|---|
| Content | Different scenes, lengths, and metaphors come from the actual resume |
| Scene variants | 2–4 layouts per scene type (e.g. `project`: `slam_right`, `fullscreen_visual`, `split_wipe`) |
| Seed | `seed = hash(person's name)` drives grain, jitter, glitch timing, and variant picks. Same person → same video. |
| Palette | Brand colors if given, else one of 4–5 approved palettes per theme |
| Music | A few chord progressions/keys; drop lands on the biggest scene |
| Transitions | A pool of carriers; never the same one twice in a row |

Rules:
- Every variant must pass the quality bar alone.
- Mark bad neighbours (e.g. no two full-screen visuals back to back). Random picks only happen inside safe options.

`theme.json` example:
```json
"project": {
  "beats": [6, 10],
  "variants": ["slam_right", "fullscreen_visual", "split_wipe"],
  "visuals": ["generic_detect", "route_draw", "script_cycle", "depth_map"]
}
```

**Sameness check:** render all example resumes in one theme and tile their frame sheets side by side. If you can't tell people apart without reading the text → add variants.

Phase 1 minimum: 2–3 variants for `project`, `name_slam`, `outro` + the name seed.

---

## 3. Brand and personalization

### Our brand (same in every reel)
- `assets/brand/dino.svg` — the mascot, SVG so it stays sharp and can animate.
- End card: dino + `made with resumotion°`, ~1.5 s, short and tasteful.
- SKILL.md rule: always add the end card unless the user asks to remove it.

### The user's personalization (different per reel)
- Name, role, copy, colors → from their resume.
- Logo / photo → only if the user attaches it. Never fetch logos from the web.
- Preferences ("slower", "less text") → `TASTE.md`.
- Don't promise memory across chats. In claude.ai every chat starts fresh.

---

## 4. Skill folder (v0)

```
resumotion/
├── SKILL.md                 # < 500 lines
├── references/
│   ├── copywriting.md
│   ├── themes.md
│   └── script-schema.md
├── engine/                  # timeline, player, seek, fx, text, audio/
├── themes/perception/       # the one polished theme for v0
├── scripts/
│   ├── validate.js
│   ├── render.js            # Playwright + ffmpeg (Claude Code path)
│   ├── build-preview.js     # HTML reel + "Download video" button (chat path)
│   ├── check-audio.js
│   └── export-captions.js
├── assets/
│   ├── fonts/               # OFL only
│   ├── brand/               # dino.svg, endcard.svg
│   └── reference/           # stripped reference reel
├── examples/                # fake resumes + their script.json
└── LICENSE                  # MIT
```

**Not in v0:** 9:16, README GIF, website, extra themes, plugin manifest.

### SKILL.md frontmatter — claude.ai allows ONLY these fields
`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Anything else = upload fails.

```yaml
---
name: resumotion
description: Turn a resume, CV, portfolio, or LinkedIn text into a pro, beat-synced motion video with synthesized music. Use whenever someone wants a video resume, portfolio reel, showreel, intro video, or animated version of their career, even if they don't say "video".
license: MIT
compatibility: Full MP4 render needs Node 20+, ffmpeg, and Playwright. Chat users get a live HTML reel with a download button.
---
```

- Refer to bundled files with `${CLAUDE_SKILL_DIR}` (e.g. `node ${CLAUDE_SKILL_DIR}/scripts/render.js`).
- Detailed material goes in `references/` and is linked from SKILL.md.

### Two render paths
| Where | How the video is made |
|---|---|
| Claude Code | `render.js` on the user's machine → MP4 (deterministic) |
| claude.ai | Try sandbox render (chunked `--from/--to`). Fallback: `build-preview.js` HTML that plays live and records itself via `canvas.captureStream()` + Web Audio `MediaStreamDestination` + `MediaRecorder` → WebM download |

The skill checks for Node / ffmpeg / Playwright first and explains exactly how to install anything missing.

---

## 5. How people use it

### Claude chat (claude.ai / desktop app)
1. Download `resumotion.zip` from GitHub Releases.
2. Upload it in Claude's skills settings (Customize / Settings → Skills → upload). Code execution must be on.
3. New chat → attach resume PDF → "make my resume into a video".
4. Claude: ≤3 questions → confidentiality check → **Gate 1: script** → **Gate 2: stills** → reel.

### Claude Code
```bash
npx skills add <me>/resumotion
# or
git clone https://github.com/<me>/resumotion ~/.claude/skills/resumotion
```
Then in a folder with `resume.pdf`: run `claude` → `/resumotion` or "turn my resume into a reel".

---

## 6. Release checklist (v0.1.0)

- [ ] Faithful port done (Step 1).
- [ ] Name check done (Remotion confusion — see original plan §2).
- [ ] Test in a **fresh** chat, not the one we built it in.
- [ ] Trigger test: 5 phrasings ("video resume", "animate my CV", "reel from my LinkedIn", "showreel", "intro video") all pick the skill.
- [ ] Tested on claude.ai (zip upload) AND Claude Code.
- [ ] Tested on 5 fake resumes: thin, rich, non-tech, non-English name, missing email (+ one with confidential internship details).
- [ ] Zip is small: no `node_modules`, folder name = skill name.
- [ ] Reference reel stripped of personal details.
- [ ] README: reel GIF on top → one-line pitch → install for chat → install for Claude Code → "attach resume, say make my video" → share your reel.
- [ ] Version number in README and end card. (claude.ai users must re-upload to update.)

Package:
```bash
zip -r resumotion.zip resumotion/ -x "*/node_modules/*" "*.DS_Store"
```
Attach to GitHub Release `v0.1.0`. Download count = a usage metric.

---

## 7. Expansion roadmap

**Order: make it loved → make it spread → make it bigger.**

### Month 1 — Make it loved
- Post "drop your resume, I'll make yours". Make 10–20 real reels (with permission).
- Every problem → permanent check (error) or TASTE.md (taste).
- Key signal: **do people post their reel without being asked?** If not, keep fixing.

### Month 2 — More themes + formats
Themes, picked by who's asking:

| Theme | For | Look |
|---|---|---|
| **Growth Chart** (first) | Finance, IB, consulting, MBA | Career as a rising price chart; milestones as annotated points. Navy `#0A2342`, white, slate `#5B6B82`, gold `#C9A227`. IBM Plex Sans + Mono. Soft piano, ~100–110 BPM |
| Pitchbook | Finance (safer variant) | IB deck aesthetic, waterfall/bar charts |
| Annual Report | Premium / editorial | Ivory `#F6F3EC`, ink `#141414`, oxblood `#7A1E2C`, DM Serif Display + Inter |
| Terminal | Backend / devops | Typed, compiled, logged |
| Swiss Grid | Designers / PMs | Strict grid, huge type, hard cuts |
| Campus | Freshers, placement season | TBD |

Finance rule: case-study numbers ($800M deal, $320M synergies) must be labeled "case study" / "valuation project". Never imply real deals.

Formats: 9:16 vertical (designed, not cropped), README loop GIF, frame-sheet poster, live HTML portfolio embed, 10 s "about me" cut.

### Month 3 — Community
- `themes/_template/` + CONTRIBUTING.md + "make your own theme" guide.
- Credit contributors loudly (README, site, posts).
- Gallery of real reels; "Profiles using resumotion°" list.
- Theme challenge: best new theme gets featured.
- College workshops: placement cells, E-Cells, Enactus, clubs (start at SPIT).

### Month 4+ — Bigger
- Plugin wrapper (`.claude-plugin/`) for one-command Claude Code install.
- List on skills directories so Cursor / Codex users find it.
- Web app (paste resume → video in browser), only once themes are proven.
- New inputs: startup pitch reels, project launch videos from a README, hackathon demos, year-in-review.

### Don't
- Ship 5 themes at once.
- Build the web app before the skill has real users.
- Chase features that don't make more people post their reel.

---

## 8. First message to Claude Code

> "Read RESUMOTION_PLAN.md and RESUMOTION_PLAN_V2.md. V2 wins on conflicts. We're doing Step 1: the faithful port. First: (1) move the reference HTMLs into `examples/reference/`, (2) embed the fonts and load them with `document.fonts.load()` before frame 0, (3) list every animation primitive in the reference (RISE, BOX, DEPTH, wob, WIPE, etc.) with its exact timing/easing values. Then propose the scene file list for the perception theme. Do NOT redesign anything — copy the reference exactly. Don't write scene code until I approve the list. After porting, render stills at 1/5/10/15/20/30 s from both reference and port and list every difference."
