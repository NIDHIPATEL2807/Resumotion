# THEME: Blueprint

> **The person's career is an engineering drawing being drafted.**
> A pen plotter draws the sheet border, fills the title block, letters their name, and then drafts the drawing of *their* field: a chip layout for a VLSI student, an engine exploding into parts for a mechanical student, a building taking loads for a civil student. Achievements are numbered callout balloons, the timeline is the revision table, skills are the bill of materials, and the reel ends with a red **APPROVED** stamp.

One theme, many films. The **core** (sheet, title block, revisions, dimensions, BOM, stamp) is shared. The **discipline pack** decides the hero drawing, the visuals, the vocabulary and the sound layer.

Reference build: none yet. The first build (recommended: a VLSI "Tape-Out" reel) becomes `reference.html`. Until then, follow this file exactly and use the other themes' reference files for engine patterns (render contract, audio export, text helpers).

---

## 1. Who it's for

| Fits | Doesn't fit |
|---|---|
| Core engineering: electronics, VLSI, electrical, power, embedded, signals, mechanical, civil, chemical, aero, auto, instrumentation, robotics hardware | Pure software/AI (use Perception), finance (Prospectus / IPO Day), design (a design theme) |
| Students targeting core internships, research internships, MS/PhD | Resumes with no technical projects (the drawing needs something to draw) |
| Hardware people with competitions, lab work, prototypes, papers | |

Tone: precise, crafted, quietly impressive, with **one or two "how did they do that" moments** per reel. It should feel like watching a master draftsman and a machine work together.

---

## 2. Picking the pack (do this first)

### 2.1 Detection from the resume
Score each pack by keyword hits in degree, coursework, projects, tools and titles. Highest score = **primary pack** (hero scene). Second-highest with ≥ 1 strong project = **secondary pack** (one detail view). Never more than two packs in one reel.

| Pack | Strong signals |
|---|---|
| **VLSI / Digital** | RTL, Verilog, SystemVerilog, UVM, FPGA, ASIC, synthesis, STA, GDS, tape-out, Vivado, Quartus, Cadence, Synopsys, CRC, FSM, verification, SVA |
| **Analog / Circuits** | CMOS, op-amp, bandgap, LDO, current mirror, PLL, ADC/DAC, LTspice, Virtuoso, layout, biasing, compensation |
| **Power / Electrical** | converter, inverter, DAB, PFC, motor drive, EV charger, OBC, grid, protection, PLECS, Simulink, C2000, transformer, kW, MPPT |
| **Embedded / IoT** | STM32, ESP32, Arduino, RTOS, firmware, UART/I2C/SPI, sensors, PCB, KiCad, Eagle, bring-up |
| **Signals / Comms** | DSP, FFT, filters, modulation, OFDM, radar, antenna, RF, 5G, SDR, image processing (classical) |
| **Mechanical** | CAD, SolidWorks, CATIA, Fusion, ANSYS, FEA, CFD, thermodynamics, IC engine, gearbox, manufacturing, GD&T, BAJA, Formula Student |
| **Civil / Structural** | STAAD, ETABS, AutoCAD (civil), RCC, steel design, surveying, geotech, transportation, concrete, bridges, BIM, Revit |
| **Chemical / Process** | process design, Aspen, HYSYS, reactors, distillation, heat exchangers, P&ID, mass transfer |
| **Aero / Auto** | aerodynamics, airfoil, XFLR5, OpenFOAM, propulsion, UAV, rocketry, vehicle dynamics, chassis, suspension |

### 2.2 Confirm in one line
"You read as **VLSI** with a **power-electronics** side story – I'll make the hero a chip tape-out and give your converter its own detail view. OK?"

### 2.3 Fallback
No clear pack → use the **General Engineering** pack (§9.10): orthographic views + section cuts of the person's main project.

---

## 3. Palette (two editions)

**Blueprint edition (default, dark):**

| Token | Hex | Use |
|---|---|---|
| `paper` | `#10365F` | Sheet background |
| `paper2` | `#0C2B4D` | Outside the sheet border / vignette |
| `grid` | `#1E4B7A` | Faint construction grid (5 mm ≈ 24 px) |
| `ink` | `#DCEBFF` | All linework and lettering |
| `construct` | `#6F95BF` | Construction lines (drawn first, faint) |
| `mark` | `#FFD23F` | Highlights: dimension values, current revision, callout numbers |
| `stamp` | `#E5484D` | APPROVED stamp, revision clouds, "bottleneck" marks only |

