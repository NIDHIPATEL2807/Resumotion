# RESUMOTION — Skill Release Plan (v0.1.0)

> This is the active build plan for the first public release.
> Source of truth: **this file > RESUMOTION_PLAN_V2.md > RESUMOTION_PLAN.md**
> Tell Claude Code: "Read RESUMOTION_SKILL_PLAN.md. This is the active plan. Start with the task marked NEXT."

---

## 0. What v0.1.0 is (and isn't)

**Is:**
- A Claude skill (zip) that turns a resume into a beat-synced MP4
- One theme: Perception (ML/CV/AI engineers)
- 16:9 only
- Works in claude.ai (HTML fallback) and Claude Code (full MP4)
- Ships with a GitHub README loop GIF as a deliverable

**Is not (yet):**
- A Claude Code plugin (`.claude-plugin/`) — comes after the skill is loved
- A website/showcase (`site/`) — same
- 9:16 vertical layout
- More than one theme

---

## 1. Repo structure for v0.1.0

```
resumotion/
├── SKILL.md                          ← skill entry point (< 500 lines)
├── skills/resumotion/references/
│   ├── copywriting.md
│   ├── themes.md
│   └── script-schema.md
├── engine/
│   ├── timeline.js
│   ├── player.js
│   ├── seek.js
│   ├── fx.js
│   ├── easing.js
│   ├── prng.js
│   └── audio/
│       ├── synth.js
│       └── mixer.js
├── themes/perception/
│   ├── theme.json
│   ├── score.js
│   └── scenes/
│       ├── opener.js
│       ├── name_slam.js
│       ├── thesis.js
│       ├── case_study.js
│       ├── experience.js
│       ├── project.js
│       ├── wins_grid.js
│       ├── stack_flash.js
│       ├── silence.js
│       └── outro.js
├── scripts/
│   ├── build-preview.js              ← HTML reel + download button (chat path)
│   ├── render.js                     ← Playwright + ffmpeg (Claude Code path)
│   ├── validate.js                   ← schema + overflow + flash checks
│   ├── check-audio.js                ← LUFS + peaks + silence
│   ├── check-deps.js                 ← Node / ffmpeg / Playwright check
│   ├── export-captions.js            ← script.json → reel.srt
│   └── export-readme.js             ← best-moments loop → GIF + paste snippet
├── assets/
│   ├── fonts/                        ← OFL fonts (Syne, JetBrains Mono)
│   └── brand/
│       └── dino.svg                  ← mascot, used in end card
├── examples/
│   ├── reference/                    ← stripped reference reel (personal details removed)
│   └── nidhi/
│       └── script.json
├── TASTE.md                          ← user preference file (pace, density, etc.)
├── package.json
├── .gitignore
├── LICENSE                           ← MIT
└── README.md
```

**Not in main yet:** `site/`, `.claude-plugin/`, `out/`, personal/unstripped HTMLs.

---

## 2. NEXT — Step 1: Faithful port

> **Do not redesign. Copy the reference exactly.**

- [ ] Strip personal details from reference reels → move to `examples/reference/`
- [ ] Embed Syne + JetBrains Mono (base64 or bundled woff2). Before frame 0, await `document.fonts.load("800 1em Syne")` etc. for every family/weight combination. Never use `document.fonts.ready`.
- [ ] Re-port every Perception scene with exact timings, easing curves, staggers, grain, and jitter values from the reference HTML. No creative changes.
- [ ] Extract shared primitives into engine files:
  - `RISE`, `BOX`, `DEPTH`, `wob`, `WIPE` → `engine/fx.js` / `engine/text.js`
- [ ] Side-by-side check: render stills at 1 s, 5 s, 10 s, 15 s, 20 s, 30 s from reference and port. List every difference. Fix. Repeat.
- **Done when:** can't honestly tell the port from the reference.

