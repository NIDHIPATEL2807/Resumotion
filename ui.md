# RESUMOTION — UI Spec

Framework: Next.js 15 App Router · Tailwind CSS · GSAP (hero animation) · No component library.
Fonts: Archivo 400/600/900 (display + body) · Playfair Display Italic 400/500 (accent serif).
Mood: quiet, crafted, bookish, gilded. Editorial warm-dark. Never loud, never SaaS.

Google Fonts import:
```
Archivo:wght@400;600;900
Playfair+Display:ital,wght@1,400;1,500
```

---

## Color tokens

```css
--ink:         #141210   /* page background */
--bronze:      #1C1916   /* card / panel background */
--gild:        #26221D   /* raised surfaces, inputs, hover bg */
--ember:       #3A332B   /* borders on hover, dividers */
--taupe:       #9A8F7F   /* muted text, metadata, secondary display */
--cream:       #DCC6A4   /* primary display type, wordmark, icons */
--ivory:       #F0E7D8   /* high-emphasis small text, active states */
--peach:       #E2A77B   /* single accent: CTA fill, focus ring */
--line:        rgba(220,198,164,0.10)   /* default card border */
--line-strong: rgba(220,198,164,0.22)  /* hover border, dividers */
```

Rules:
- No pure black, no pure white, no blue or green anywhere.
- Peach appears at most once or twice per screen — only on the primary CTA and one highlight.
- Gradients: never on buttons. Only as faint radial glows on panel backgrounds.

---

## Typography rules

**Display — Archivo 900**
- Wordmark: lowercase, `clamp(72px, 12vw, 180px)`, cream, tracking -0.03em, line-height 0.95.
- Headlines: UPPERCASE, 32–64 px, cream; de-emphasised connector words in taupe.
- Mix Playfair italic inline for connector words:
  `TURN YOUR RESUME` *into* `A 50-SECOND FILM` — Archivo Black caps + Playfair italic lowercase in the same line.

**Accent serif — Playfair Display Italic 400/500**
- Taglines, captions, footnotes, inline connector words.
- Example tagline: *"your work, in motion — no. 01"*
- Never for headings on their own. Always in contrast with Archivo Black.

**Labels / meta — Archivo 600, 10–11 px, UPPERCASE, letter-spacing 0.20–0.24em, taupe**
- Section headers, panel headers, catalog indices.

**Body — Archivo 400, 14–15 px, line-height 1.6, taupe**
- Key words and numbers in ivory for emphasis.

---

## Layout system

- Page = bento grid of archival panels. Gap 16–20 px. Inner padding 28–40 px.
- Panels: `background: var(--bronze)` + faint top-left glow:
  `radial-gradient(circle at 0 0, rgba(220,198,164,0.05), transparent 60%)`
- Border: `1px solid var(--line)`. Radius: 20–24 px.
- No drop shadows, or a single very soft warm one: `0 2px 24px rgba(0,0,0,0.4)`.
- Optional film-grain overlay on the page: SVG noise texture at 3–5% opacity.
- Every panel has a header row:
  - Left: `✦ resumotion° / section-name` — label style, taupe.
  - Right: catalog index — `N° 01 · MMXXVI`, `I / IV`, `N° 03` — label style, taupe.
- 1 px `var(--line)` horizontal divider between the panel header and panel content.

---

## Signature motifs

- **✦** four-point sparkle before every section label.
- **°** degree mark after the brand name: `resumotion°`
- **○** small outlined circle beside the wordmark in the nav.
- Roman numerals + `N°` catalog numbering throughout.
- Year ranges: `2024 — '26`.
- Giant outlined numerals behind panels at low opacity (`cream`, ~8% opacity, Archivo 900).
- Separators with middle dots: `PASTE RESUME · CLAUDE WRITES · ENGINE RENDERS · YOU GET AN MP4`.
- Mixed-weight sentences everywhere: Archivo Black caps + Playfair italic lowercase in one line.

---

## Page structure

```
/               home (all sections, one scroll)
/gallery        full gallery grid
```

---

## 1. NavBar

Fixed top. Transparent until 60 px scroll, then `background: rgba(20,18,16,0.92); backdrop-filter: blur(12px)`.