**Drafting-paper edition (light):** paper `#F2EEE3`, grid `#DED6C3`, ink `#1F2A36`, construct `#9AA5B1`, mark `#2F6FDE`, stamp `#D7263D`.

**Pack accent layer:** each pack may add **one** semantic colour set for its hero visual (e.g. GDS metal layers, FEA heatmap, three-phase colours). Outside the hero visual, only the core palette.

## 4. Typography (OFL only)

| Role | Font | Size |
|---|---|---|
| Name, headlines | **Space Grotesk** 700 | 72–200 px, UPPERCASE, ls +2 to +6 (drafting lettering is open, not tight) |
| Notes, labels, title block, BOM, dimensions | **IBM Plex Mono** 400/600 | 16–40 px, UPPERCASE |
| Hand annotations (max 3 per reel) | **Architects Daughter** | 28–40 px, `mark` colour – "nice!", "8× faster", arrows |
| Code (VLSI/embedded) | IBM Plex Mono | 26–40 px |

All lettering is "plotted": revealed with a pen-tip dot moving along it (see §6).

## 5. The sheet (persistent chrome)

- Canvas 1920×1080, 30 fps. **Sheet border** inset 40 px with an inner border at 56 px (double line), zone markers along the edges (`1 2 3 4…` top/bottom, `A B C D` left/right) like real drawings.
- **Title block** bottom-right, 640×190 px, ruled cells that fill in during the name scene and stay all reel:

| Field | Content |
|---|---|
| TITLE | name |
| DISCIPLINE | e.g. `ELECTRONICS & TELECOMMUNICATION · VLSI` |
| INSTITUTION | school, city |
| DRAWN BY | name (or handle) |
| DWG NO. | `<initials>-<grad year>-001` (e.g. `KV-2027-001`) |
| SHEET | `3 OF 9` – advances every scene |
| REV | current revision letter – advances with the timeline |
| SCALE | `1:1` (or a personal joke: `NOT TO SCALE · AMBITIONS`) |
| STATUS | `DRAFT` → `CHECKED` → `APPROVED` |

- **Revision table** top-right, 560 px wide, rows added as the reel passes milestones (`REV · DATE · DESCRIPTION`). The newest row is highlighted `mark`.
- **Grid**: faint 24 px grid on the drawing area; brightens slightly when the plotter is "working".
- **Texture**: subtle paper grain (3–4%), slight cyan glow on fresh ink that cools within 0.5 s (blueprint edition), soft vignette.
- Keep the title block and revision table clear: the drawing area is x 96–1300, y 96–860 when both are visible.

## 6. Motion language (the plotter)

