# Fonts

All fonts are OFL-licensed. Stored as woff2 for size. Run `python3 scripts/fonts.py --all` to fetch any missing files.

## Currently bundled

| File | Family | Weight | Used by |
|---|---|---|---|
| `Syne-400.woff2` | Syne | 400 | perception, general |
| `Syne-600.woff2` | Syne | 600 | perception |
| `Syne-800.woff2` | Syne | 800 | perception, speedrun (labels), general |
| `JetBrainsMono-400.woff2` | JetBrains Mono | 400 | perception, ipo-day, blueprint, context_window |
| `JetBrainsMono-700.woff2` | JetBrains Mono | 700 | perception, ipo-day, blueprint, context_window |

## Still needed (fetch with fonts.py)

| File to create | Family | Weight / Style | Used by |
|---|---|---|---|
| `RubikMonoOne-400.woff2` | Rubik Mono One | 400 | speedrun (game headlines) |
| `Silkscreen-400.woff2` | Silkscreen | 400 | speedrun (timer, splits) |
| `Silkscreen-700.woff2` | Silkscreen | 700 | speedrun (timer, splits) |
| `Rubik-500.woff2` | Rubik | 500 | speedrun (body) |
| `Rubik-700.woff2` | Rubik | 700 | speedrun (body) |
| `Rubik-800.woff2` | Rubik | 800 | speedrun (body) |
| `Fraunces-400.woff2` | Fraunces | 400 | prospectus (serif body) |
| `Fraunces-400italic.woff2` | Fraunces | 400 italic | prospectus (role line) |
| `Fraunces-600.woff2` | Fraunces | 600 | prospectus (headlines) |
| `IBMPlexMono-400.woff2` | IBM Plex Mono | 400 | prospectus (labels) |
| `IBMPlexMono-600.woff2` | IBM Plex Mono | 600 | prospectus (labels) |
| `ArchivoBlack-400.woff2` | Archivo Black | 400 | ipo-day (headlines) |

## Fetch commands

```bash
# Speedrun fonts
python3 scripts/fonts.py --family "Rubik Mono One" --weights 400
python3 scripts/fonts.py --family "Silkscreen" --weights 400,700
python3 scripts/fonts.py --family "Rubik" --weights 500,700,800

# Prospectus fonts
python3 scripts/fonts.py --family "Fraunces" --weights 400,600
# Fraunces italic: download manually from fonts.google.com (italic is a separate axis)

# IPO Day fonts
python3 scripts/fonts.py --family "Archivo Black" --weights 400
python3 scripts/fonts.py --family "IBM Plex Mono" --weights 400,600
```

Total estimated size when all fetched: ~1.2 MB.
