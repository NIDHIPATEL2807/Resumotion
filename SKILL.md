# resumotion° — skill

Turn a resume into a beat-synced motion reel. You write the screenplay and the HTML. The toolkit renders it.

Read these before starting:
- `references/personalization.md` — everything the user can personalize, how to apply it
- `themes/[chosen]/THEME.md` — exact palette, fonts, motion, sound, and scene map for the chosen theme
- `themes/[chosen]/reference.html` — the built example. Copy its primitives and values, never its content.

---

## Step 1 — Discover

Ask for the resume. Accept any format.

Extract `facts.json` — copy only, `null` for unknowns, never invent. Fields: name, role, tagline, projects, experience, wins, stack, contact, brand colors, persona_image, looking_for.

Confidentiality check: flag internal team names, unreleased products, employer-confidential metrics. Ask once: *"I noticed [X] — OK to show on screen?"* Log the answer in facts.json `confidential_note`. Wait before writing anything.

---

## Step 2 — Ask ≤ 2 questions

Ask only what the resume doesn't already answer. Pick the two that matter most:

1. **Feel:** *"One word for how you want this to feel?"* → calm / fast / precise / bold / playful
2. **Accent color:** *"Any brand color?"* → hex, name, or description. Default = theme's approved palette.

See `references/personalization.md` for the full menu. Ask theme-specific add-ons if relevant (e.g. nickname for Perception, dino name for Speedrun). Never ask more than 2 questions total.

---

## Step 3 — Pick a theme

Use `references/themes.md` to match. Say in one line why it fits.

| Theme | For |
|---|---|
| `perception` | ML / CV / AI / robotics engineers |
| `speedrun` | Hackers, game devs, fast builders with personality |
| `ipo` | Finance, IB, consulting, MBA, founders with numbers |
| `prospectus` | Premium finance — calm, editorial, weight |
| `blueprint` | Core engineering: electronics, mechanical, civil, VLSI, embedded |
| `context_window` | Agent builders, LLM/context engineers |
| `general` | Everyone else |

If none fit, design a new theme: copy `themes/_template/THEME.md` and fill every section before writing a line of HTML.

---

## Gate 1 — Script

Write `script.md` — a plain-English screenplay showing every scene, its time range, and every word of on-screen text.

Read `references/story.md` first. Key rules:
- One hero story per reel (problem → insight → what was built → result)
- Scale length to content: thin resume ≈ 30 s, rich ≈ 50 s. Never pad.
- Skip scenes with no data. Ask before cutting if it means shortening something the person is proud of.

Show the user `script.md`. Say: *"Here's your screenplay. Reply with any changes. Once you approve, the words are frozen."*

Apply plain-language edits. Name exactly what changed. Update facts.json for any factual corrections. Re-show until approved.

---

## Step 4 — Build the HTML

Write **one self-contained HTML file** using:
- `themes/[chosen]/THEME.md` — the visual and audio blueprint. Follow it exactly.
- `themes/[chosen]/reference.html` — copy its helpers, easing functions, audio primitives, and render contract. Never copy its content (names, companies, copy).
- `toolkit/helpers.js` — shared primitives: RISE, BOX, TW, FIT, font preload, `window.__render(t)` seek contract, WAV export.
- `toolkit/fonts/` — bundled woff2 files.

**Technical rules (from `references/craft.md`):**
- Await `document.fonts.load("800 1em Syne")` for every family/weight before frame 0. Never `fonts.ready`.
- Text helpers must MULTIPLY `globalAlpha`, never set it — or fades break.
- Measure text with real fonts; use FIT so long names never overflow.
- One font family per script (Indic0, Indic1…) — never bundle multiple scripts under one family.
- Deterministic randomness only: `hs(seed)` from the person's name hash. No `Math.random()`.
- Expose `window.__render(t)` — the seek contract the toolkit uses for frame capture.

---

## Gate 2 — Preview stills

Run:
```
node toolkit/stills.js [reel.html]
```

This renders the start, mid, and settled frame for each scene into a contact sheet. Fix any overflow, clipping, or layout issues before showing the user. Show the contact sheet. Say: *"Here's how it looks. Reply 'go' to render the full video, or tell me what to change."*

---

## Step 5 — Render

On approval:
```
node toolkit/render.js [reel.html]
```

Outputs:
- `out/reel-[name]-16x9.mp4` — master (CRF 20)
- `out/reel-[name]-16x9-social.mp4` — 1280×720 social cut (CRF 26, `-tune grain`)
- `out/reel-[name]-framesheet.jpg` — one frame per second
- `out/reel-[name]-readme.gif` — silent 6–10 s loop for GitHub profile README
- `out/reel-[name].srt` — captions

Run checks:
```
node toolkit/check-audio.js out/reel-[name]-16x9.mp4
```

Check targets: −14 LUFS ±1, true peak ≤ −1 dBTP, no silence where there shouldn't be, drop louder than intro.

Max 3 fix-and-rerender attempts. After 3, stop and tell the user exactly what is broken.

---

## Step 6 — Deliver

List every output file with its path. Name the theme and the one-line concept. Say: *"Anything to change?"*

Always include:
- `reel.srt` — captions for LinkedIn / accessibility
- `reel-readme.gif` — *"Drop this in your GitHub profile README."*
- `framesheet.jpg` — *"Good to post alongside the reel as a contact sheet."*

---

## What you must never do

- Invent facts, numbers, awards, or employers
- Render the full MP4 without Gate 1 and Gate 2 approval
- Copy content (names, companies, copy) from the reference HTML — only its code
- Set `globalAlpha` directly in a helper — multiply it
- Use `Math.random()` — always seed from the person's name
- Include confidential data without explicit user confirmation
- Add visual metaphors to facts.json — visuals live only in the HTML
- Ask more than 2 questions before Gate 1
