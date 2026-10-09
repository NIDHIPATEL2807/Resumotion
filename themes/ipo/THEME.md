# THEME: IPO Day

> **The person is going public.**
> The whole reel is their listing day on a trading terminal: a prospectus drops, analysts initiate coverage, deals print, earnings beats send the price ripping, trading halts, and at exactly **09:15:00** the opening bell rings: **"$TICKER IS NOW LISTED."**

Reference build: `reference.html`. Read it before writing; copy its primitives and values, not its content.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| Finance, investment banking, equity research, consulting, corporate strategy, MBA | People who want calm / premium (use Prospectus) |
| Founders, product and business people, case-competition winners | Pure engineering profiles with no business angle (use Perception) |
| Anyone with lots of competitions, wins or numbers | Very thin resumes (the terminal needs data to feel alive) |

Tone: high-adrenaline, dense, alive, but numerically honest. A markets-open intro.

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `bg` | `#06080B` | Background |
| `panel` | `#0C0F14` | Panel fill |
| `amber` | `#FFB000` | Data, labels, terminal text, clock, panel tabs |
| `amberDim` | `#6B4A00` | Panel borders, faint headers |
| `line` | `#2A2110` | Rules, empty bars |
| `green` | `#00D27A` | Up moves, wins, LISTED, ✓, chart line |
| `red` | `#FF3B3B` | BREAKING, HALTED – only for tension beats |
| `white` | `#F2F2F2` | Headlines, values |
| `muted` | `#8A8F98` | Keys, captions |

Green = good news only. Red appears only in BREAKING, DENIED/HALTED. Brand colour (if given) may replace amber.

## 3. Typography

| Role | Font | Size |
|---|---|---|
| Huge headlines (name, $800M, HALTED, LISTED) | Archivo Black | 84–260 px |
| Everything else (data, labels, values, ticker, clock) | JetBrains Mono 400/700 | 14–64 px |

Data labels UPPERCASE with letter-spacing 1.5–3. Values in sentence case. Fit-to-width every Archivo Black line.

## 4. Layout & persistent chrome

- 1920×1080, 30 fps. Panel grid with 48 px outer margin.
- **Panel:** fill `panel`, 1.5 px `amberDim` border, 38 px title bar (`#17110A`) with a 6 px amber tab on the left, title in mono 700 18 px amber, optional tag on the right (muted). Panels open with a clip wipe (width leads, height follows).
- **Top bar** (from the drop until the ending): 58 px, amber 2 px underline:
  - amber ticker sticker `$TICK` · name · role
  - status pill: `PRE-OPEN` (amber) / `HALTED` (red, blinking) / `LISTED` (green)
  - green sparkline of the indicative price
  - live clock `HH:MM:SS IST` + `TO OPEN 00:00:ss` countdown
- **The clock is the spine:** clock time = `09:15:00 − (bell_time − t)`. It reaches exactly **09:15:00 on the bell**. (Use the local market's open time for the person's country; for India, 09:15 IST.)
- **Bottom ticker tape:** 56 px, amber `TICKER` block, then the person's real facts scrolling at 170 px/s; win items in green with ▲.
- **Texture:** CRT scanlines (1 px every 3 px, 16% black), vignette to 55% black, grain 4%.
- **Cut carrier:** at each scene cut, an amber 6 px line sweeps bottom→top with a faint amber wash under it.

## 5. Motion language

- Entrances: masked RISE (expo-out); typed text 40–80 chars/s; counters count up with cubic-out.
- Panels open with clip wipes; rows type in one per ~0.7 beat.
- **Stamps:** `FILLED`, `COVERED`, `✓ COMPUTED` – rotated −0.12 rad, scale 2 → 1 with expo-out.
- **Impacts:** screen shake `Σ v·e^(−8d)·14 px` plus an additive ghost offset on big hits.
- **Glow** only on: terminal command, $ headline, PARABOLIC, HALTED, LISTED (shadowBlur 12–30).
- **Glitch slices** only at the halt.
- **Flips:** quote-board tiles flip in vertically (scaleY) on 16ths.

## 6. Sound design

