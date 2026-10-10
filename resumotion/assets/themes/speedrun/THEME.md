# THEME: Speedrun

> **The person's mascot (or avatar) speedruns their career.**
> A bright side-scrolling platformer: every project is a level, the hero experience is a boss fight, wins are trophies, skills are coins. A speedrun timer and a splits panel track the run. It ends on "NEW PB".

Reference build: `reference.html`. Read it before writing; copy its primitives and values, not its content.

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| Students and devs with personality, hackathon people | Very formal targets (banking, law) – use Prospectus |
| Anyone with a mascot, avatar, or strong personal brand | People with no visual identity *and* no wish for a character (offer a simple generated character instead, or pick another theme) |
| X / Instagram / LinkedIn reach posts, launch videos | Recruiter-only submissions where calm reads better |

Tone: joyful, fast, funny, but every fact still readable. Fun on top, competence underneath.

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `sky` / `sky2` | `#8FD3FF` / `#D6F1FF` | Sky gradient top → horizon |
| `hill1/2/3` | `#BFE6FA` `#6CB4E4` `#3E86C2` | Parallax hills, far → near |
| `ground` / `ink` | `#2E2A24` | Road, dark cards, text on light |
| `road` | `#F4EBD9` | Road edge line, paper |
| `coin` | `#FFC53D` | Coins, trophies, gold splits, "?" blocks |
| `accent` | `#FF6B2B` | Kart, personal-best moments, collected chips |
| `mascot` | taken from the mascot image (e.g. `#7FB069`) | Confetti, small accents |
| `red` | `#E5484D` | Boss labels, DENIED, bottleneck |
| `white` | `#FFFFFF` | Paper cards, UI text |

Swap `accent` for the user's brand colour if given. Keep the sky world.

## 3. Typography

| Role | Font | Size |
|---|---|---|
| Big game text (banners, PB, level titles) | Rubik Mono One | 56–170 px |
| Timer, splits, labels, ticker | Silkscreen 400/700 | 18–58 px |
| Sentences, sub-lines, bubbles | Rubik 700/800 | 28–40 px |

