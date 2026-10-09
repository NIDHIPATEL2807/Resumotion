#!/usr/bin/env node
// toolkit/build.js — assemble a self-contained reel HTML from a template
//
// Usage:
//   node toolkit/build.js <template.html> [--out <output.html>] [--fonts <list>]
//                         [--imgs <dir>] [--glyphs <glyphs.json>]
//
// The template uses these placeholder comments:
//   /*FONTS*/   → replaced with @font-face blocks (base64 woff2)
//   /*IMGS*/    → replaced with const IMGSRC = {...} (data URIs)
//   /*GLY*/     → replaced with const GLYPHS = {...} (XY glyph paths)
//   /*QR*/      → replaced with const QR_DATA = "..." (QR matrix JSON)
//   /*HELPERS*/ → replaced with the contents of toolkit/helpers.js (inlined)
//   /*AUDIO*/   → replaced with the contents of toolkit/audio.js (inlined)

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, extname, basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dir, 'fonts');

// ─── Font embedding ───────────────────────────────────────────────────────────

const FONT_FACES = {
  'Syne-400':              { family: 'Syne',            weight: 400 },
  'Syne-600':              { family: 'Syne',            weight: 600 },
  'Syne-800':              { family: 'Syne',            weight: 800 },
  'JetBrainsMono-400':     { family: 'JetBrains Mono',  weight: 400 },
  'JetBrainsMono-700':     { family: 'JetBrains Mono',  weight: 700 },
};

function buildFontCSS(requested) {
  const names = requested || Object.keys(FONT_FACES);
  return names.map(name => {
    const meta = FONT_FACES[name];
    if (!meta) { console.warn(`[build] unknown font: ${name}`); return ''; }
    const path = join(FONTS_DIR, name + '.woff2');
    if (!existsSync(path)) { console.warn(`[build] missing font file: ${path}`); return ''; }
    const b64 = readFileSync(path).toString('base64');
    return `@font-face{font-family:'${meta.family}';font-weight:${meta.weight};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  }).join('\n');
}

// ─── Image embedding ──────────────────────────────────────────────────────────

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.webp': 'image/webp' };

function buildImgMap(imgsDir) {
  if (!imgsDir || !existsSync(imgsDir)) return 'const IMGSRC = {};';
  const entries = readdirSync(imgsDir)
    .filter(f => MIME[extname(f).toLowerCase()])
    .map(f => {
      const mime = MIME[extname(f).toLowerCase()];
      const b64  = readFileSync(join(imgsDir, f)).toString('base64');
      const key  = basename(f, extname(f)).replace(/[^a-z0-9_]/gi, '_');
      return `  ${JSON.stringify(key)}: "data:${mime};base64,${b64}"`;
    });
  return `const IMGSRC = {\n${entries.join(',\n')}\n};`;
}

// ─── Helpers / Audio inlining ─────────────────────────────────────────────────

function inlineModule(path) {
  let src = readFileSync(path, 'utf8');
  // strip ES module export keywords so it can be inlined in a <script> tag
  src = src.replace(/^export const /gm, 'const ');
  src = src.replace(/^export function /gm, 'function ');
  src = src.replace(/^export default /gm, 'const _default = ');
  return src;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const templatePath = args[0];
if (!templatePath) {
  console.error('Usage: node toolkit/build.js <template.html> [--out out.html] [--fonts f1,f2] [--imgs dir] [--glyphs glyphs.json]');
  process.exit(1);
}

const outPath  = args[args.indexOf('--out')   + 1] || templatePath.replace('.html', '.built.html');
const fontsArg = args[args.indexOf('--fonts') + 1];
const imgsDir  = args[args.indexOf('--imgs')  + 1];
const glyphsPath = args[args.indexOf('--glyphs') + 1];

const requested = fontsArg ? fontsArg.split(',').map(s => s.trim()) : null;

let html = readFileSync(templatePath, 'utf8');

html = html.replace('/*FONTS*/', buildFontCSS(requested));
html = html.replace('/*IMGS*/', buildImgMap(imgsDir));
html = html.replace('/*HELPERS*/', inlineModule(join(__dir, 'helpers.js')));
html = html.replace('/*AUDIO*/', inlineModule(join(__dir, 'audio.js')));

if (glyphsPath && existsSync(glyphsPath)) {
  html = html.replace('/*GLY*/', `const GLYPHS = ${readFileSync(glyphsPath, 'utf8')};`);
} else {
  html = html.replace('/*GLY*/', 'const GLYPHS = {};');
}

html = html.replace('/*QR*/', 'const QR_DATA = null;');

writeFileSync(outPath, html);
const size = statSync(outPath).size;
console.log(`[build] → ${outPath} (${(size/1024).toFixed(0)} KB)`);
if (size > 3 * 1024 * 1024) console.warn(`[build] ⚠ file > 3 MB — consider fewer font weights`);