### HyperFrames spike (decide before full port)
[heygen-com/hyperframes, Apache 2.0] already does HTML → headless Chrome → deterministic MP4.
- Spike (half day): rebuild `name_slam` scene in HyperFrames.
- Check: same visual quality? Can we pipe our synthesized WAV as the audio track?
- Yes → build on HyperFrames, spend time on themes + resume flow.
- No → keep our own engine.

---

## 3. Variety inside the Perception theme

Two different resumes must look clearly different. Phase 1 minimum:

| Lever | Detail |
|---|---|
| Content | Different scenes, lengths, metaphors — free and strongest |
| Scene variants | 2–3 layouts for `project`, `name_slam`, `outro` |
| Seed | `seed = hash(name)` drives grain, jitter, glitch timing, variant picks |
| Palette | Brand colors if given, else 4–5 approved palettes |
| Transitions | Pool of carriers; never same one twice in a row |

`theme.json` variant format:
```json
"project": {
  "beats": [6, 10],
  "variants": ["slam_right", "fullscreen_visual", "split_wipe"],
  "visuals": ["generic_detect", "route_draw", "depth_map", "build_bar"]
}
```

Sameness check: tile frame sheets of all example resumes side by side. If you can't tell people apart without reading the text → add variants.

---

## 4. GitHub README loop (ships with v0.1.0)

`export-readme.js` produces a silent, seamless 6–10 s loop designed for GitHub profile READMEs.

**The README cut is not a shrunk reel.** It is: name slam → thesis line → one project → stack flash. Highest-impact beats only, no sound, no subtitles, reads perfectly on mute.

Output:
```
out/reel-readme.gif        ← primary, works everywhere, autoplays
out/reel-readme.webp       ← secondary, smaller
out/README-snippet.md      ← ready-to-paste markdown
```

`README-snippet.md` content:
```markdown
[![My reel](reel-readme.gif)](https://link-to-full-video)

<sub>made with [resumotion°](https://github.com/<me>/resumotion)</sub>
```

**Why this matters for distribution:** every embed is a permanent backlink. Put your own loop on your GitHub profile before launch — it's the demo devs see when they visit your profile.

---

## 5. Two render paths

| Where | How |
|---|---|
| Claude Code | `render.js` → Playwright + ffmpeg → MP4 (deterministic) |
| claude.ai | Sandbox render (chunked `--from/--to`). Fallback: `build-preview.js` → HTML that records itself via `canvas.captureStream()` + `MediaRecorder` → WebM download |

The skill checks for Node / ffmpeg / Playwright at startup and explains exactly how to install anything missing.

---

## 6. SKILL.md frontmatter (claude.ai allowed fields only)

```yaml
---
name: resumotion
description: Turn a resume, CV, portfolio, or LinkedIn text into a pro, beat-synced motion video with synthesized music. Use whenever someone wants a video resume, portfolio reel, showreel, intro video, or animated version of their career, even if they don't say "video".
license: MIT
compatibility: Full MP4 render needs Node 20+, ffmpeg, and Playwright. Chat users get a live HTML reel with a download button.
---
```

Use `${CLAUDE_SKILL_DIR}` for all bundled file paths (e.g. `node ${CLAUDE_SKILL_DIR}/scripts/render.js`).

---

## 7. Quality bar (non-negotiable before release)

Every check returns **pass**, **fixed**, or **n/a**. No silent skips.

| Check | Rule |
|---|---|
| Text on-screen duration | ≥ `words ÷ 3 + 1` seconds per text block |
| Safe area | All text ≥ 5% inside every edge |
| Contrast | ≥ 4.5:1 at the worst frame |
| Loudness | −14 LUFS ±1, true peak ≤ −1 dBTP |
| Audio-visual sync | Each visual hit within 2 frames of its sound |
| Text overflow | Zero — measured with real font metrics in headless Chromium |
| Flash rate | ≤ 3 full-screen flashes/second |
| Black frames | None (framesheet scan) |
| Frame 1 designed | Not black, not a loading state |
| Screen never blank | Something always on screen, even during silence |
| Every cut has a carrier | A shape, line, mask, or wipe — no bare crossfades |