Every game headline in UPPERCASE. Fit-to-width all Rubik Mono One text (it's wide).

## 4. World, layout, texture

- 1920×1080, 30 fps. Ground line `GY = 860`. Mascot fixed at screen x `520`; the **world scrolls**.
- **Parallax layers** (speed factor): sun 0.02, clouds 0.08–0.16 (+ slow drift), hills 0.15 / 0.35 / 0.6, trees 0.6, ground + objects 1.0.
- **Paper-cut look:** every card, cloud, hill and object has a soft drop shadow offset 6–10 px down (`rgba(30,25,40,.22)`). Rounded corners 14–30 px.
- **Ground ticker:** on the road surface, a faint scrolling line: `open to: … · <handle> · …`.
- Light grain (alpha 0.045) and a soft cool vignette.

## 5. The run engine (important – this is what makes it sync)

- **Speed curve** `SPEED(beat)` in px/s: cruise 650; boosts 1050; 0 when the mascot stops to talk; smooth ramps in and out.
- Integrate speed into a distance table once (480 samples/s). `D(t)` = distance at time t.
- **Place every world object by beat:** `WX(beat) = D(beat_time) + 520`. An object placed at `WX(58)` will be exactly under the mascot on beat 58. So jumps, coin pickups, block bumps and trophy grabs land precisely on the music.
- Jumps: parabola, height 165–190 px over 0.9 beats, apex on the event beat; squash 12% on landing.

## 6. Characters & UI

- **Mascot:** the user's image, **unchanged**, riding an orange **kart** (hides any soft fade at the bottom of the image, adds wheels). Kart has their initial on it; wheels rotate with distance (`D/26`); body bobs while moving; speed lines when speed > 800.
  - No mascot? Use a simple geometric character in the accent colour, or ask.
  - Never use or imitate an existing game character (no pixel T-rex/cactus, no plumbers).
- **Speech bubbles:** white paper, Rubik 800 32 px, typed in.
- **HUD:**
  - Top-left timer card: `ANY%` + `mm:ss.cc` (starts at GO, stops at FINISH, blinks gold on PB).
  - Trophy inventory row under the timer (slots fill as trophies are collected, `n/5`).
  - Top-right **splits panel**: one row per project/level; current row marked with an accent bar; cleared rows turn gold with split time and `PB`; a gold flash on each clear.
- **Level banner:** dark paper card sliding in from the right: `LEVEL n` (or `BOSS`, `BONUS`) in Silkscreen gold, logo, title, sub-line.
- **POP card:** white paper card that springs in (back-ease) with a big word and a sub-line – used for stats and power-ups.

## 7. Sound design

- **140 BPM chiptune.** Pulse waves (25%, 12.5%, 50% duty via PeriodicWave), triangle bass, noise drums.
- **Progression:** C – G – Am – F (major, bright). **Boss section:** Am – F – Dm – E with a sparse minor lead and half-time drums; snare roll + rising sweep into the smash.
- Lead melody loop (8th notes) in the main sections; arpeggio 16ths; triangle bass on 8ths with octave bounce.
- **Title jingle** (arpeggiated C–Am–F–G) on the title screen, again on the closing title.
- **SFX map – gameplay is the drum track:**

| Event | Sound |
|---|---|
| Jump / land | pulse sweep 260→780 Hz / triangle thud |
| "?" or word block bump | short pulse drop + noise |
| Coin | two notes a 4th apart (pitch follows the current chord) |
| Smash (boss) | big triangle drop + noise burst + 10 debris ticks |
| Denied | low saw+square buzz |
| Access granted / level clear | 4-note pulse chime |
| Typing | square ticks 1.8–2.7 kHz |
| Split cleared | two-note pulse "ding" |
| Finish | fanfare arpeggio + held major chord + crash |

- **1.5 beats of total silence** right before crossing the finish line. Peak-normalise to −1 dBFS.

## 8. Structure (beat map, ~60 s at 140 BPM ≈ 139 beats)

| Scene | Beats | What happens |
|---|---|---|
| Title | 0–6 | Frame 1: title screen `<MASCOT NAME> · CAREER ANY%`, "a <name> speedrun", `PRESS START` blinking on the beat. Jingle. |
| Start | 6–10 | Press (white flash), mascot rolls in, bubble "hi! i'm …", `READY?` → `GO!`. Timer starts. |
| Name | 10–18 | Giant paper banner with the name on two posts, role + school under it; mascot drives beneath. |
| Thesis | 18–30 | "?" block headbutt → POP "FIND THE PROBLEM FIRST" (or their own line); three word blocks `SEE / THINK / SHIP` hit on 3 jumps. |
| Boss (hero story) | 30–54 | See §9. |
| Levels | ~12 beats each | 2–3 projects. |
| Trophy room | ~14 | Trophies drop on beats, mascot grabs each; logo cards. |
| Skills | ~14 | Coin rows per category. |
| Finish | ~120–135 | Silence → finish arch → NEW PB + confetti → contact card → bye → drives off → iris → title screen (rhymes with frame 1). |

## 9. Content → visual mapping

| Content | Visual |
|---|---|
| **Hero experience** (internship/job) | **Boss level.** A wall of messy paper sheets labelled with the real pain point in a red sign (e.g. "C4 DIAGRAMS DRAWN BY HAND"). Mascot stops; 1–2 stakeholder characters (simple rounded people, hard hats/badges as fits the domain) and a short dialogue: mascot asks "what slows you down?", they answer with the pain point, mascot: "found the bottleneck. on it." Dashed detector box `bottleneck 0.97`. Charge → **smash on the hard hit** → debris physics → pieces re-form into a **bridge of 4–6 blocks labelled with the solution stages** over a chasm; each block lights up as the mascot crosses. 3–4 POP power-ups for outcomes. Split turns gold. |
| **CV / hardware / mobility project** | Hazards on the road (potholes, debris) each with a dashed detector box + label; mascot jumps them on beats; stat POPs as speed boosts. |
| **Security / auth / data project** | A locked door with an input field: weak value typed → PII flagged → DENIED buzz + shake → scramble-decode → ACCESS GRANTED, door opens. |
| **Agents / route / pipeline project** | Flags on poles along a dashed arc route, each flag a pipeline stage, coin chime per flag. |
| **Generic project (fallback)** | Level banner + a gate/obstacle themed to the project + 2 POP stats. |
| **Wins** | Trophy room: pedestals on beats; each trophy falls in before its beat, mascot reaches it on the beat, trophy flies to the HUD inventory; a white logo card shows rank, event, detail. Then POP `n / n COLLECTED`. |
| **Skills** | Rows of spinning coins, one row per category; banner shows category + skill chips; each chip turns accent the moment its coin is collected; coin pitch follows the chord. |
| **Outro** | Timer stops: `NEW PB · <time>` with confetti (coin/accent/white/mascot colours); white contact card: "LET'S BUILD SOMETHING.", portfolio URL in accent, email, socials, `open to: …`; mascot "bye!", drives off; iris closes on it; title screen returns. |

Logos: user-supplied only, tinted one colour (white on dark banners, dark on white cards).

## 10. Copy rules

- Game text UPPERCASE, ≤ 4 words (`LEVEL 2`, `ACCESS GRANTED`, `20+ FPS`).
- Sub-lines in sentence case, ≤ 8 words.
- Dialogue bubbles ≤ 7 words each, lowercase, friendly.
- Real numbers only. Split times are the real in-video times (honest and fun).

## 11. Questions to ask (theme-specific)

1. Mascot or avatar image? (PNG with transparent background, ≥ 800 px.) What's its name?
2. Which experience is the boss fight, and what was the pain point / "wall"?
3. Who were the stakeholders (for the little characters)?
4. Logos for companies and hackathons?
5. A catchphrase for the "?" block?
6. Roles for the ground ticker ("open to …")?

## 12. Personalisation add-ons

Mascot name on the title screen · kart initial · catchphrase block · their own colours on the kart · secret bonus coin with a fun fact · "press start" with their handle · 9:16 version (vertical: world scrolls upward, stacked UI) · README GIF loop (title → boss smash → NEW PB).

## 13. Don'ts

- Don't copy any real game's character, sprites, logo or HUD exactly.
- Don't let gameplay hide facts: every stat/POP stays ≥ 1.5 s.
- Don't over-fill the screen during skills: chips in the banner, coins unlabelled.
- Don't change the user's mascot image (no redraws, no recolours).
- Overlapping UI: splits panel and level banners must not cover each other or the mascot.

## 14. Build contract

- One self-contained HTML: fonts base64-embedded, images as data URIs, canvas 1920×1080.
- `window.__render(t)` pure function of t; seeded hash randomness only.
- `window.__audio()` → OfflineAudioContext → base64 WAV; live mode uses the same `score()`.
- `await document.fonts.load()` per family/weight and await images before frame 0.
- Text helpers multiply `globalAlpha`. Iris/cut-outs: draw ring with `moveTo` + full `arc` and `fill('evenodd')`.
- Render in chunks → ffmpeg; social encode < 30 MB.

## 15. Theme quality check

- [ ] Frame 1 = title screen; last frame = title screen again.
- [ ] Every jump apex, bump, coin and trophy grab lands on its beat (check stills at those beats).
- [ ] The boss smash is the biggest hit in the reel.
- [ ] Splits panel clears exactly when each level ends.
- [ ] 1.5 beats of silence before the finish.
- [ ] No overlaps between bubbles, banners, splits panel and mascot.