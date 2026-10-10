# Question Bank

Ask only what the resume doesn't already answer. Max ≤ 6 questions total per session.
Tagged: **always** (ask every time) · **if** (ask only when triggered) · **theme** (from THEME.md §11).

Defaults — state these, never ask: CGPA off · phone off · QR off · home address off.

---

## Always ask (up to 2 of these)

| # | Question | Why it matters |
|---|---|---|
| A1 | *"One word for how you want this to feel?"* Options: calm / fast / precise / bold / playful | Maps to transition speed (×0.8–1.2), music energy, type density |
| A2 | *"Any brand colour or accent colour you love? Hex, name, or just describe it."* | Overrides theme's default accent. Auto-check contrast ≥ 4.5:1 against background. |

If the resume already makes these obvious (a design portfolio with a strong brand → accent is clear; a speedrun-style resume → feel is fast), skip the relevant question.

---

## If-triggered questions

| Trigger | Question | Notes |
|---|---|---|
| Resume mentions a mascot, avatar, or character | *"Does your mascot have a name? Want to use your own image or a generated one?"* | PNG with transparent bg, ≥ 800 px. Never recolour or redraw the image. |
| No photo but a personal brand is clear | *"Want to include a headshot or photo?"* | Circle crop. Only use if they supply it. |
| Resume has a strong online identity (handle, YouTube, newsletter) | *"What's your handle or pen name — the thing people know you by online?"* | Used in: boot text, detector label, ticker, title screen |
| Resume is in a language other than English, or person's name suggests an Indic script | *"Do you want your name or any text in [script]?"* | One font family per script. Never bundle multiple scripts under one family. |
| Finance/IB/MBA resume | *"What would your ticker symbol be?"* (2–4 letters) | Used in: trading terminal HUD, IPO filing bar |
| Hackathon-heavy resume | *"Which of these hackathons/wins should be the trophies, and which is the trophy you're most proud of?"* | Clarifies order and emphasis; avoids miscounting |
| Resume lists confidential clients/teams | *"I noticed [X] — OK to show on screen, or should I use a generic description?"* | Ask once per item. Wait for answer. Log in `confidential_note`. |
| Resume shows multiple possible hero stories | *"Which experience was hardest or most impactful? That becomes the centrepiece."* | Prevents Claude from choosing wrongly |

---

## Theme-specific questions (from THEME.md §11)

| Theme | Question |
|---|---|
| `perception` | *"Do you have a nickname or handle for your work?"* (boot text, detector label) |
| `speedrun` | *"What's your mascot's name?"* · *"Which experience is the boss fight, and what was the wall you hit?"* |
| `ipo-day` | *"What would your ticker symbol be?"* · *"Which experience is the listing, and what was the deal?"* |
| `prospectus` | *"Which deal or case study should be the tombstone?"* |
| `blueprint` | Auto-detected from resume — check which engineering discipline (VLSI, mechanical, civil, embedded, aero) and confirm: *"Is [VLSI / chip design] the right framing for the main section?"* |
| `context_window` | *"What should the tool calls be named after? (Your real project names or your own function names?)"* |
| `general` | *"What's the one thing you'd want someone to remember after watching this?"* (Becomes the thesis card.) |

---

## After all questions

State confirmed defaults before building:
> *"Confirmed: CGPA off, phone off, QR off. Feel: [X]. Accent: [hex or 'theme default']. [Any other confirms]."*

Then write `script.md` — Gate 1.

---

## What never to ask

- Font preferences (you decide)
- Number of scenes (beat map comes from content)
- Duration (you decide — never pad)
- Music genre or style (you decide from BPM + key)
- Layout or visual design choices (your job)
- More than 6 questions total, even if curious