```
resumotion° ○          ✦ THEMES   ✦ GALLERY   INSTALL ↓
  ↑ Archivo 900                    ↑ Archivo 600, 10px, taupe, tracked
    cream, 22px
```

- No border on the nav itself. The blur is the separator.
- Active link: ivory + `•` before it.
- `INSTALL ↓` is a peach-fill pill: height 28 px, radius 999 px, Archivo 600 10 px ink text.
- On mobile (< 768 px): hamburger icon (3 lines, cream), slides in a full-height drawer with the same warm-dark bg.

---

## 2. Hero

Full viewport height. Two-column split on desktop (text left, animation right). Stacks on mobile (animation top, text below).

### Left — text

```
TURN YOUR RESUME
into A 50-SECOND
FILM.
```

- "TURN YOUR RESUME" — Archivo 900, ~72 px, cream, UPPERCASE.
- "into" — Playfair Display Italic, same size, taupe (inline serif drop).
- "A 50-SECOND" — Archivo 900, cream.
- "FILM." — Archivo 900, peach.
- Below, in Playfair italic, taupe, 18 px: *"beat-synced · synthesized sound · open source"*
- Two buttons, 40 px tall, radius 999 px:
  - Primary: peach fill, ink text, Archivo 600 10 px tracked — `INSTALL PLUGIN`
  - Ghost: `var(--line-strong)` border, transparent fill, cream text — `SEE REELS ↓`

### Right — isometric hero animation

This is the centrepiece. A 3D isometric scene built in CSS + GSAP, running at 60 fps, no canvas, no WebGL.

**The scene: a floating isometric workstation**

Three objects arranged on an isometric grid, each floating independently:

```
        ┌──────────────────┐
        │  PLUGIN BLOCK    │   ← a tall isometric block, like a keycap or plugin card
        │  resumotion°     │     with the wordmark on its face
        └──────────────────┘
               ↑
        ┌──────────────────┐
        │  TERMINAL BLOCK  │   ← a flat isometric screen showing:
        │  > /resumotion   │     the slash command being typed, letter by letter
        │  > loading…      │
        └──────────────────┘
               ↑
        ┌──────────────────┐
        │  REEL BLOCK      │   ← a small film-strip or card showing
        │  ▶ reel.mp4      │     a single frame still from a reel
        └──────────────────┘
```

The three blocks float gently (independent sine-wave y-offsets, different phases). When the animation sequence plays:

1. **TERMINAL BLOCK** appears first. The cursor blinks. `/resumotion` types out letter by letter (GSAP `TextPlugin`, ~1.2 s).
2. A loading bar fills across the bottom of the terminal block (1 s).
3. **PLUGIN BLOCK** rises into frame from below, the `resumotion°` wordmark fades in on its face.
4. **REEL BLOCK** slides in from the right, showing the reel frame.
5. All three settle into their floating idle positions. Loop back to step 1 after ~6 s pause.

**Implementation**

```
components/
  HeroScene.tsx        ← GSAP + CSS isometric, dynamic import (no SSR)
  IsoBlock.tsx         ← reusable isometric block (top face, left face, right face as divs)
```

- Isometric projection via CSS `transform: rotateX(60deg) rotateZ(-45deg)` on a wrapper, individual faces as absolutely positioned divs.
- Face colours: top = `var(--gild)`, left = `var(--bronze)`, right = `var(--ink)` with a 1 px `var(--line)` edge.
- Text on block faces: Archivo 900 for the wordmark, JetBrains Mono for the terminal text (keeps the terminal block on-brand with the reel aesthetic).
- GSAP `gsap.timeline()` drives the sequence. `gsap.ticker` keeps it at 60 fps.
- Floating idle: `gsap.to(block, { y: -8, repeat: -1, yoyo: true, ease: "sine.inOut", duration: 2.4, delay: i * 0.6 })` — different delay per block.
- On mobile: scale the scene to 70%, or replace with an MP4 fallback of the animation.
- Reduced-motion: `@media (prefers-reduced-motion)` → freeze all animations, show static isometric scene.

**Surrounding atmosphere**

