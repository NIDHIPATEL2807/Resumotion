#!/usr/bin/env python3
"""
fonts.py — fetch Google Fonts / @fontsource woff2 files and save them to assets/fonts/.

Usage:
  # Fetch a specific family (weight defaults to 400,700)
  python3 scripts/fonts.py --family "DM Serif Display" --weights 400
  python3 scripts/fonts.py --family "DM Sans" --weights 400,700

  # Fetch an Indic script family (gets a separate family-name prefix for canvas safety)
  python3 scripts/fonts.py --family "Noto Sans Devanagari" --weights 400,700 --indic

  # List what's already in assets/fonts/
  python3 scripts/fonts.py --list

Outputs:
  assets/fonts/<Family-Weight>.woff2  (e.g. DMSerifDisplay-400.woff2)

Then pass the filename to build.py via --fonts:
  python3 scripts/build.py ... --fonts "DMSerifDisplay-400.woff2,DMSans-400.woff2"

Canvas note: never put two different Unicode scripts under one font-family name.
Use --indic to get a separate Indic0/Indic1/... family name in the @font-face output.
"""

import argparse, base64, re, sys, urllib.request, urllib.parse, json
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
FONTS_DIR = SKILL_DIR / 'assets' / 'fonts'
FONTS_DIR.mkdir(parents=True, exist_ok=True)

FONTSOURCE_API = 'https://api.fontsource.org/v1/fonts/{id}'
GOOGLE_CSS2    = 'https://fonts.googleapis.com/css2?family={family}:wght@{weights}&display=swap'

HEADERS = {'User-Agent': 'Mozilla/5.0 (resumotion fonts.py)'}

def family_to_id(family: str) -> str:
    """Convert 'DM Serif Display' → 'dm-serif-display' (fontsource ID format)."""
    return family.lower().replace(' ', '-')

def family_to_slug(family: str) -> str:
    """Convert 'DM Serif Display' → 'DMSerifDisplay' (filename prefix)."""
    return ''.join(w.capitalize() for w in family.split())

def fetch_url(url: str, headers: dict = None) -> bytes:
    req = urllib.request.Request(url, headers=headers or HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.read()
    except Exception as e:
        sys.exit(f'[fonts] ERROR fetching {url}: {e}')

def fetch_woff2_via_fontsource(family: str, weight: int) -> bytes | None:
    """Try fontsource API first (most reliable for woff2)."""
    fid = family_to_id(family)
    api_url = FONTSOURCE_API.format(id=fid)
    try:
        data = fetch_url(api_url)
        meta = json.loads(data)
        variants = meta.get('variants', {})
        # Look for the exact weight
        var = variants.get(str(weight), {}).get('normal', {}).get('latin', {})
        woff2_url = var.get('woff2') or var.get('woff')
        if not woff2_url:
            return None
        return fetch_url(woff2_url)
    except Exception:
        return None

def fetch_woff2_via_google(family: str, weight: int) -> bytes | None:
    """Fallback: parse Google Fonts CSS2 to extract a woff2 URL."""
    try:
        css_url = GOOGLE_CSS2.format(
            family=urllib.parse.quote(family),
            weights=weight
        )
        css = fetch_url(css_url, {'User-Agent': 'Mozilla/5.0'}).decode()
        urls = re.findall(r"url\(([^)]+\.woff2)\)", css)
        if not urls:
            return None
        return fetch_url(urls[0])
    except Exception:
        return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--family',  help='Font family name (e.g. "DM Serif Display")')
    ap.add_argument('--weights', default='400,700', help='Comma-separated weights')
    ap.add_argument('--indic',   action='store_true', help='Flag as Indic script (gets Indic0/1/… family name)')
    ap.add_argument('--list',    action='store_true', help='List fonts already in assets/fonts/')
    args = ap.parse_args()

    if args.list:
        files = sorted(FONTS_DIR.glob('*.woff2'))
        if not files:
            print('[fonts] assets/fonts/ is empty.')
        for f in files:
            print(f'  {f.name}  ({f.stat().st_size / 1024:.0f} KB)')
        return

    if not args.family:
        ap.print_help()
        sys.exit(1)

    weights = [int(w.strip()) for w in args.weights.split(',')]
    slug = family_to_slug(args.family)

    for weight in weights:
        out_path = FONTS_DIR / f'{slug}-{weight}.woff2'
        if out_path.exists():
            print(f'[fonts] already exists: {out_path.name} — skipping')
            continue

        print(f'[fonts] fetching {args.family} {weight}…', end=' ', flush=True)
        data = fetch_woff2_via_fontsource(args.family, weight)
        if not data:
            data = fetch_woff2_via_google(args.family, weight)
        if not data:
            print(f'FAILED — try downloading manually from fonts.google.com')
            continue

        out_path.write_bytes(data)
        print(f'OK ({len(data) / 1024:.0f} KB) → {out_path.name}')

        if args.indic:
            print(f'[fonts] NOTE: use a separate Indic0/Indic1 family name in @font-face for this font.')
            print(f'[fonts] Example: @font-face {{ font-family: "Indic0"; src: url("..."); }}')

if __name__ == '__main__':
    main()
