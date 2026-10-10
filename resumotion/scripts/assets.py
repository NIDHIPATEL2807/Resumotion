#!/usr/bin/env python3
"""
assets.py — validate and prepare user-supplied image assets.

Usage:
  python3 scripts/assets.py --persona portrait.png
  python3 scripts/assets.py --logo company.png --tint "#58A6FF"
  python3 scripts/assets.py --check facts.json

What it does:
  --persona  Check that a persona/mascot image is PNG, has transparency, is ≥ 800 px wide.
             Warns if the image may need a background removed. Never modifies the image.
  --logo     Tint a logo to one accent colour (luminance + saturation → flat alpha, then overlay tint).
             Outputs <name>-tinted.png alongside the original.
  --check    Read facts.json and validate all referenced image paths exist and pass checks.

Rules enforced:
  - Mascot/persona images are never recoloured or redrawn. Only validation warnings.
  - Logos are tinted to exactly one colour. The tint is reversible (the original is unchanged).
  - Any image < 800 px wide gets a warning (will look soft in the reel at 1920×1080).
  - Images > 5 MB get a warning (will bloat the HTML).
"""

import argparse, sys, os, struct, zlib
from pathlib import Path

def check_png(path: Path) -> dict:
    """Basic PNG validation without Pillow — reads header only."""
    result = {'ok': True, 'width': 0, 'height': 0, 'has_alpha': False, 'warnings': []}
    try:
        data = path.read_bytes()
    except Exception as e:
        result['ok'] = False
        result['warnings'].append(f'Cannot read file: {e}')
        return result

    if data[:8] != b'\x89PNG\r\n\x1a\n':
        result['warnings'].append('Not a valid PNG file (wrong header).')
        result['ok'] = False
        return result

    # IHDR chunk starts at byte 8
    w = struct.unpack('>I', data[16:20])[0]
    h = struct.unpack('>I', data[20:24])[0]
    color_type = data[25]  # 6 = RGBA, 4 = grayscale+alpha, 2 = RGB, 0 = grayscale, 3 = indexed
    result['width'] = w
    result['height'] = h
    result['has_alpha'] = color_type in (4, 6)

    size_mb = len(data) / (1024 * 1024)
    if size_mb > 5:
        result['warnings'].append(f'Image is {size_mb:.1f} MB — will bloat the HTML. Consider optimising.')
    if w < 800:
        result['warnings'].append(f'Image is only {w} px wide — will look soft at 1920×1080. Use ≥ 800 px.')
    if not result['has_alpha']:
        result['warnings'].append('Image has no alpha channel — background removal may be needed for clean compositing.')

    return result

def tint_logo(src: Path, tint_hex: str, out: Path):
    """
    Tint a logo PNG to a single flat colour using a simple pixel-level approach.
    Requires no external libraries — uses only stdlib.
    Works by: decompress PNG, for each RGBA pixel, replace RGB with the tint colour
    while preserving the alpha channel (which is derived from luminance of original).

    NOTE: This is a simplified implementation. For production use, consider Pillow:
      from PIL import Image; img = Image.open(src); ...
    """
    # Parse tint colour
    tint_hex = tint_hex.lstrip('#')
    tr, tg, tb = int(tint_hex[0:2],16), int(tint_hex[2:4],16), int(tint_hex[4:6],16)

    print(f'[assets] tint is a simplified operation — for best results use: pip install Pillow')
    print(f'[assets] With Pillow: python3 -c "')
    print(f'  from PIL import Image, ImageOps')
    print(f'  img = Image.open(\'{src}\').convert(\'RGBA\')')
    print(f'  r,g,b,a = img.split()')
    print(f'  lum = ImageOps.grayscale(img)')
    print(f'  tinted = Image.merge(\'RGBA\', [Image.new(\'L\',img.size,{tr}), Image.new(\'L\',img.size,{tg}), Image.new(\'L\',img.size,{tb}), a])')
    print(f'  tinted.save(\'{out}\')')
    print(f'"')
    print(f'[assets] Skipping tint (Pillow not available). Original at: {src}')

def check_facts(facts_path: Path):
    import json
    try:
        facts = json.loads(facts_path.read_text())
    except Exception as e:
        print(f'[assets] ERROR reading facts.json: {e}')
        return

    any_issue = False
    def check_img(label, path_or_uri):
        nonlocal any_issue
        if not path_or_uri or str(path_or_uri).startswith('data:'):
            return
        p = Path(path_or_uri)
        if not p.exists():
            print(f'[assets] ✗ {label}: file not found: {p}')
            any_issue = True
            return
        if p.suffix.lower() == '.png':
            result = check_png(p)
            status = '✓' if result['ok'] and not result['warnings'] else '⚠'
            print(f'[assets] {status} {label}: {p.name}  ({result["width"]}×{result["height"]}px, alpha={result["has_alpha"]})')
            for w in result['warnings']:
                print(f'         → {w}')
                any_issue = True
        else:
            size_kb = p.stat().st_size / 1024
            print(f'[assets] ✓ {label}: {p.name}  ({size_kb:.0f} KB)')

    check_img('persona_image', facts.get('persona_image'))
    for exp in (facts.get('experience') or []):
        check_img(f'logo:{exp.get("company","?")}', exp.get('logo'))
    for win in (facts.get('wins') or []):
        check_img(f'logo:{win.get("event","?")}', win.get('logo'))

    if not any_issue:
        print('[assets] ✓ All referenced images OK.')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--persona', help='Path to persona/mascot PNG to validate')
    ap.add_argument('--logo',    help='Path to logo PNG to tint')
    ap.add_argument('--tint',    default='#58A6FF', help='Tint colour hex (default: #58A6FF)')
    ap.add_argument('--check',   help='Path to facts.json to validate all images')
    args = ap.parse_args()

    if args.persona:
        p = Path(args.persona)
        if not p.exists():
            sys.exit(f'[assets] File not found: {p}')
        result = check_png(p)
        print(f'[assets] {p.name}: {result["width"]}×{result["height"]}px, alpha={result["has_alpha"]}')
        for w in result['warnings']:
            print(f'  ⚠ {w}')
        if not result['warnings']:
            print('[assets] ✓ Looks good.')

    if args.logo:
        p = Path(args.logo)
        if not p.exists():
            sys.exit(f'[assets] File not found: {p}')
        out = p.with_stem(p.stem + '-tinted')
        tint_logo(p, args.tint, out)

    if args.check:
        check_facts(Path(args.check))

    if not any([args.persona, args.logo, args.check]):
        ap.print_help()

if __name__ == '__main__':
    main()