- Faint radial glow behind the scene: `radial-gradient(ellipse at center, rgba(226,167,123,0.06), transparent 70%)`.
- Film grain overlay at 4% opacity over the whole hero.
- Giant `N° 01` in Archivo 900, cream, 8% opacity, behind the scene — the catalog motif.

---

## 3. How it works

Section header: `✦ PROCESS · N° 02` — label style, taupe.

4-step horizontal strip on desktop, vertical list on mobile.

Each step is a mini archival panel:

```
┌──────────────────────────────┐
│  ✦ STEP / N° 01              │  ← label, taupe
├──────────────────────────────┤
│                              │
│  01                          │  ← Archivo 900, 48px, cream
│  Give resume                 │  ← Archivo 900, 20px, cream
│                              │
│  Paste text or drop a PDF.   │  ← Archivo 400, 14px, taupe
│  Only real facts extracted.  │
└──────────────────────────────┘
```

Steps:
1. **Give resume** — paste text or drop a PDF. Only real facts extracted.
2. **Claude writes the script** — facts.json → script.json in seconds. You review and approve.
3. **Engine renders** — beat-synced canvas + synthesized audio. No AI in this step.
4. **You get an MP4** — 16:9 + 9:16, ready to post.

A thin 1 px `var(--line)` horizontal rule connects the step numbers on desktop. The connector text in Playfair italic: *"then"* between each step.

---

## 4. Themes

Section header: `✦ THEMES · N° 03 · I / III` — label style, taupe.

Three archival panels in a row. Each:

```
┌──────────────────────────────────────────┐
│  ✦ THEME / N° 01                         │  ← label, taupe
├──────────────────────────────────────────┤
│                                          │
│  [looping 6 s video clip, warm poster]   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  PERCEPTION                              │  ← Archivo 900, 24px, cream
│  *for ML, CV & AI engineers*             │  ← Playfair italic, 15px, taupe
│                                          │
│  120 BPM · D minor · dark                │  ← label, taupe
└──────────────────────────────────────────┘
```

- Hover: `border-color` transitions to `var(--line-strong)`, background to `var(--gild)`. 300 ms ease-out.
- Video: `autoPlay muted loop playsInline preload="none"` with poster. Lazy-loaded.
- Card is not a link. No CTA inside.

---

## 5. Gallery

Section header: `✦ REELS · N° 04` — label style, taupe.

Masonry grid, 3 col desktop / 2 col tablet / 1 col mobile, gap 16 px.

Each card:

```
┌────────────────────────────────┐
│  ✦ REEL / N° 07                │  ← label, taupe
├────────────────────────────────┤
│                                │
│  [poster image — plays on      │
│   hover, muted loop]           │
│                                │
├────────────────────────────────┤
│  Priya Sharma                  │  ← Archivo 900, 16px, cream
│  *ML Engineer*                 │  ← Playfair italic, 13px, taupe
│  PERCEPTION THEME →            │  ← label, peach, links to their post
└────────────────────────────────┘
```

- Click opens the person's X / LinkedIn post in a new tab.
- Empty state: one panel saying `*"be the first — share your reel →"*` in Playfair italic, cream, linking to the GitHub issue template.
- `[→ See all reels]` anchor link to `/gallery` once count > 8.

---

## 6. Install

Section header: `✦ INSTALL · N° 05` — label style, taupe.

Two archival panels side by side.

**Panel left — Claude Code plugin**

```
✦ CLAUDE CODE / N° 01                    I / II
─────────────────────────────────────────────────
Requires Node 20+ and ffmpeg.

  $ /plugin install resumotion

                                          [COPY ↗]
```

- Code block: JetBrains Mono, 14 px, ivory text, `var(--ink)` bg, 1 px `var(--line)` border, radius 8 px.
- `[COPY ↗]` is a ghost pill, top-right of code block.

**Panel right — claude.ai skill**

```
✦ CLAUDE.AI / N° 02                      II / II
─────────────────────────────────────────────────
No Node or ffmpeg required.
Render runs in the claude.ai sandbox.

  [↓ DOWNLOAD SKILL.ZIP]
```

- Download button: peach fill, ink text, Archivo 600 10 px, radius 999 px, height 32 px.