---

## 8. Pipeline (what Claude does vs what code does)

```
resume.pdf / text
     │
     ▼
[Claude] Extract facts.json — copy only, null for unknowns
     │
     ▼
[Claude] Gaps check — ask ≤3 questions if name/role/one-thing missing
     │
     ▼
[Claude] Confidentiality check — flag internal names/details, ask before using
     │
     ▼
[Claude] Pick theme + write script.json + script.md
     │
     ▼
[Code]  validate.js — schema, beat ranges, visual keys, text overflow, flash
     │
     ▼
[GATE 1 — SCRIPT] Claude shows script.md. User edits. Frozen on approval.
     │
     ▼
[Code]  render.js --stills-only — start/mid/settled frame per scene
     │
     ▼
[GATE 2 — PREVIEW] Claude shows stills. User says go.
     │
     ▼
[Code]  render.js — full MP4
[Code]  check-audio.js — LUFS, peaks, silence, drop
[Code]  export-captions.js — reel.srt
[Code]  export-readme.js — README loop GIF
```

Retry limit: max 3 fix-and-rerender attempts, then stop and tell the user what's broken.

---

## 9. v0.1.0 release checklist

- [ ] Faithful port done and verified (Step 2)
- [ ] Name check done (Remotion confusion — see RESUMOTION_PLAN.md §2)
- [ ] `validate.js` complete (schema + overflow + flash)
- [ ] `check-audio.js` complete (LUFS + peaks)
- [ ] `export-captions.js` complete
- [ ] `export-readme.js` complete (README GIF)
- [ ] 5 fake resumes tested: thin, rich, non-tech, non-English name, missing email + one with confidential internship
- [ ] Tested in a **fresh** chat, not the build chat
- [ ] Trigger test: 5 phrasings all activate the skill ("video resume", "animate my CV", "reel from my LinkedIn", "showreel", "intro video")
- [ ] Tested on claude.ai (zip upload) AND Claude Code
- [ ] `out/`, `node_modules/`, personal HTMLs excluded from zip
- [ ] Reference reel stripped of personal details before commit
- [ ] README: reel GIF on top → one-line pitch → install (chat) → install (Claude Code) → "attach resume, say make my video" → share your reel
- [ ] Version in README and end card

Package command:
```bash
zip -r resumotion.zip resumotion/ -x "*/node_modules/*" "*.DS_Store" "*/out/*"
```
Attach to GitHub Release `v0.1.0`.

---

## 10. What merges from `plugin1` to `main`

| Keep on `plugin1` | Merge to `main` |
|---|---|
| `.claude-plugin/` (premature) | `engine/` (all) |
| `site/` (post-v0) | `themes/perception/` (all) |
| `ui.md`, `theme.md` (scratch notes) | `scripts/` (all — add validate, check-audio, export-captions, export-readme) |
| `Ninosauraus_*` (unstripped personal) | `assets/fonts/` + `assets/brand/` |
| `out/` (build artifacts) | `examples/nidhi/script.json` |
| `Nidhi Patel — Reel v2.*` (personal, strip first) | `skills/`, `commands/` |
| | `SKILL.md`, both plan MDs, this file |
| | `package.json`, `.gitignore`, `LICENSE`, `README.md` |
| | `examples/reference/` (stripped reference reel) |

---

## 11. After v0.1.0 — what comes next

**Make it loved first, then expand.**

Key signal: **do people post their reel without being asked?** If not, keep fixing.

Order:
1. Post "drop your resume, I'll make yours" — make 10–20 real reels
2. Every problem → permanent check (error) or TASTE.md (taste preference)
3. Month 2: second theme (Growth Chart — finance/consulting/MBA)
4. Month 2: 9:16 vertical (designed, not cropped)
5. Month 3: `themes/_template/` + CONTRIBUTING.md + community themes
6. Month 4: plugin wrapper, web app only once themes are proven

See RESUMOTION_PLAN_V2.md §7 for the full expansion roadmap.
