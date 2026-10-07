# RESUMOTION — UI Spec

Framework: Next.js 15 App Router · Tailwind CSS · No component library.
Fonts: Syne (headings, 700/800) + JetBrains Mono (labels, code) — same as the reels.
Palette: matches the Perception theme default. Override per-theme on theme cards.

```
bg:      #0A0A0A   (near-black)
fg:      #F5F5F5   (off-white)
accent:  #FF6B2B   (orange)
muted:   #3A3A3A   (dark grey, borders + labels)
```

---

## Page structure

```
/               home (all sections)
/gallery        full gallery grid
```

Everything lives on one scroll. `/gallery` is an overflow page once the gallery grows past ~12 entries.

---

## 1. NavBar

Fixed top. Transparent until 80 px scroll, then `bg-[#0A0A0A]/90 backdrop-blur`.

```
[resumotion]              [Themes]  [Gallery]  [Install ↓]
 ↑ Syne 700, accent        ↑ Syne 500, fg/60
```

- Logo is wordmark only, no icon.
- "Install ↓" is an anchor link to the Install section. On mobile, collapse Themes + Gallery into a hamburger.
- No border. The blur is the separator.

---

## 2. Hero

Full viewport height. Splits 50/50 on desktop, stacks on mobile (reel on top, text below).

**Left — text**

```
Your resume,
as a 50-second film.

[▶ Install plugin]   [See reels ↓]
```

- "Your resume," in Syne 800, ~72 px desktop / 40 px mobile, fg.
- "as a 50-second film." same size, accent colour.
- Subline below: `Free · Open source · Runs in Claude Code` in JetBrains Mono, muted, 14 px.
- Two buttons: "Install plugin" is solid accent bg, "See reels" is ghost (accent border, transparent bg).
- Buttons are 48 px tall, rounded-none (sharp corners match the reel aesthetic).

**Right — live reel**

- `<HeroReel />` client component. Loads the engine with `dynamic(() => import('../components/HeroReel'), { ssr: false })`.
- Canvas is 16:9, max-width 640 px on desktop, full-width on mobile.
- Muted by default. Floating button bottom-right of the canvas: `▶ sound on` → `■ sound off`. JetBrains Mono, 12 px, accent text, accent border, transparent bg.
- MP4 fallback (`<video autoPlay muted loop playsInline>`) if the engine fails to load or the device is low-power.
- Thin 1 px accent border around the canvas. No drop shadow — that would soften it.

---

## 3. How it works

4-step horizontal strip. On mobile, vertical list.

Each step: a number in accent (Syne 800, 48 px), a short label (Syne 700, 18 px, fg), and a one-line description (JetBrains Mono, 13 px, fg/60).

```
  01              02                03               04
  Give resume     Claude writes     Engine renders   You get an MP4
  ─────────────   ───────────────   ──────────────   ────────────
  Paste text or   Facts → script.   Beat-synced      16:9 + 9:16,
  drop a PDF.     json in seconds.  canvas + audio.  ready to post.
```

No icons. The numbers are the visual. A thin accent horizontal rule connects them on desktop.

---

## 4. Themes

Section header: `THEMES` in JetBrains Mono, 11 px, letter-spacing 0.2 em, muted. Left-aligned.

Three cards, horizontal scroll on mobile. Each card:

```
┌─────────────────────────────────────┐
│                                     │
│   [looping 6 s video clip]          │
│                                     │
├─────────────────────────────────────┤
│  PERCEPTION                         │  ← Syne 700, 20 px, fg
│  ML / CV / AI engineers             │  ← JetBrains Mono, 13 px, fg/60
│                                     │
│  120 BPM · D minor · dark           │  ← JetBrains Mono, 12 px, muted
└─────────────────────────────────────┘
```

- Card bg: `#111` (one step lighter than page bg). 1 px muted border.
- On hover: border switches to accent. No scale, no shadow — hard swap only.
- Video: `autoPlay muted loop playsInline`, `preload="none"`, poster image set. Lazy-loaded.
- Card is not a link. No CTA inside the card. The Install section below covers the action.

---

## 5. Gallery

Section header same style as Themes.

Masonry-ish grid, 3 columns desktop / 2 tablet / 1 mobile. Each card:

```
┌────────────────────┐
│  [video thumbnail] │  ← static poster image, plays on hover
│                    │
├────────────────────┤
│  Priya Sharma      │  ← Syne 600, 15 px, fg
│  ML Engineer       │  ← JetBrains Mono, 12 px, fg/60
│  perception theme  │  ← JetBrains Mono, 11 px, accent
└────────────────────┘
```

- Clicking the card opens the person's post (X, LinkedIn, etc.) in a new tab.
- Bottom of section: `[→ See all reels]` link to `/gallery` once count > 6.
- If gallery is empty: placeholder card saying "Be the first. Share your reel →" linking to the GitHub issue template.

---

## 6. Install

Two columns on desktop, stacked on mobile.

**Left — Claude Code plugin**

```
CLAUDE CODE PLUGIN
─────────────────────────────────────
Requires Node 20+ and ffmpeg.

  $ /plugin install resumotion        ← code block, JetBrains Mono
                                         accent text, #111 bg, 1 px muted border

[Copy]  ← small button, top-right of block
```

**Right — claude.ai skill**

```
CLAUDE.AI SKILL
─────────────────────────────────────
Upload the skill zip in claude.ai settings.
No Node or ffmpeg required.
Render runs in the claude.ai sandbox.

  [↓ Download skill.zip]              ← accent ghost button
```

Below both columns, one line in JetBrains Mono, 12 px, fg/60:
`Rendering runs on your machine. Your resume is only shared with Claude as part of your conversation.`

---

## 7. Privacy

Not a full section — a single card, dark bg, 1 px accent border.

```
┌──────────────────────────────────────────────────────────────┐
│  Your data stays yours.                                       │
│                                                               │
│  Rendering runs on your machine. Your resume is only shared  │
│  with Claude as part of your normal conversation — the same   │
│  as any other message you send. We don't log it, store it,   │
│  or send it anywhere else. No accounts, no server.           │
└──────────────────────────────────────────────────────────────┘
```

Syne 700 for the heading, JetBrains Mono 13 px for the body.

---

## 8. Make a theme

Small section, left-aligned.

```
MAKE A THEME
────────────────────────────────
Copy _template/, write scenes + score.js,
open a PR. We'll credit you here.

[→ CONTRIBUTING.md]
```

If there are community contributors: a row of GitHub avatars below, each linking to their PR.

---

## 9. Footer

Single row. No columns.

```
resumotion · MIT · made by Nidhi Patel    [GitHub]  [X]  [LinkedIn]
```

JetBrains Mono, 12 px, fg/40. Links are icon-only (SVG, 18 px, fg/60 → fg on hover).
No border, no background — the page just ends.

---

## Interaction rules

- **No animations on load.** The reel is already moving. Everything else is static until interacted with.
- **Hover states are instant** (no transitions) to match the hard-cut aesthetic of the reels.
- **One accent colour.** Never use accent for decorative purposes — only for things the user should look at or click.
- **No gradients.** Flat colour only.
- **No rounded corners** except 2 px on buttons (barely there). Cards are square.
- **Type scale:** Syne for everything that matters, JetBrains Mono for everything that describes or labels.

---

## Mobile (< 768 px)

- Hero: reel on top (full width), text below.
- How it works: vertical numbered list.
- Themes: horizontal scroll, cards 80 vw.
- Gallery: 1 column.
- Install: stacked, full width.
- NavBar: hamburger for Themes + Gallery links.

---

## Open Graph / meta

```tsx
// app/layout.tsx
export const metadata = {
  title: "Resumotion — your resume as a 50-second film",
  description: "Free Claude plugin. Paste your resume, get a beat-synced MP4. Open source.",
  openGraph: {
    images: ["/og-image.jpg"],   // 1200×630, shows the hero reel as a still
    videos: ["/clips/og-reel.mp4"],
  },
  twitter: { card: "summary_large_image" },
}
```

`og-image.jpg` is a single designed frame from the Nidhi reel — not a screenshot of the page.

---

## Analytics

Umami or Plausible script tag in `layout.tsx`, self-hosted or free tier. Track:
- Page views
- "Install plugin" button clicks
- "Download skill.zip" button clicks
- Gallery card clicks

No cookies. One `<Script strategy="afterInteractive">` tag. Nothing else.