Below both panels, in Playfair italic, taupe, 13 px, centered:
*"Rendering runs on your machine. Your resume is only shared with Claude as part of your conversation."*

---

## 7. Privacy

Not a section — a single slim archival panel, 1 px `var(--line-strong)` border.

```
✦ YOUR DATA · N° 06
─────────────────────────────────────────────────────────
Your work stays yours.

Rendering runs on your machine. Your resume is only shared
with Claude as part of your conversation — the same as any
other message you send. No accounts. No server. No logs.
```

Heading Archivo 900 20 px cream. Body Archivo 400 14 px taupe, "No accounts. No server. No logs." in ivory.

---

## 8. Make a theme

Section header: `✦ CONTRIBUTE · N° 07` — label style, taupe.

Small panel, left-aligned text.

```
ADD A THEME                               N° 08
*and your name goes here*
─────────────────────────────────────────────────
Copy themes/_template/, write scenes + score.js,
open a PR. We review against the quality bar.

  CONTRIBUTING.md →
```

If contributors exist: a row of their GitHub avatars below, each 32 px circle, cream border 1 px, linking to their PR. Label under the row: `COMMUNITY · N° <count> THEMES`.

---

## 9. Footer

```
resumotion° · MIT · *made by Nidhi Patel*    — 2024 · '26

✦ GitHub   ✦ X   ✦ LinkedIn
```

- Wordmark: Archivo 900, 14 px, cream.
- "made by Nidhi Patel": Playfair italic, taupe.
- "2024 · '26": label style, taupe.
- Social links: icon-only SVGs, 18 px, taupe → cream on hover, 300 ms ease.
- No background, no border — the page just ends. One thin `var(--line)` rule above.

---

## Motion rules

- **Hero animation (GSAP):** 60 fps, smooth. Sequence on load, then idle float loop.
- **Everything else:** 300–500 ms ease-out. Fades and 8 px y-rises only on scroll-enter.
- **Hover:** border color to `var(--line-strong)`, bg to `var(--gild)`. No scale, no glow, no bounce.
- **Reduced motion:** `prefers-reduced-motion: reduce` → all animations frozen. Hero shows static isometric scene.
- **No spinning, no neon pulses, no gradient sweeps.** Silence and stillness are the aesthetic.

Scroll-enter animations: `gsap.from(el, { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" })` triggered by `IntersectionObserver`. One pass only — don't re-animate on scroll-up.

---

## Interaction rules

- **Peach once or twice per screen.** Only on the primary CTA and one small highlight. Not on hover states, not on decorative elements.
- **No gradients on interactive elements.** Flat colour fills only.
- **No rounded corners below radius 20 px on panels.** Pills (radius 999) on buttons only.
- **Type does the work.** Don't add icons where a word works better. The ✦ sparkle is structural, not decoration.
- Links: `"See full process →"` style — small, arrow suffix, underline on hover only.

---

## Mobile (< 768 px)

- Hero: isometric animation on top (scaled to 70%), text below.
- How it works: vertical numbered list, full-width panels.
- Themes: horizontal scroll snap, cards 85 vw.
- Gallery: 1 column.
- Install: stacked, full width.
- NavBar: hamburger → full-height warm-dark drawer.
- Film grain overlay stays.

---

## Open Graph / meta

```tsx
// app/layout.tsx
export const metadata = {
  title: "resumotion° — your resume as a 50-second film",
  description: "Free Claude plugin. Paste your resume, get a beat-synced MP4. Open source.",
  openGraph: {
    images: ["/og-image.jpg"],     // 1200×630, a single designed still from a reel
    videos: ["/clips/og-reel.mp4"],
  },
  twitter: { card: "summary_large_image" },
}
```

`og-image.jpg` is a single frame from the Nidhi reel — warm, designed, on-brand — not a screenshot of the page.

---

## Analytics

Umami or Plausible in `layout.tsx`, self-hosted or free tier. Track:
- Page views
- `INSTALL PLUGIN` clicks
- `DOWNLOAD SKILL.ZIP` clicks
- Gallery card clicks
- `CONTRIBUTING.md →` clicks

No cookies. One `<Script strategy="afterInteractive">` tag. Nothing else.