- **128 BPM, A minor:** Am – F – C – G (4 beats each). Bell section resolves to **C major** (C – F – G – C).
- **Pre-market:** low detuned saw drone (55 Hz), a clock tick every beat, keyboard clicks for every typed char, two-note blips on each "OK", rising stabs + noise riser, alarm on BREAKING.
- **Groove (from the drop):** four-on-the-floor kick, open hat on off-beats, clap on 2 & 4 (from fundamentals), 16th hats, resonant saw+square 8th bass (side-chained), pad, square pluck arpeggio 16ths (from deals).
- **SFX map:**

| Event | Sound |
|---|---|
| Typing / tickers | band-passed noise clicks + low triangle tick |
| Row / panel / OK | two-note square blip |
| Money moment ($ figure, waterfall bar, win) | **cash-register "ching"**: sines 2093/2637/3136 Hz staggered 70 ms + noise sparkle |
| Big reveal ($800M, FILLED, 1st/3rd place) | saw chord stab, filtered |
| Scene cut | whoosh |
| Hard hits (drop, halt, resume, bell) | impact: kick + 50→32 Hz sub + noise |
| Halt | alarm (square 880/660 Hz) ×3; **music cut to zero for 2 beats** |
| One second to open | **1 beat of silence** with 4 quiet clock ticks |
| Opening bell | inharmonic bell struck 3× (partials 1, 2.76, 5.4, 8.93, 0.5) + crowd-noise swell |

- Master compressor −16 dB 4:1; peak-normalise to −1 dBFS.

## 7. Structure (beat map, ~58 s ≈ 124 beats)

| Scene | Beats | What happens |
|---|---|---|
| Pre-market | 0–12 | Frame 1: black terminal header with clock. `TICK <GO>` typed with a block cursor; boot lines print (`CONNECTING TO EXCHANGE … OK`, `LOADING PROSPECTUS … OK`, `ISSUER: …`, `SYMBOL: …`, `STATUS: PRE-MARKET · IPO PRICING TODAY`); "IPO PRICING TODAY" flashes; red BREAKING bar wipes in. |
| Listing | 12–24 | **Drop.** Red BREAKING banner with a one-line headline about them; name slams letter by letter (Archivo Black, scale 2.2 → 1); ticker sticker stamps on; target roles + season; role chips one per beat. Top bar + tape slide in. |
| Fundamentals | 24–36 | Left: COMPANY PROFILE rows (issuer, founded, HQ, core, segments) + 3 stat tiles. Right: ANALYST COVERAGE = certifications, each stamped COVERED. |
| Deals desk | 36–64 | Up to 3 trades, ~9 beats each (see §8). Panel tag `TRADE n / 3`. |
| Earnings season | 64–88 | The big one: indicative price chart + volume; each win = a ▲ BEATS ESTIMATES banner + a jump; "PARABOLIC" → **TRADING HALTED** (amber flash, glitch, alarms, music cut) → RESUMING. |
| Management & holdings | 88–100 | Leadership role as management; number tiles with green bars. |
| Instruments traded | 100–106 | Skills on a 3×4 quote board, flipping in on 16ths, grouped (Finance / Technical / Leadership). |
| The bell | 106–118 | Giant `09:14:59` + one beat of silence → bell → white flash → confetti ticker strips → **`$TICKER IS NOW LISTED`** → goals → INVESTOR RELATIONS panel (email, LinkedIn). Confetti fades before contact appears. |
| Close | 118–124 | Back to the terminal: `TICK <GO>` + `STATUS: LISTED · OPEN TO OFFERS`. Rhymes with frame 1. |

Scale: fewer than 4 wins → shorten earnings to ~16 beats; no leadership → drop holdings; never pad.

## 8. Content → visual mapping

