#!/usr/bin/env python3
"""
build.py — assemble a resumotion reel HTML from parts.

Usage:
  python3 scripts/build.py \\
    --theme speedrun \\
    --scenes scenes.js \\
    --score score.js \\
    --facts facts.json \\
    --out alex-reel.html

What it does:
  1. Reads assets/player.html (the shell with /*FONTS*/ /*IMGS*/ /*SCENES*/ /*SCORE*/ slots).
  2. Base64-encodes every font in assets/fonts/ that the theme uses and injects them as
     @font-face rules into /*FONTS*/.
  3. Reads facts.json and injects any user-supplied image assets (persona_image, logos)
     as base64 data URIs into /*IMGS*/.
  4. Injects scenes.js into /*SCENES*/ and score.js into /*SCORE*/.
  5. Writes one self-contained HTML file with no external dependencies.

Never modifies player.html or anything in scripts/.
"""

import argparse, base64, json, os, re, sys
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
THEMES_DIR = SKILL_DIR / 'assets' / 'themes'
FONTS_DIR  = SKILL_DIR / 'assets' / 'fonts'
PLAYER     = SKILL_DIR / 'assets' / 'player.html'

# Font families bundled in assets/fonts/ and their CSS face declarations
BUNDLED_FONTS = {
    'Syne-400.woff2':            ('Syne',           400, 'normal'),
    'Syne-600.woff2':            ('Syne',           600, 'normal'),
    'Syne-800.woff2':            ('Syne',           800, 'normal'),
    'JetBrainsMono-400.woff2':   ('JetBrains Mono', 400, 'normal'),
    'JetBrainsMono-700.woff2':   ('JetBrains Mono', 700, 'normal'),
}

def b64_font(path: Path) -> str:
    data = base64.b64encode(path.read_bytes()).decode()
    return f'data:font/woff2;base64,{data}'

def font_face_css(filename: str, path: Path) -> str:
    family, weight, style = BUNDLED_FONTS[filename]
    src = b64_font(path)
    return (f"@font-face{{\n"
            f"  font-family:'{family}';\n"
            f"  src:url('{src}')format('woff2');\n"
            f"  font-weight:{weight};font-style:{style};\n"
            f"}}")

def b64_image(path_or_data_uri: str) -> str:
    """Return a data URI. Accepts a file path or a pre-formed data: URI."""
    if path_or_data_uri.startswith('data:'):
        return path_or_data_uri
    p = Path(path_or_data_uri)
    if not p.exists():
        print(f'[build] WARNING: image not found: {p}', file=sys.stderr)
        return ''
    ext = p.suffix.lstrip('.').lower()
    mime = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
            'gif': 'image/gif', 'webp': 'image/webp', 'svg': 'image/svg+xml'}.get(ext, 'application/octet-stream')
    data = base64.b64encode(p.read_bytes()).decode()
    return f'data:{mime};base64,{data}'

def main():
    ap = argparse.ArgumentParser(description='Assemble a resumotion reel HTML.')
    ap.add_argument('--theme',  required=True, help='Theme name (folder under assets/themes/)')
    ap.add_argument('--scenes', required=True, help='Path to scenes.js')
    ap.add_argument('--score',  required=True, help='Path to score.js')
    ap.add_argument('--facts',  required=True, help='Path to facts.json')
    ap.add_argument('--out',    required=True, help='Output HTML path')
    ap.add_argument('--fonts',  default='', help='Comma-separated extra font filenames from assets/fonts/')
    args = ap.parse_args()

    # ── Load player shell ──
    if not PLAYER.exists():
        sys.exit(f'[build] ERROR: {PLAYER} not found. Run from within the resumotion skill folder.')
    shell = PLAYER.read_text(encoding='utf-8')

    for slot in ['/*FONTS*/', '/*IMGS*/', '/*SCENES*/', '/*SCORE*/']:
        if slot not in shell:
            sys.exit(f'[build] ERROR: player.html is missing the slot {slot}')

    # ── Fonts: embed all bundled fonts + any extras ──
    extra_fonts = [f.strip() for f in args.fonts.split(',') if f.strip()]
    font_css_lines = []
    for fname, fpath in [(f, FONTS_DIR / f) for f in BUNDLED_FONTS]:
        if fpath.exists():
            font_css_lines.append(font_face_css(fname, fpath))
    # Extra fonts from fonts.py output (passed as filenames in assets/fonts/)
    for fname in extra_fonts:
        fpath = FONTS_DIR / fname
        if fpath.exists() and fname in BUNDLED_FONTS:
            pass  # already included above
        elif fpath.exists():
            data = b64_font(fpath)
            print(f'[build] NOTE: {fname} not in BUNDLED_FONTS registry; embedding raw woff2 without @font-face declaration.')
    shell = shell.replace('/*FONTS*/', '\n'.join(font_css_lines), 1)

    # ── Images: embed persona_image and logos from facts.json ──
    facts = {}
    try:
        facts = json.loads(Path(args.facts).read_text(encoding='utf-8'))
    except Exception as e:
        print(f'[build] WARNING: could not read facts.json: {e}', file=sys.stderr)

    img_js_lines = ['// auto-embedded images from facts.json']
    pi = facts.get('persona_image')
    if pi:
        uri = b64_image(pi)
        if uri:
            img_js_lines.append(f'window.__personaImage = "{uri}";')
    for exp in (facts.get('experience') or []):
        logo = (exp.get('logo') or '')
        if logo:
            slug = re.sub(r'[^a-z0-9]', '_', exp.get('company', 'co').lower())
            uri = b64_image(logo)
            if uri:
                img_js_lines.append(f'window.__logo_{slug} = "{uri}";')
    for win in (facts.get('wins') or []):
        logo = (win.get('logo') or '')
        if logo:
            slug = re.sub(r'[^a-z0-9]', '_', win.get('event', 'evt').lower())[:24]
            uri = b64_image(logo)
            if uri:
                img_js_lines.append(f'window.__logo_{slug} = "{uri}";')
    shell = shell.replace('/*IMGS*/', '\n'.join(img_js_lines), 1)

    # ── Scenes and score ──
    scenes_js = Path(args.scenes).read_text(encoding='utf-8')
    score_js  = Path(args.score).read_text(encoding='utf-8')
    shell = shell.replace('/*SCENES*/', scenes_js, 1)
    shell = shell.replace('/*SCORE*/',  score_js,  1)

    # ── Write output ──
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(shell, encoding='utf-8')

    size_kb = out.stat().st_size / 1024
    print(f'[build] ✓ {out}  ({size_kb:.0f} KB)')
    if size_kb > 30 * 1024:
        print(f'[build] ⚠ file is over 30 MB — fonts may be too large; run fonts.py --trim')

if __name__ == '__main__':
    main()
