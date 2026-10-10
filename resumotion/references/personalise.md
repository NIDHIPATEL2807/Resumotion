# Personalization Menu — Claude Reference

Claude reads this during the DISCOVER step. Ask only what you don't already have from the resume. Never ask all of these at once — max 2 questions on top of the universal ones.

---

## Universal (ask for every theme, max 2 questions)

### Feel
"One word for how you want this to feel?"
→ `calm` / `fast` / `precise` / `bold` / `playful`
→ Maps to: transition speed multiplier, music energy, text density

| Word | Effect |
|---|---|
| calm | slower transitions (×0.8), more negative space, softer music |
| fast | tighter cuts (×1.2), less stagger, higher energy music arrangement |
| precise | tighter letter-spacing, more monospace, smaller grain |
| bold | bigger type, harder cuts, louder impacts |
| playful | more bounce easing, wider staggers, brighter accent |

### Accent color
"Any brand color or accent color you love? (hex, name, or just describe it)"
→ Overrides theme's default accent. Foreground/background stay as theme default.
→ If no: use theme's approved palette (see each THEME.md).
→ Auto-check contrast ratio ≥ 4.5:1 against background. If fails, find closest valid shade.

---

## Identity

### Mascot / character
"Want to use the dino mascot, or do you have your own character image to attach?"
- User attaches PNG → use it throughout (opener, outro). Scale to ~280px height, preserve transparency.
- User says dino → use default dino
- User says no mascot → skip mascot entirely, use clean boot sequence / title card

### Nickname / handle
"Do you have a nickname, handle, or a name you go by professionally?"
→ Used in: boot text (`loading [nickname].nino`), detector label, title screen
→ If none: use first name lowercased

### Persona image / headshot
"Want to include a photo? Attach it and I'll add it to your name scene."
- Only use if user attaches — never source from the web
- Auto-fit to a circle or square crop depending on the theme
- Tint slightly toward accent for integration

### Logo
"Want to include a logo? Attach it (transparent PNG works best)."
- Only use user-supplied logos — never fetch from the web
- Auto-tint to accent color so it integrates with palette
- Shown in: name scene (top-right corner) and outro

---

## Copy and content

### Density
Default: `punchy` — ≤6 words per beat group, verbs over adjectives, numbers when real.
If user asks for more detail: `detailed` — up to ~12 words per beat group.
Never ask unless user seems to want more text.

### Tagline
"Do you have a tagline or a one-liner you use for yourself?"
→ Shown below name in name slam scene, or as the thesis opener
→ If none: Claude writes one from facts.json

### "Open to" roles
"What kind of roles or companies are you targeting? (shows in the outro)"
→ Used in outro CTA: `open to [X] roles`
→ If not provided: use generic `Let's build something.`

### Languages spoken
"Any non-English languages you want to include?"
→ Used in script-cycle visual or stack flash
→ If name is non-Latin, Claude automatically handles correct font family

### Signature / closing
"How do you want to sign off?" (e.g. `Let's build.` / `Available now.` / `Find me at:`)
→ Outro CTA text. Keep ≤6 words.

---

## Format

### Aspect ratio
Default: `16:9`
If user asks: `9:16` (vertical, for Instagram/TikTok Reels — only available once 9:16 layouts are built)

### Length
Scales automatically with content:
- Thin resume (1–2 projects, no wins) → ~30s
- Standard (3–4 projects, some wins) → ~40s
- Rich (5+ projects, wins, strong case study) → ~50s

User can request: "keep it under [X] seconds" → Claude trims lowest-priority scenes first, always asks before cutting anything the user seemed proud of.

### Motion level
"Anything about the motion style you want to change?" (only ask if they seem unsure)
→ `safe` — disables flash effects, reduces jitter, slower transitions (accessibility)
→ `standard` — default
→ `intense` — faster cuts, more glitch, higher grain

### Sound mood
"Any preference on the music vibe?"
→ `energetic` — faster BPM, harder hitting drops
→ `restrained` — softer, more minimal, less bass
→ `ambient` — pads only, no percussion (good for finance/academic themes)
→ Default: theme's designed arrangement

---

## Links and contact

### Email
"What email should I show in the outro?" → from resume if present, or ask
→ If none and user doesn't want to share: show just the name + CTA, no contact

### Portfolio / site
"Portfolio URL to include?" → shown in outro in monospace
→ Keep under 40 characters visible. Long URLs → use a short form

### GitHub / LinkedIn
"GitHub or LinkedIn handle to include?" → shown as small text in outro
→ Format: `github.com/[handle]` — never raw URLs

### QR code
Only add if user explicitly asks: "Want a QR code linking to your portfolio?"
→ Generate from URL, place bottom-right of outro frame
→ Never add by default — it looks cluttered

---

## Visual add-ons

### Palette variants
If user has brand colors → use as accent, rest stays theme default.
If no brand colors → Claude picks from 3 approved options in each THEME.md.
Never mix more than 3 colors actively on screen at once.

### Captions / subtitles
"Want a subtitles file (SRT) for accessibility?"
→ `toolkit/export-captions.js` generates `reel.srt` from the screenplay
→ Always offer this — don't ask, just include it in the deliverables

### README loop GIF
Always generate this — don't ask. `toolkit/export-readme.js` produces `out/reel-readme.gif`.
Mention it in the delivery: "also included: a silent GIF loop for your GitHub profile README."

### Frame sheet / contact sheet
Always generate this — don't ask. One frame per second, tiled.
"Also included: a frame sheet — good to post alongside the reel."

---

## Per-theme add-ons

See each `themes/[name]/THEME.md` for theme-specific personalization.

| Theme | Unique add-ons |
|---|---|
| `perception` | Mascot/dino in opener detector box, model nickname in boot text, Indic font support |
| `speedrun` | Custom dino name, personal-best time to beat, per-project level names |
| `growth_chart` | Deal/project label, firm logo, "case study" disclaimer for academic deals |
| `swiss_grid` | Design philosophy tagline, portfolio as hero element, grid density |
| `campus` | Target role/company, hero hackathon/project, "available from [date]" |
| `general` | Plain-English description of work, one visual object representing their field |

---

## What to do with the answers

- Write all confirmed facts and preferences into `facts.json` under the relevant fields
- Never apply a preference that contradicts something the user already said
- If user gives conflicting answers (e.g. "calm" + "make it intense"), ask once to clarify
- Personalization choices made during Gate 1 review are frozen along with the script
- Any post-approval change requires explicit user confirmation: "This changes [X scene] — shall I update it?"
