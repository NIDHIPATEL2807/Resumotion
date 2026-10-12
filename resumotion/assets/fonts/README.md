# Fonts

The 5 fonts here cover the Perception and Blueprint themes. The other themes have fonts embedded directly in their `reference.html` — no separate files needed for those.

When building a new reel, use any OFL font that fits the concept. The ones below are what the existing themes use, as a reference.

## Bundled (in this folder)

| File | Family | Used by |
|---|---|---|
| `Syne-400.woff2` | Syne | perception, general |
| `Syne-600.woff2` | Syne | perception |
| `Syne-800.woff2` | Syne | perception, speedrun labels |
| `JetBrainsMono-400.woff2` | JetBrains Mono | perception, ipo-day, blueprint, context_window |
| `JetBrainsMono-700.woff2` | JetBrains Mono | perception, ipo-day, blueprint, context_window |

## Used by other themes (embedded in reference.html)

| Theme | Fonts |
|---|---|
| speedrun | Rubik Mono One · Silkscreen 400/700 · Rubik 500/700/800 |
| prospectus | Fraunces 400/600/italic · IBM Plex Mono 400/600 |
| ipo-day | Archivo Black · JetBrains Mono |

## For new reels

Use any 2 OFL fonts — one display, one body. Good sources:
- [fonts.google.com](https://fonts.google.com) — filter by OFL license
- [fontsource.org](https://fontsource.org) — npm packages with woff2

Fetch and embed with `scripts/fonts.py --family "Font Name" --weights 400,700`.
