---
name: resumotion
description: Turn a resume, CV, portfolio or LinkedIn text into an original, beat-synced motion-graphics video reel with synthesized music — a concept invented for that person, not a template. Use when someone wants a video resume, portfolio reel, showreel, intro video, "make my resume move", or an animated version of their career, even if they don't say "video".
---

# resumotion°

A motion-graphics reel invented for one person. Not a template — a concept built from their resume, their field's visual language, and their own story. Every reel has a hook in the first 2 seconds, one hero moment that's theirs alone, and beat-synced music synthesized to match.

## Fast path (8 steps — follow exactly)

**1. Read & extract**
Read the resume (+ any links or profile text). Extract `facts.json`. Real facts only — `null` for unknowns, never invent. Strip phone/address silently. Flag internal team names, unreleased products, client names under NDA — ask once per flag, log answer in `confidential_note`. Never proceed past this step without the person's name, role, and at least one thing they built.

**2. Propose 3 concepts**
One line each + why it fits *this person*:
- **Original** (recommend first): invented from their world — their field's visual language, a signature story, a mascot, a pen name.
- **Remix**: an existing theme's visual device in a different world.
- **Theme**: the closest theme from `assets/themes/index.md` — they can browse and pick any.

Read `references/concepts.md` before proposing. Never pick by job title alone.

**3. GATE 0 — style frame**
Build a 2-still quick scene for the chosen concept (`node scripts/stills.js`) → show it → "This look?" Fix here; it costs nothing.

**4. Ask ≤ 6 questions**
Use `references/questions.md`. Always ask feel + accent colour (if not obvious from the resume). Add theme-specific questions from `assets/themes/[theme]/THEME.md §11`. Defaults — never ask, just apply: **CGPA off, phone off, QR off**. Offer the personalise menu in one line: *"I can also add [headshot / mascot / ticker / catchphrase / 9:16 cut / README GIF] — want any of these?"*

**5. GATE 1 — script approval**
Write `script.md`: every scene, beat range, every word on screen, every label. Show it. Their edits are facts — update `facts.json` immediately. Do not write a line of HTML until they approve.

**6. Build hero story first**
Write `scenes.js` + `score.js` only. Assemble with:
```bash
python3 ${CLAUDE_SKILL_DIR}/scripts/build.py \
  --theme <theme> --scenes scenes.js --score score.js \
  --facts facts.json --out <name>-reel.html
```
Build the hero scene (problem → bottleneck → solution → result) before any other scene. Then add the rest in script order.

Never read or rewrite `assets/player.html` or any file in `scripts/` — treat them as a black box.

**7. GATE 2 — stills**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/stills.js <name>-reel.html
```
Fix every overlap/overflow warning before showing the person. Zero warnings = proceed.

**8. Render or deliver**
If Playwright + Chromium + ffmpeg are available:
```bash
# First time only — install Playwright inside the scripts folder
cd ${CLAUDE_SKILL_DIR}/scripts && npm install && npx playwright install chromium && cd -