- **Plotted lines:** every line is drawn, never faded in. Stroke grows along its path (dash offset), with a small bright **pen-tip dot** at the drawing end. Pen speed 1200–2400 px/s; corners pause 30 ms.
- **Construction first:** for important drawings, faint `construct` lines appear first (center lines, guides), then ink traces over them, then construction lines fade. This is the craft signal – use it for the hero.
- **Lettering:** text is revealed left→right behind the moving pen-tip (clip mask), 25–45 chars/s.
- **Hatching:** section fills draw as 45° hatch lines sweeping across the region.
- **Dimension lines** (signature #1): extension lines draw, then the dimension line shoots out from the centre to both arrows, then the value letters in the gap in `mark`. Used for every key stat: `|←—— 8× LOWER LATENCY ——→|`.
- **Callout balloons** (signature #2): a circle with a number pops (scale 1.4 → 1, back-ease), a leader line draws to the feature, then a note letters beside it. Achievements = balloons.
- **Detail views** (signature #3, the camera): a circle (`DETAIL A`) draws around a region, a leader line shoots to an empty area, and the circle's contents **zoom into a large detail view** labelled `DETAIL A · SCALE 4:1`. This is how the reel moves between projects – no cuts, only drawing-native transitions.
- **Section cuts:** a cutting-plane line (`A–A`) with arrows sweeps across a part; the view slices open to reveal the inside (`SECTION A–A`). Use for "how it works inside".
- **Revision clouds** (signature #4): a scalloped red cloud draws around something new, with a revision triangle `△F`. Use for the biggest recent win.
- **Stamp:** `APPROVED` lands with scale 1.8 → 1, rotation −8°, slight ink spread, red.
- **Sheet change:** the plotter "lifts", the paper slides up 100% with a soft paper whoosh, a fresh sheet slides in (SHEET n+1). Use at most 2–3 sheet changes; prefer detail views.
- Easing: cubic in-out for pen moves, expo-out for balloons/dimension shots, back-ease for stamps.
- No glitch, no shake (except the stamp: a 6 px thud).

## 7. Sound design

- **112 BPM**, key chosen per pack (default D major / B minor for warmth). Clean, crafted: muted electric piano or marimba chords, soft sub on 1 and 3, brushed hats, a light clap from the hero scene on.
- **Core SFX (every edition):**

| Event | Sound |
|---|---|
| Pen drawing | pencil scratch: band-passed noise (2–5 kHz), level follows pen speed |
| Plotter moving fast | short servo whine: saw sweep 300 → 900 Hz, low level |
| Lettering | soft ticks per character |
| Dimension line shot | quick "zip" (noise sweep up) + tick at each arrow |
| Balloon pop | wooden pluck + small bell |
| Detail-view zoom | lens whoosh + low swell |
| Revision cloud | marker squeak + ding |
| Stamp | heavy thud + paper rustle |
| Sheet change | paper slide whoosh |

- **Pack sound layer:** one signature texture per pack (see each pack). Keep it under the music, never louder than the core.
- **Silence:** one beat before the APPROVED stamp. Peak-normalise to −1 dBFS.

## 8. Structure (beat map, ~60 s ≈ 112 beats at 112 BPM)

| Scene | Beats | What happens |
|---|---|---|
| **Sheet setup** | 0–8 | Frame 1: an empty sheet with the double border and the pen-tip resting at the corner (designed, not empty-black). Border plots around, zone markers tick, title block grid draws. |
| **Name** | 8–16 | Name plotted huge across the drawing area (construction guide lines first). Title block cells fill one per beat. STATUS: `DRAFT`. |
| **General notes** (thesis) | 16–24 | A "GENERAL NOTES" box: `1.` focus area, `2.` what they love doing, `3.` what they're seeking. Short, numbered, plotted. |
| **Hero drawing** (primary pack) | 24–58 | The pack's hero metaphor (§9), covering the 1–2 strongest projects via detail views and section cuts. Dimension lines carry the stats. |
| **Detail view** (secondary pack / other project) | 58–72 | One more project, drawn in its own pack's language inside a detail circle. |
| **Callouts** (achievements) | 72–84 | The finished drawing gets numbered balloons, one per beat-pair, each with a note: rank, event, place. Biggest recent win gets a red revision cloud. Optional world-map inset for international events. |
| **Revision table sweep** | 84–90 | The table expands into a full-width timeline for 6 beats: REV A (start) → … → current REV, then collapses back to the corner. |
| **Bill of materials** (skills) | 90–98 | A BOM table plots in: `ITEM · PART · QTY`, where PART = skill groups and QTY = their tools (or `QTY: ∞` joke for their core skill – once). |
| **Leadership** (if any) | inside 72–98 as a balloon group or a small "ORGANISATION" block | |
| **Silence** | 98–99 | Pen lifts. Nothing moves. |
| **Approval** | 99–112 | STATUS → `CHECKED` → red **APPROVED** stamp. "ISSUED FOR: <goal>" lettered under it (e.g. `ISSUED FOR: RESEARCH INTERNSHIPS 2027 · VLSI`). Contact lines in the title block. **Last frame:** zoom out to the complete sheet – the finished version of frame 1. |

Scale to content: thin resume → drop the detail view and revision sweep (~40 s). Never pad.

## 9. Discipline packs

Each pack defines: hero metaphor · hero scene beats · signature visuals · how projects map · stats style · sound layer · vocabulary · crazy moments · pack-specific questions.

### 9.1 VLSI / Digital – "TAPE-OUT"
- **Metaphor:** the person is a chip going from RTL to silicon.
- **Hero scene:** a **wafer** (circle of die grid) plotted → detail view into one die labelled `<NAME>_V1` → the die's **floorplan** = their career: each block is a project (`USB_PD_CTRL`, `ADAS_SOC`, `POWER_DOMAIN`, `IETE_FORUM`) → detail-view dives into blocks.
- **Signature visuals:** RTL typing (`module <name> (input curiosity, output silicon);`) → synthesis into gate symbols → gates to **GDS polygons** (pack accent layer: metal colours `#2EC4FF` M1, `#FF4FD8` M2, `#FFD23F` M3, `#7CFF6B` poly, translucent 35%, overlapping); **timing waveforms** (clock + data, transitions on beats); **FSM bubble diagrams** with the active state lighting; XOR/CRC matrices lighting cell by cell; **DRC ✓ LVS ✓ TIMING ✓** sign-off.
- **Stats style:** timing-diagram dimension lines between edges (`|← 8× →|`), slack readouts.
- **Skills:** functional-coverage report: each skill is a coverage bin filling to 100%; assertion line `assert property (<name> |-> verified);` ✓.
- **Sound layer:** a crisp clock tick on 16ths, data blips on transitions.
- **Vocabulary:** tape-out, sign-off, die, floorplan, clock domain, coverage, slack, netlist.
- **Crazy moments:** their name rendered as real-looking metal-layer layout; the CRC/XOR matrix firing all at once vs a serial crawl; zoom-out at the end to a wafer of identical dies.
- **Honesty:** if the project hasn't been taped out, label `TARGET: RTL-TO-GDS · IN PROGRESS`; never claim fabrication.

### 9.2 Analog / Circuits – "BODE & BIAS"
- **Metaphor:** a circuit being designed, biased, and stabilised.
- **Hero scene:** a **schematic plots itself** (transistor symbols, current mirrors, diff pair, two-stage op-amp); bias currents flow as moving dots; a **Bode plot** draws (gain + phase), phase margin measured with a dimension line; compensation capacitor added → plot stabilises.
- **Signature visuals:** schematic symbols, DC operating-point annotations (`gm`, `Vov` as labels, values only if real), Bode/step responses, layout matching (common-centroid pattern).
- **Skills:** a SPICE netlist printing line by line; each line a tool/skill.
- **Sound layer:** a sine sweep that rises with the frequency axis.
- **Crazy moment:** an unstable ringing step response that "settles" exactly on the beat when compensation is drawn in.

### 9.3 Power / Electrical – "POWER-ON"
- **Metaphor:** a system being energised.
- **Hero scene:** a **single-line diagram** (source → converter → load) plots; a breaker closes; **power flows** as glowing dashed lines; converter topology detail view (H-bridges, transformer); **switching waveforms** (PWM, phase-shifted square waves, current ramps); an **efficiency curve** draws.
- **Pack accent:** three-phase colours `#FF5A5A` `#FFD23F` `#4DA3FF`, power-flow `#7CFF6B`.
- **Stats style:** rating plates (`1 kW · BIDIRECTIONAL`) like nameplates riveted on.
- **Sound layer:** a low mains hum (50/60 Hz, very quiet) that rises when power-on happens; a high switching whine during waveforms.
- **Crazy moment:** a **bidirectional** arrow flipping direction on a hard beat; a world map where the converter "travels" to competition venues.

### 9.4 Embedded / IoT – "BOOT SEQUENCE"
- **Metaphor:** the person is a board booting up.
- **Hero scene:** a **PCB** plots (outline, footprints, traces routing themselves), a **pinout diagram** labels pins with their skills, power LED lights, **UART boot log** prints (`[OK] sensors`, `[OK] radar`), oscilloscope traces show signals.
- **Skills:** pin labels / a datasheet "features" list.
- **Sound layer:** UART chirps (fast square blips), relay clicks.
- **Crazy moment:** traces auto-route across the board on 16ths, then the whole board "boots" with every LED lighting on one hit.

### 9.5 Signals / Comms – "SPECTRUM"
- **Metaphor:** a signal travelling through a system.
- **Hero scene:** a time-domain signal → **FFT** reveals peaks (each peak = a project), **filter** response shapes it, a **constellation diagram** locks; block diagram (TX → channel → RX).
- **Sound layer:** radio sweeps, filtered noise resolving into a clean tone.
- **Crazy moment:** noisy constellation points snapping into a perfect grid on the beat.

### 9.6 Mechanical – "EXPLODED VIEW"
- **Metaphor:** the person is a machine assembling itself.
- **Hero scene:** **isometric part drawing** plots → it **explodes** into components along axis lines (each component labelled with a project or skill) → reassembles on a hard beat; **section cut** reveals internals; **FEA heatmap** (pack accent: blue → green → yellow → red) on the main part; P–V / T–s cycle traced for thermo work.
- **Signature visuals:** orthographic views (front/top/side), GD&T frames, gears meshing, hatching.
- **Stats style:** GD&T-style frames and dimension chains.
- **Sound layer:** ratchets, gear meshing ticks, a pneumatic hiss on the explode.
- **Crazy moment:** the explode → reassemble on the drop; a gear train where each gear is a year of their journey.

### 9.7 Civil / Structural – "LOAD TEST"
- **Metaphor:** the person is a structure being designed and proven.
- **Hero scene:** **site plan** → **foundation** → structure drafted **floor by floor** (each floor = a project / year); **loads applied** (arrows: dead, live, wind); **bending-moment and shear diagrams** draw; deflection shown exaggerated, then **"SAFE"** check; contour map for surveying/geotech work.
- **Signature visuals:** plans, elevations, rebar sections (circles in hatched concrete), truss members highlighting under load.
- **Stats style:** load arrows with values, span dimensions.
- **Sound layer:** concrete-pour rumble, steel clank on members, a low creak under load that resolves.
- **Crazy moment:** a wind-load gust sweeps across the building on the drop and it holds; floors stacking one per beat.

### 9.8 Chemical / Process – "PROCESS FLOW"
- **Metaphor:** raw material in, refined product out.
- **Hero scene:** a **P&ID** plots (vessels, pumps, heat exchangers, valves with tag numbers like `P-101`); streams flow as moving dashed lines; each unit operation is a project; a **product stream** exits labelled with their goal.
- **Sound layer:** flowing liquid, valve clicks, a steady pump rhythm locked to the beat.
- **Crazy moment:** a distillation column filling tray by tray on 8ths.

### 9.9 Aero / Auto – "WIND TUNNEL"
- **Metaphor:** a design proven in the tunnel or on the track.
- **Hero scene:** an **airfoil / vehicle profile** plots; **streamlines** flow around it; pressure colouring; lift/drag polar curve draws; for auto: suspension geometry moves, a lap trace draws on a track map.
- **Sound layer:** wind rush rising with speed; engine/turbine tone for propulsion work.
- **Crazy moment:** streamlines turning laminar exactly on the drop.

### 9.10 General Engineering (fallback)
- Orthographic views + isometric of the main project, section cut, dimension stats, callouts. Works for any discipline when signals are unclear.

## 10. Content → visual mapping (core)

| Content | Visual |
|---|---|
| Name | plotted lettering + title block |
| Degree / focus | title block DISCIPLINE + GENERAL NOTES |
| Coursework | NOTES list or a small "REFERENCE STANDARDS" block (only the 3–5 most relevant courses) |
| Projects | the pack's hero drawing + detail views |
| Internship / job | a detail view drawn in the pack language + a "CLIENT" field (company) in a mini title block; logo if supplied |
| Competitions / awards | numbered callout balloons; biggest recent one in a red revision cloud |
| International events | inset world map (simple outline), routes plotted from home city to venues |
| Presentations / papers | a "REFERENCES" block in citation style: `[1] <Title>, <Venue>, <Year>` |
| Leadership | balloon group or an "ORGANISATION" block (role, org, dates, one line) |
| Skills / tools | BOM table (pack may override: coverage report, netlist, pinout) |
| Timeline | revision table |
| Goal | `ISSUED FOR: …` under the APPROVED stamp |
| Contact | title block bottom rows: email · LinkedIn · portfolio |

## 11. Personalisation

### 11.1 Always ask (keep it short – max 6 questions total, combining with §11.2)
1. **Primary and secondary pack OK?** (show your detection in one line)
2. **What is this reel "issued for"?** (e.g. research internships 2027, core jobs, MS/PhD)
3. **Edition:** blueprint blue or drafting paper?
4. **Logos** for college, companies, competitions? (PNG/SVG ≥ 500 px)

### 11.2 Ask only when the resume triggers it

| If the resume has… | Ask |
|---|---|
| Hardware prototypes, PCBs, physical builds | "Any photos of the build? I can fade a real photo into the drawing." |
| International competitions / conferences | "Want a world-map inset with routes from your city to the venues?" |
| Research goals, MS/PhD, research internships | "Your research interests in one line? I can add an ABSTRACT card." and "Any target labs/areas to mention?" |
| Papers, presentations, posters | "Exact titles/venues for a REFERENCES block?" |
| CGPA / grades | "Show your CGPA? (default: no; for higher studies it can help)" |
| Projects marked ongoing / "present" | "Current status of <project>? I'll label it IN PROGRESS – no claims beyond that." |
| Team projects | "What exactly was your part in <project>?" |
| Internship at a company | "Anything confidential to keep off screen?" |
| Patents, publications, tape-outs, products shipped | "Can you share the number/link so it's shown precisely?" |
| A mentor/professor named | "Want a 'CHECKED BY' field with their name? (only with their OK)" |
| Strong second discipline | "Should <secondary> get its own detail view?" |
| A nickname/handle anywhere | "Use it as DRAWN BY / DWG NO.?" |

### 11.3 Add-ons to offer (menu)
- Their **name as real-looking drawing**: metal-layer layout (VLSI), PCB traces (embedded), steel section (civil), gear profile (mech).
- **Hand-annotation notes** in Architects Daughter (max 3): "8× faster!", "1 of 7 worldwide".
- **Signature** in the APPROVED box.
- **Scale joke** in the title block (`NOT TO SCALE · AMBITIONS`).
- **Hardware photo** dissolve into linework.
- **Abstract card** for professors (research interests, 2 lines).
- **World-map inset** for travel to competitions.
- **README GIF loop:** sheet setup → hero money shot → APPROVED.
- **LinkedIn banner** (1584×396) of the finished sheet.
- **9:16 edition** (portrait sheet, title block at the bottom).
- **QR** in the title block – only on request.

## 12. Copy rules

- Drafting voice: UPPERCASE labels, terse, numbered notes. `1. FOCUS: DIGITAL DESIGN & VERIFICATION.`
- Headlines ≤ 5 words; notes ≤ 10 words; balloon notes ≤ 8 words.
- Real numbers only. A stat without a real number becomes a keyword note instead.
- Use the person's own field vocabulary (pack §9), correctly – no buzzword soup.

## 13. Honesty rules

- Never invent specs, efficiencies, latencies, ranks, or fabrication.
- `IN PROGRESS` / `TARGET` labels for unfinished work.
- Team work: credit "team" in notes when the resume says team; describe only their part as theirs.
- Logos only user-supplied, tinted to `ink`. No real company drawings, no copied datasheets or standards text.
- Default OFF: phone, CGPA, QR.

## 14. Don'ts

- Don't fade lines in – everything is drawn.
- Don't use more than two packs, or more than one pack accent layer on screen.
- Don't cover the title block or revision table with the drawing.
- Don't overuse sheet changes; use detail views and section cuts as transitions.
- No glitch, neon, confetti. The only "explosion" is mechanical's exploded view.
- Don't make it a slideshow of text: every scene must contain a drawing.

## 15. Build contract

- One self-contained HTML: fonts base64-embedded (Space Grotesk, IBM Plex Mono, Architects Daughter), images as data URIs, canvas 1920×1080.
- `window.__render(t)` is a pure function of t; seeded hash randomness only.
- Plotted strokes: build each drawing as a list of paths with cumulative lengths; reveal by length at time t; draw the pen-tip at the current point. Pen-scratch audio level is derived from the same schedule.
- `window.__audio()` → OfflineAudioContext → base64 WAV; live mode uses the same `score()`.
- `await document.fonts.load()` per family/weight before frame 0.
- Text helpers multiply `globalAlpha`. Fit-to-width all headlines.
- Render in chunks → ffmpeg (`-crf 24 -tune stillimage`), social < 30 MB.

## 16. Theme quality check

- [ ] Frame 1 = empty sheet with border + resting pen; last frame = the complete sheet.
- [ ] Nothing fades in that should be drawn.
- [ ] The hero drawing is unmistakably the person's discipline (a civil reel never looks like a chip).
- [ ] Every key stat is a dimension line with a real number.
- [ ] Title block SHEET and REV advance correctly; STATUS ends APPROVED.
- [ ] One beat of silence before the stamp.
- [ ] Ongoing work labelled; team work credited; no invented numbers.
- [ ] No overlap with title block / revision table; no text overflow.