| Content | Visual |
|---|---|
| **Ticker** | Fictional: initials + grad year (`$TICK`). Must not look like a real listed ticker. |
| **Education, minors, clubs** | COMPANY PROFILE: `FOUNDED` = start year, `HQ` = institution, `CORE` = degree, `SEGMENT` = minors / clubs. |
| **Certifications / courses** | ANALYST COVERAGE: issuer in amber + programme name + green COVERED badge. |
| **M&A / deal / case study with $ figures** | BLOCK ORDER ticket: `CASE STUDY` tag, deal name, huge $ figure, what was evaluated; a live **waterfall** (components → total in green), `FILLED` stamp. |
| **Valuation model (DCF, comps)** | MODEL RUN: numbered pipeline steps, each with a progress bar → `OK`, last step `LOCKED` with a green frame. No invented outputs. |
| **LBO / financing / structured work** | STRUCTURED TRADE: debt-vs-equity stacked bars by year (debt shrinking, equity growing) + RETURNS ANALYSIS checklist (`COMPUTED ✓`, `RUN ✓`). |
| **Internship / job** | QUARTERLY RESULTS panel: company logo, role, dates; 3–4 "line items" (what they did) with green ▲ deltas for real outcomes. Or make it a trade if it was deal work. |
| **Generic project** | ORDER TICKET: title, one-liner, 2 key figures, FILLED stamp. |
| **Wins / competitions** | Earnings beats on the chart. Jump size by rank (1st > 3rd > finalist); annotate 1st/3rd on the chart; finalists come fast as smaller ticks. Banner text: `RANK · EVENT · HOST`. |
| **Leadership** | MANAGEMENT & HOLDINGS: title, organisation, dates, one line of scope; number tiles (members, partners, projects, events). |
| **Skills** | INSTRUMENTS TRADED quote board with category label and green ▲ per tile. |
| **Contact** | INVESTOR RELATIONS panel: email, LinkedIn (+ portfolio if given). QR only if asked. |

## 9. Honesty rules (strict)

- The price chart is labelled **"GREY MARKET · INDICATIVE"** and shows **no price numbers, no % moves**. Only real achievements annotate it.
- Case studies and coursework are tagged `CASE STUDY`; never present them as real closed deals.
- Model outputs (share price, IRR) are shown as `LOCKED` / `COMPUTED` unless the person supplies the real figure.
- No real company tickers, no real exchange logos, no imitation of a specific terminal brand's UI or function codes.

## 10. Copy rules

- Banner headline ≤ 8 words, newsroom voice ("Engineer turned analyst files to go public").
- Labels ≤ 3 words, UPPERCASE. Values ≤ 60 characters (FIT them).
- Use market verbs: files, prices, covers, fills, beats, halts, lists.

## 11. Questions to ask (theme-specific)

1. Ticker? (default: initials + grad year)
2. Market/time zone for the opening bell? (default from location)
3. A one-line BREAKING headline about you? (or I'll write one from your story)
4. Any real model outputs you're happy to show (implied price, IRR, synergy $)?
5. Which wins go first (biggest jump)?
6. Target roles and season ("Summer 2027 internships")?
7. Show CGPA? Phone? (default: no)

## 12. Personalisation add-ons

Custom ticker · local market open time · headline in their words · real logos on QUARTERLY RESULTS / trophies · a "dividend" line for a social-impact project · ticker tape with their own fun fact · 9:16 version (stacked panels, chart full width) · README GIF loop (BREAKING → name → chart rip → LISTED).

## 13. Don'ts

- No numbers on the price chart, ever.
- No red except tension beats; no green on non-wins.
- No more than one halt; no glitch outside the halt.
- Don't let confetti sit over contact details.
- Don't overcrowd: max 2 panels on screen at once (plus chrome).

## 14. Build contract

- One self-contained HTML: fonts base64-embedded, images as data URIs, canvas 1920×1080.
- `window.__render(t)` pure function of t; seeded hash randomness only; the clock and chart are computed from t.
- `window.__audio()` → OfflineAudioContext → base64 WAV; live mode uses the same `score()`.
- `await document.fonts.load()` per family/weight before frame 0.
- Text helpers multiply `globalAlpha`. Chrome (top bar, tape) is drawn after scenes.
- Render in chunks → ffmpeg (`-crf 25 -tune grain`) – target < 30 MB for ~60 s.

## 15. Theme quality check

- [ ] Frame 1 = terminal with clock; last frame = terminal with `LISTED`.
- [ ] Clock reads exactly 09:15:00 on the bell frame.
- [ ] Music is fully cut during the halt and the `09:14:59` beat.
- [ ] Every money moment has a ching; every win a jump on its beat.
- [ ] No chart numbers; case studies tagged.
- [ ] No panel text overflow (long certification names, emails).