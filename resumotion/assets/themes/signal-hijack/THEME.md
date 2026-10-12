# THEME: Signal Hijack

> **The person takes over the airwaves.**
> A pirate broadcast hijacks a dead TV channel. The test pattern gets taken over by the person's colour and turns into something that is theirs. From then on, each part of their career is its own channel in its own TV format, and every cut is a channel flip of static on the beat. It ends with an old CRT switching off to a single dot, one beat of silence, and a boom into their sign-off.

**Status:** ✅ ready. reference.html committed from the NP·TV build.

**The one rule of this theme:** the TV world is the same for everyone, but **what's on the channels never is**. The colour, channel name, lineup, TV formats, gags, thesis words, bespoke moment, jingle and sign-off all come from this person's resume. Two people in this theme should share only the frame, never the show.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| Anyone with 3+ distinct things to show (projects, roles, wins), in any field | People who want calm or premium (use Prospectus) |
| People who ask for "fun", "crazy", "loud", "chaotic", "playful" | Very thin resumes; the channel surf needs 3+ channels |
| Builders, designers, marketers, researchers, students, creators, organisers | Careers best told as one long arc (use General's timeline) |
| People whose work items are very different from each other | Anyone uncomfortable with glitch and flashing (offer a calm cut or another theme) |

Tone: a loud, playful, late-night pirate broadcast. Every fact on screen is plain and true; the jokes live in the TV formats, never in the facts.

The TV world is the **stage**, not the person's field. Never label someone as a broadcast or telecom person because of this theme, and don't put their degree field on screen unless they want it.

---

## 2. Palette: generated from any colour

There is no default colour. Ask for the person's accent (hex, a colour name, or "use my site's colour"). If they don't care, pick one from their world (their site, logo, a project's brand, a colour named in their resume). Then **generate** every other colour from it.

### 2.1 Derivation recipe

Convert the accent to HSL `(h, s, l)`. Clamp first:
- If `l < 30`, raise to 38 for slabs (keep the original for shadows).
- If `l > 70`, lower to 62 for slabs (keep the original for tints).
- If `s < 15` (grey, black, white, silver), use the **Monochrome** edition (§2.3).

| Token | Late Night edition (default) | Daytime edition | Use |
|---|---|---|---|
| `bg` | `hsl(h, 12%, 4%)` | `hsl(h, 30%, 95%)` | Background |
| `bg2` | `hsl(h, 10%, 8%)` | `hsl(h, 20%, 88%)` | Panels, inactive cells |
| `ink` | `hsl(h, 25%, 94%)` | `hsl(h, 25%, 8%)` | Headlines, name, values |
| `dim` | `hsl(h, 8%, 63%)` | `hsl(h, 8%, 38%)` | Captions, keys, "demo" labels |
| `accent` | the clamped accent | the clamped accent | Slabs, labels, bars, ON AIR |
| `accentL` | `l + 15` | `l − 8` | Links, meter fills |
| `accentD` | `l × 0.6` | `l × 0.75` | Borders, studio rings, dim LEDs |
| `accentX` | `l × 0.3` | `l × 0.45` | Deepest shade, shadows |
| `tint` | `hsl(h, 70%, 88%)` | `hsl(h, 60%, 30%)` | Small labels on `bg` |
| `plate` | `ink` | `hsl(h, 10%, 99%)` | Lower-third plates, cards |
| `onAccent` | `#FFFFFF` or `bg` | `#FFFFFF` or `ink` | Text on accent shapes |

**`onAccent` rule:** use white if white-on-accent contrast ≥ 4.5:1, otherwise use the dark token. Yellow, lime, cyan, mint and peach accents almost always need dark text on their slabs.

### 2.2 Contrast check (run before building)

Compute WCAG contrast for each pair. Every pair must be ≥ 4.5:1. If one fails, nudge `l` by 5 and recheck:
`ink/bg` · `tint/bg` · `onAccent/accent` · `bg/plate` · `accentD/plate` (lower-third sub-line) · `dim/bg`.

Log the final palette in the reel's mini THEME.md.

### 2.3 Editions

| Edition | When | Look |
|---|---|---|
| **Late Night** | Default; most accents | Black studio, the accent glows |
| **Daytime** | Person asks for light, or their brand is light and airy | Cream studio, accent slabs, dark ink |
| **Monochrome** | Grey, black or white accent, or "keep it minimal" | Black + white only; `accent` = ink, slabs are white with black text, the test card turns to greyscale instead of a hue |
| **Two-tone** | Brand has 2 colours and they insist | Second colour appears **only** in the hijacked test card and confetti, never in UI |

### 2.4 Colour rules
- The **only** multicolour moment is the opening test pattern: classic colour bars, slightly desaturated so the hijack pops. After the hijack, it's one hue plus `bg`, `ink` and `plate`.
- The hijack turns the 7 bars into a 7-step ramp of the accent: `plate → tint → accentL → accent → (accent − 8 l) → accentD → accentX`.
- The accent is for big shapes and large type. Small text uses `ink` or `tint`.

---

## 3. Typography

Default set (works for most people):

| Role | Font | Size |
|---|---|---|
| Headlines, name, channel words, stats, stamps | **Bungee** 400 | 40–250 px |
| One marquee moment (e.g. game show title) | **Bungee Shade** 400 | 100–130 px |
| OSD numbers, subs, data, chips, ticker, code, emails | **JetBrains Mono** 400/700/800 | 20–96 px |

Swap the display face to fit the person (variation knob):

| Vibe | Display | Body |
|---|---|---|
| Default loud | Bungee | JetBrains Mono |
| Retro arcade | Rubik Mono One | Space Mono |
| Hand-made, creative | Bowlby One / Lilita One | DM Mono |
| Sharp, techy | Archivo Black | IBM Plex Mono |

- Max 2 families plus one marquee face. All OFL, from `@fontsource`, embedded as base64 `FontFace`.
- All-caps display faces have no lowercase: put `O(n²)`, passwords, emails and URLs in the mono at 800.
- Check every symbol you use (`→ ✓ ✦ ² ’`) in stills. Some mono Latin subsets lack them; use `->` or swap the glyph.
- Fit-to-width every display line.

---

## 4. Layout & persistent chrome

- 1920×1080, 30 fps. 120 px left margin for lower thirds and OSD; 5% safe area everywhere.
- **Channel bug** (top right, from the name scene until the switch-off): the person's **channel name** (§10.1) in the display face at 40 px + a blinking accent "live" dot (2.5 Hz). Switch it to `bg` colour on any light scene.
- **OSD channel number** (top left, first ~6 beats of each channel): `CH 02` in mono 800 92 px, `ink` with a 5 px accent drop shadow, the format name under it in `tint`. Flickers on one frame in nine. Channel numbers come from the person (§10.2), not 01/02/03 by default.
- **Lower third:** accent label tab (`CH 02 · WHAT IT IS`, mono 700 24, `onAccent`), then a `plate` with the title (display face, fit ≤ 1560 px) and a mono sub-line in `accentD`. Tab wipes first; plate wipes 0.2 beat later; text appears once the plate is 60% open.
- **News ticker** (hero scene only): 96 px `plate` band, accent block with the channel name, the person's **real** outcomes scrolling at 220 px/s.
- **Texture:** scanlines (2 px every 4 px, 16% black), radial vignette to 62% black (Daytime: 25%), grain 5%. Static is 320×180 seeded LCG noise, scaled up with smoothing off.
- **Cut carrier:** every scene cut is a **channel flip**: 0.15 s of full-screen static on the beat with a noise sweep and blip. Never crossfade.

---

## 5. Motion language

- **Slams:** easeOutBack (overshoot 2.2), scale 0 → 1 in ~0.7 beat. Channel words, stats, stamps, chips.
- **Slabs and plates:** clip wipes from the left, expo-out.
- **Stamps:** stroked rounded rect + display text, rotated ±0.06–0.12 rad, scale 2.2 → 1 expo-out.
- **Typing:** ~10–20 chars per beat with a blinking `|`.
- **Impacts:** shake `Σ v·e^(−9d)·18 px` + chroma ghost (screen-blend copies offset ±ca) on big hits.
- **Glitch slices:** 10 strips shifted up to ±110 px for 0.12 s. Only on the hijack hit, test-card flips, name slam, hero bottleneck, the hero gag, and the finale.
- **Jitter:** only the hijack card and the bottleneck alert shake every frame (seeded).
- Studio rings, signal rings and blinking LEDs keep every frame alive.
- **Feel → speed:** playful ×1.0 · fast/chaotic ×1.15 (shorter holds, more flips) · chill ×0.85 (longer holds, fewer glitches).

---

## 6. Sound design

### 6.1 Tempo and key come from the person

| Feel | BPM | Key (major for the reel; relative minor for the hero problem) |
|---|---|---|
| Chill, warm | 118–128 | F or G major |
| Playful, fun (default) | 140–150 | D or E major |
| Fast, crazy, chaotic | 156–170 | A or E major, more 16th fills |

Pick the key from the list by the seed (§10), so two playful reels don't share a key by default.

### 6.2 The channel ident (unique per person)
A 4-note sting that plays on the name slam, quietly on each channel flip, and in full at STAY TUNED. Build it from the person's initials: map each letter to a scale degree (`(charCode − 65) mod 7`), add the root as the last note. Two people with different initials get different jingles.

### 6.3 Groove (from the name)
Four-on-the-floor sine kick (160 → 42 Hz) side-chaining the music bus (0.42 → 1 over 0.2 s), clap on 2 & 4, 16th hats with off-beat opens, off-beat 8th saw bass through a lowpass, detuned saw stabs on a syncopated pattern, square 16th arpeggio in high-energy sections. Progression: I – vi – IV – V; the hero problem uses vi – IV – ii – III.

### 6.4 SFX map

| Event | Sound |
|---|---|
| Channel flip | band-passed noise sweep 800 → 6000 Hz + square blip + soft ident |
| Opening | pure 1 kHz test tone under PLEASE STAND BY, cut by the hijack hit |
| BREAKING NEWS | three minor brass stabs with sub bass |
| Problem builds | blips rising a minor third each time |
| Bottleneck alert | impact + two-tone siren 880/660 Hz, tom fill into the fix |
| Hero gag (§8.2) | matches the gag: music cut for SIGNAL LOST, 1 kHz bleep for CENSORED, stutter loop for BUFFERING, detuned wobble for INTERFERENCE |
| Format sounds | from the format's row in §8.1 |
| Typing | short random-pitch square ticks |
| Stats / reveals | sine 120 → 32 Hz + filtered noise |
| CRT switch-off | sine 420 → 40 Hz + fading 7.4 kHz whine |
| Before the finale | **one beat of true silence**: whole bus cut ≤ 20 ms, reverb too |
| Finale | biggest impact + crash + full chord + full ident |

Master compressor −16 dB 4:1. Normalise the final mix to **−14 LUFS, true peak ≤ −1 dBTP** (the raw score lands near −18 LUFS, so plan a gain + limiter pass).

---

## 7. Structure (beat map)

Length comes from content: thin resume ~40 s, rich resume ~60 s. Never pad. Beat counts below are for ~150 BPM; scale them to the chosen tempo.

| Scene | Beats | What happens |
|---|---|---|
| Cold open | 0–10 | Frame 1: test card, `CH 00`, PLEASE STAND BY, test tone. By 1 s: glitch hit → **THIS CHANNEL HAS BEEN / HIJACKED.** (or a variant, §10.4). Bars flip to the accent ramp one per half-beat → the **bespoke transformation** (§10.3). |
| Name | 10–22 | Drop. The name arrives *out of* the transformation. Role types in, 2 chips (current role / school or company), ON AIR lights, ident plays, channel bug appears. |
| Thesis | 22–32 | **ONE SIGNAL.** → **EVERY CHANNEL.** Then 2–3 rapid flips, one word each, earned by their real work (§10.5), each with its own mini-graphic. |
| Hero channel | 32–72 | Their hardest problem as **BREAKING NEWS**: real problem → bottleneck alert → fix → their hero gag (§8.2) → 1–2 extra wins. Ticker runs throughout. |
| Channels 2–4 | 16 beats each | One per strong project, each in a **different** format chosen from §8.1. |
| Wins | ~12 beats | Format depends on what the wins are (§8.1). Skip if < 2 wins. |
| Skills | ~8 beats | TONIGHT'S LINEUP TV guide. Max 4 categories. |
| Outro | ~16 beats | CRT switch-off → 1 beat of silence on a glowing dot → boom → **their sign-off** → contact → "open to" chip → the accent test card returns with **STAY TUNED.** + name. Credit small, bottom right. |

Scale: 2 projects → 1 channel less; no internship → the strongest project becomes the hero; no wins → drop that scene; no skills section on the resume → drop the lineup.

---

## 8. Content → visual mapping

### 8.1 TV format library

Pick a format for each item by **what the work is**, not by order. Never use one format twice in a reel. ✅ = built and tested, 🟡 = designed, not yet built (run stills after it).

| Their work | TV format | Signature visuals | Signature sound | |
|---|---|---|---|---|
| Main role / internship / biggest story | **BREAKING NEWS** | slab, newsroom lower third, live panel, ALERT, ticker | brass stabs, siren | ✅ |
| Computer vision, robotics, hardware, sensors | **CAM LIVE** | dashcam / CCTV feed, REC, detection boxes, head checklist, fused meter | soft lock blips | ✅ |
| Security, passwords, puzzles, quizzes, games | **GAME SHOW** | marquee bulbs, marquee title, weak answer → X, right answer → stamp + confetti | buzzer, bell, crowd | ✅ |
| Travel, maps, logistics, agents debating, supply chain | **WEATHER / TRAVEL FORECAST** | landmasses, dotted arcs, speech bubbles, icon stat tiles | airport ding-dong | ✅ |
| Hackathons, competitions, rankings | **SPORTS DESK** | split-flap scoreboard, rank cells settle | whistle, crowd, flap clicks | ✅ |
| Skills | **TONIGHT'S LINEUP** | TV-guide grid with time slots | soft blips | ✅ |
| Data, analytics, dashboards, finance, forecasting | **ELECTION NIGHT** | racing bars, map tiles filling, "PROJECTED" stamp | tension pad + reveal hits | 🟡 |
| Process, tutorials, recipes, pipelines, DevOps | **COOKING SHOW** | ingredient cards, bowl, "into the oven" timer, finished dish = result | kitchen timer ding, sizzle noise | 🟡 |
| Research, experiments, papers, biology | **NATURE DOCUMENTARY** | slow pan, field-notes captions, specimen labels, observation counter | wind, soft strings | 🟡 |
| Products, sales, marketing, growth, e-commerce | **SHOPPING CHANNEL** | "CALL NOW" panel, price-drop style metric card (real metric only), stock counter | upbeat jingle, cash ching | 🟡 |
| Leadership, community, events, teaching, people work | **TALK SHOW** | couch set, guest name card, audience applause meter, quote card | applause, band sting | 🟡 |
| Music, content, writing, social, creators | **MUSIC COUNTDOWN** | chart positions climbing, "NEW ENTRY" badge, play counts (real only) | DJ riser, airhorn-ish stab | 🟡 |
| UX / redesign / refactors / migrations | **HOME MAKEOVER** | before/after wipe, "REVEAL" curtain | drumroll + gasp | 🟡 |
| Deploys, launches, releases, startups | **LAUNCH COUNTDOWN** | mission control, T-minus counter, rocket = release | countdown beeps, rumble | 🟡 |
| Law, policy, compliance, debate | **COURTROOM TV** | bench, exhibit cards, gavel, "VERDICT" stamp | gavel hit | 🟡 |
| Health, fitness, wellbeing projects | **WORKOUT INFOMERCIAL** | reps counter, before/after metric bars | whistle, upbeat synth | 🟡 |

Need a format that isn't here? Invent one that fits their work, then add it to this table.

### 8.2 Hero gag library

Choose the gag that matches **what the hero work actually fixed**. Don't default to the first row.

| What they fixed | Gag | On screen |
|---|---|---|
| Resumability, recovery, fault tolerance, caching | **SIGNAL LOST** | progress at stage N → full static, music cut → "RESUMED AT STAGE N, not from zero" |
| Security, privacy, data exposure | **CENSORED** | censor bar slams over a demo row + bleep → "FIXED" stamp |
| Latency, speed, performance | **BUFFERING** | spinner + stutter loop → their real speed-up number slams in |
| Data quality, noise, accuracy | **INTERFERENCE** | picture wobbles and tears → clean signal locks in + real accuracy figure |
| Downtime, reliability, uptime | **OFF AIR** | "OFF AIR" card → "BACK ON AIR" + real uptime fact |
| Duplication, repeated work, redundancy | **RERUNS** | the same clip repeats with a "REPEAT" tag → fix → "NEW EPISODE" |
| Complexity, algorithm fix | **O(old) → O(new)** | big complexity slashed, new one slams in |
| Scale, users, traffic | **RATINGS SPIKE** | viewer counter jumps to their real user number |

### 8.3 Other mappings

| Content | Visual |
|---|---|
| Name, role, school | The bespoke transformation (§10.3) → name, chips, ON AIR |
| Search / matching / ranking | Live search box types a typo; ranked results with real computed scores, labelled `demo data` |
| Contact | Post-switch-off end card: sign-off, email, site, "open to" chip |
| Mascot / avatar (user-supplied) | "SPECIAL GUEST" lower third; never redraw or recolour the image |
| Logos (user-supplied) | Tinted to one colour (`ink`) on lower thirds |

---

## 9. Honesty rules (strict)

- Every stat comes from the resume, with its own qualifiers (`~35%`, "vs sync").
- Demo inputs (passwords, search queries, data rows, speech bubbles) are labelled `demo` or `demo data`.
- Scores in demos are actually computed (e.g. real string-similarity values), never invented.
- Formats like SHOPPING CHANNEL, MUSIC COUNTDOWN and RATINGS SPIKE show **only real numbers**; no fake prices, play counts or viewers.
- No real logos (unless supplied), broadcaster names, idents or show names. The channel is always the person's own.
- Meters and progress bars are visual only; no made-up percentages on them.

---

## 10. Make it theirs (mandatory)

Before writing `script.md`, fill in this table in the reel's mini THEME.md. Every row must come from the resume or the person's answers. If a row would be identical to the reference build, change it.

| Knob | Derived from | Example derivations |
|---|---|---|
| **Accent + edition** | Their colour, site, brand or feel | `#2F80ED` Late Night; `#F2C94C` Daytime with dark slab text |
| **Channel name** (§10.1) | Initials, handle, pen name, project name | `AK·TV`, `@byteboss LIVE`, `CHANNEL RIYA` |
| **Channel numbers** (§10.2) | Meaningful numbers from their life | grad year (`CH 27`), first project's year, team size, hackathon count |
| **Bespoke transformation** (§10.3) | Their strongest visual idea | see below |
| **Opening line** (§10.4) | Their voice | see below |
| **Thesis words** (§10.5) | What their real projects do | `DESIGN. BUILD. SHIP.` / `TEACH. LEAD. GROW.` |
| **Lineup** | Their projects → §8.1 formats | 2–4 channels, all different formats |
| **Hero gag** | What their hero work fixed → §8.2 | BUFFERING for a latency win |
| **Wins format** | What the wins are | SPORTS DESK for hackathons, MUSIC COUNTDOWN for rankings, TALK SHOW for awards |
| **Tempo / key** | Feel (§6.1) + seed | 128 BPM F major for "chill" |
| **Ident jingle** | Initials (§6.2) | 4 notes from their letters |
| **Display font** | Vibe (§3) | Rubik Mono One for a gamer |
| **Ticker lines** | Their real outcomes + one fun fact | their numbers, their words |
| **Sign-off** | Their catchphrase, site CTA, or a line they give | "Let's build something." / "See you on set." |
| **Seed** | Name hash | grain, jitter, glitch timing, key pick |

### 10.1 Channel name
Ask, or derive: handle > pen name > initials + `·TV`. It appears in the bug, the ticker block and STAY TUNED.

### 10.2 Channel numbers
Don't count 01, 02, 03 by default. Use numbers that mean something: their grad year, the year a project shipped, a rank they won (`CH 05` for Top 5). If nothing fits, start from the last two digits of their grad year and count up. Never use birthdays or other personal data.

### 10.3 The bespoke transformation (the moment nobody else gets)
The hijacked test card must turn into something from **this** person's resume. Pick one, or invent one:

| If they have… | The test card becomes… |
|---|---|
| Nothing visual stands out (default) | Bars squash into stripes; stripes slide together into the name |
| A headline number (users, %, rank) | Bars become a bar chart that climbs to their number |
| A mascot or logo (supplied) | The test-card circle becomes their mascot's frame |
| Design / art work | Bars become paint swatches that print the name like a screen-print |
| Data / ML work | Bars become a histogram that resolves into the name's letters |
| Hardware / circuits | Bars become PCB traces routing into the name |
| Music / audio | Bars become an equaliser bouncing to the drop, spelling the name |
| Writing / content | Bars become pages that flip into the name in print |

If two reels use the default, change something about it (direction, the number of stripes, what the stripes carry).

### 10.4 Opening line
Default: **THIS CHANNEL HAS BEEN / HIJACKED.** Variants: `WE INTERRUPT THIS PROGRAMME` · `UNAUTHORISED BROADCAST` · `YOU ARE NOW WATCHING [CHANNEL]` · a line in their own voice. It must be on screen by 1.0 s.

### 10.5 Thesis words
Three words with full stops, each earned by a real channel in this reel. Each word gets its own background and mini-graphic drawn from that project's world.

### 10.6 Sameness check
After `script.md`, compare with the reference build and any other reel in this theme. If more than **30%** of these match — formats used, format order, hero gag, transformation, thesis words, opening line, sign-off, key — rewrite until they don't. The frame (test card, flips, bug, switch-off, STAY TUNED) is allowed to match; the content isn't.

---

## 11. Questions to ask (theme-specific)

Ask only what the resume doesn't already answer. Max 6 in total across the whole session.

1. Accent colour? (hex, name, or "use my site's colour")
2. Light or dark studio? (default: dark)
3. Channel name or handle? (default: initials + `·TV`)
4. Which experience is the breaking news, and what was the real bottleneck?
5. Your sign-off line, and what you're open to?
6. Anything to keep off screen (major, CGPA, a company name)?

---

## 12. Personalisation add-ons

Their own channel name · catchphrase as the finale · a fun fact on the ticker · mascot as a SPECIAL GUEST segment · supplied logos tinted on lower thirds · 9:16 cut (stacked lower thirds, full-height channel words) · README GIF loop (test card hijacked → name → one flip → STAY TUNED) · a calm cut with no glitch for people sensitive to flashing.

---

## 13. Don'ts

- No crossfades. Every cut is a channel flip.
- No second UI colour. Only the opening test card (and Two-tone confetti) breaks the one-accent rule.
- Never hard-code any colour. Every colour comes from §2.1.
- Never reuse a format twice in one reel, or copy another reel's lineup, gag or transformation.
- No glitch or jitter outside §5's list. Max 3 full-screen flashes per second.
- Confetti and static must be gone before contact details appear.
- Don't label the person by their degree field because of the TV stage.
- Don't let the OSD overlap a scene title; keep titles at y ≥ 300 while the OSD shows.
- Don't invent numbers to make a format funnier.

---

## 14. Build contract

- One self-contained HTML: fonts base64-embedded via `FontFace`, canvas 1920×1080.
- Palette is computed **in code** from one `ACCENT` constant + `EDITION` (§2.1), with the contrast check from §2.2 logged to console.
- `window.__render(t)` is a pure function of t. Seeded hash (`hs`, seeded from the name) and seeded LCG noise only. No `Math.random`, `Date.now` or timers.
- `window.__audio()` → OfflineAudioContext at 48 kHz → base64 WAV; live player uses the same `score()`. BPM, key and ident come from the facts.
- `window.__ready` awaits every `FontFace` and `document.fonts.load()` per family/weight.
- Text helpers multiply `globalAlpha`. Chrome (bug, flips, gag overlays) draws after the scene.
- Scenes use a local beat (`lb = b − sceneStart`) so the beat map can be reshuffled per person.
- The CRT switch-off draws the previous scene's last frame offscreen, then squashes it.
- Render in chunks. Static and grain make files big: plan a **two-pass social encode at ~3.5 Mbps** to stay under 30 MB for ~60 s.

---

## 15. Theme quality check

- [ ] Palette generated from the person's accent; every contrast pair ≥ 4.5:1.
- [ ] §10 table filled in; sameness check ≤ 30% against the reference.
- [ ] Frame 1 is the test card; the last frame is the accent test card with STAY TUNED.
- [ ] Hook on screen by 1.0 s.
- [ ] The bespoke transformation is theirs and leads into the name.
- [ ] Every cut is a channel flip on the beat, with its sound.
- [ ] Every channel uses a different format; each format matches the work.
- [ ] The hero gag matches what they actually fixed.
- [ ] One beat of true digital silence before the finale.
- [ ] All demo content labelled; all scores computed; no invented numbers.
- [ ] Bug readable on light scenes; OSD never overlaps titles; no text overflow.
- [ ] Final mix at −14 LUFS, true peak ≤ −1 dBTP; social file < 30 MB.