node ${CLAUDE_SKILL_DIR}/scripts/render.js <name>-reel.html --name <slug>
node ${CLAUDE_SKILL_DIR}/scripts/check-audio.js out/<slug>-master.mp4
```
Max 3 fix-and-rerender attempts, then report exactly what's broken.

If tools aren't available: deliver the HTML. It has a **▶ Play with sound** button and a **⏺ Record video** button (canvas `captureStream` + `MediaRecorder` — no installs needed). Tell the person which button does what.

Deliver: HTML + MP4 (master + social < 30 MB) + `.srt` captions + optional README GIF. Ask: *"Anything to change?"*

---

## The reel contract

Every `scenes.js` must expose these on `window`:

```js
window.__meta  = { DUR, FPS, BPM, scenes: [['name', b0, b1], …], silences: [t, …] }
window.__render = (t) => { /* pure function of t — no side effects, no Date.now() */ }
window.__audio  = async () => '…base64 wav…'   // same score() as live preview
window.__ready  = Promise  // resolves after fonts.load() per weight + image decode
```

Hard rules — enforced by `stills.js` and `check-audio.js`:
- `__render(t)` is a **pure function of t**. Calling it with the same t twice produces the same frame.
- No `Math.random()`, no `Date.now()`, no timers. Seeded hash only: `hs(seed + offset)`.
- Every text helper **multiplies** `globalAlpha`, never assigns it. Direct assignment breaks scene fades.
- `document.fonts.load('800 1em Syne')` per family/weight — not `fonts.ready` (fires too early for canvas).
- Base64-embed fonts in the assembled HTML (build.py does this). Never CDN at runtime.
- Iris / cut-outs use `evenodd` fill rule (not counter-clockwise arcs — they differ across browsers).
- `?t=<seconds>` in the URL freezes the reel at that frame (player.html handles this).

---

## Anti-sameness rules

Every reel skeleton is the same (open → name → hero → projects → outro). That's intentional — like Spotify Wrapped. What makes reels different is the content-to-visual mapping and one bespoke moment per person.

1. **`reference.html` is a parts library, not a script.** Copy primitives (easing, draw helpers, synth, render contract). Rebuild the scene list from this person's resume. Never reuse the reference's scene order, on-screen copy, or timings.

2. **Beat map comes from the resume.** Thin resume → ~30 s. Rich resume → ~55 s. Never pad to hit a round number. Every scene needs content — if the person has no wins, skip the wins scene.

3. **One bespoke moment is mandatory.** Every reel must have one visual invented for this person that is not in any theme file and has never appeared in another reel. Examples: the dot that becomes their mascot's heart; the scope drawing their name in XY mode; the C4 diagram snapping into a bridge. If you can't think of one, re-read the resume.

4. **Every project gets the visual that matches its type.** Use the content-to-visual table in `THEME.md §9`. Generic fallback (banner + obstacle + 2 stats) for at most one project per reel.

5. **Sameness check before building.** After writing `script.md`, compare it against the chosen theme's reference scene list. If > 30% of the on-screen lines or the scene order match the reference, rewrite those scenes.

6. **Variation knobs:** accent / brand colour · edition (dark or light variant) · identity label · hero experience choice · mascot or no mascot · tempo/key variant. Apply at least two per reel.

---

## Draft themes

Themes marked 🟡 in `assets/themes/index.md` have a `THEME.md` but no `reference.html`. For these:

1. Tell the person: *"This is the first build of this theme. I'll check in after every scene — your reel becomes the reference once you approve it."*
2. Run `stills.js` after **every scene**, not just at Gate 2.
3. After the person approves the final MP4, scrub all personal details from the HTML and commit it as `assets/themes/[theme]/reference.html`. The theme is now ready.

---

## Honesty

- Real numbers only. Label academic work `"case study"`, WIP `"in progress"`, estimated charts `"indicative"`.
- Logos: user-supplied only, tinted one colour. Mascot image: never redrawn or recoloured.
- Confidential names: ask first, wait for answer, log it.
- Never invent facts, metrics, employers, or awards — even plausible-sounding ones.

---

## 10 lessons (from 7 reels)

1. Hook in the first 2 s. Perception v2 and IPO Day: ✅. XY Mode: buried the hook at 4 s — restructure the opener.
2. `document.fonts.load()` per weight, not `fonts.ready` — fires too early, canvas uses system font.
3. `globalAlpha *=`, never `=`. Assigning it directly was the cause of every broken fade.
4. Fit-to-width using the **final value** of counters, not the animated value — text jumps otherwise.
5. Chunked render from day one (`render.js --from --to`). The sandbox kills long commands.
6. Match the person's discipline, not their tools. Oscilloscope reads as signals/measurement — not VLSI chips.
7. One beat of true silence before the big hit. Cut music bus in ≤ 30 ms — reverb tails leak through a slow cut.
8. Particles and confetti must fade before contact info appears. HUD panels hide during finales.
9. XY audio: bypass compressor + reverb (direct to destination). Generate per-sample-rate (44.1k live, 48k offline).
10. Five hackathons, five trophies — check that ML challenges count as hackathons. Verify every count claim.

---

## Footer credit

Small `made with resumotion°` on the end card, ~1.5 s, small and muted — not centred and loud. Keep it by default. Remove it whenever the person asks — no friction, no explanation. Never an author credit (*"made by …"*); the reel belongs to the person.

---

## Don'ts

- No `Math.random()`, `Date.now()`, timers, or `setInterval` in `scenes.js` / `score.js`.
- No CDN scripts — the assembled HTML must run when opened from disk.
- No browser automation tools (`Playwright.launch()`, `puppeteer`) during the build flow — they can hang.
- No publishing to a shareable link without asking the person first.
- No rewriting `player.html` or anything in `scripts/` when building a reel — add only `scenes.js` and `score.js`.
- No inventing a concept that doesn't fit the person because it would look cool.
