#!/usr/bin/env node
// toolkit/stills.js — render contact sheet + overlap/overflow checker
//
// Usage:
//   node toolkit/stills.js <reel.html> [--out <dir>] [--name <slug>] [--beats b1,b2,...]
//
// Default beat list: start+0.3, mid, end−0.3 for each scene (from __meta),
// plus frame 0 and the last frame.
// Contact sheet: 3×4 grid of 640×360 tiles, numbered with time + scene name.
// Prints any overlap/overflow issues found.

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dir = dirname(fileURLToPath(import.meta.url));

const args    = process.argv.slice(2);
const htmlPath = args[0];
if (!htmlPath) { console.error('Usage: node toolkit/stills.js <reel.html>'); process.exit(1); }

const get = (flag, def) => { const i = args.indexOf(flag); return i >= 0 ? args[i+1] : def; };
const outDir = get('--out', 'out');
const slug   = get('--name', 'reel');
const beatsArg = get('--beats', null);
mkdirSync(join(outDir, 'stills'), { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[stills page error]', e.message));

  await page.goto('file://' + resolve(htmlPath));
  await page.waitForFunction(() => window.__ready instanceof Promise ? window.__ready : Promise.resolve());
  await page.evaluate(() => window.__ready);

  const meta = await page.evaluate(() => window.__meta || { DUR: 60, FPS: 30, BPM: 120, scenes: [] });
  const { DUR, FPS = 30, BPM = 120, scenes = [] } = meta;
  const B = 60 / BPM;

  // build list of times to capture
  let times = [];
  if (beatsArg) {
    times = beatsArg.split(',').map(b => parseFloat(b) * B);
  } else {
    times.push(0); // frame 0
    for (const [name, b0, b1] of scenes) {
      const t0 = b0 * B, t1 = b1 * B;
      times.push(t0 + 0.3, (t0 + t1) / 2, Math.max(t0, t1 * B - 0.3));
    }
    times.push(DUR - 0.1); // last frame
  }
  times = [...new Set(times.map(t => parseFloat(t.toFixed(3))))].sort((a, b) => a - b).filter(t => t >= 0 && t <= DUR);

  console.log(`[stills] capturing ${times.length} frames…`);

  // enable debug mode on the page
  await page.evaluate(() => { window.__boxes = []; });

  const stills = [];
  const issues = [];

  for (const t of times) {
    // clear box registry
    await page.evaluate(() => { window.__boxes = []; });

    const result = await page.evaluate(async (t) => {
      window.__render(t);
      const canvas = document.querySelector('canvas');
      const W = canvas.width, H = canvas.height;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const boxes = window.__boxes || [];
      const scene = window.__currentScene || '';
      return { dataUrl, boxes, W, H, scene };
    }, t);

    const label = `${t.toFixed(2)}s ${result.scene}`;
    const fname = `${String(Math.round(t * 100)).padStart(5, '0')}_${result.scene || 'frame'}.jpg`;
    const fpath = join(outDir, 'stills', fname);
    writeFileSync(fpath, Buffer.from(result.dataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
    stills.push({ t, label, fname, fpath, boxes: result.boxes, W: result.W, H: result.H });

    // overlap + overflow check
    const { boxes, W, H } = result;
    const safeX = W * 0.05, safeY = H * 0.05, safeX2 = W * 0.95, safeY2 = H * 0.95;

    for (const b of boxes) {
      // safe area
      if (b.x < safeX || b.y < safeY || b.x + b.w > safeX2 || b.y + b.h > safeY2) {
        issues.push(`OVERFLOW  ${t.toFixed(2)}s [${result.scene}] "${b.text.slice(0, 30)}" outside 5% safe area`);
      }
    }

    // pairwise overlap
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        const ix = Math.max(0, Math.min(a.x+a.w, b.x+b.w) - Math.max(a.x, b.x));
        const iy = Math.max(0, Math.min(a.y+a.h, b.y+b.h) - Math.max(a.y, b.y));
        const overlap = ix * iy;
        const smaller = Math.min(a.w*a.h, b.w*b.h);
        if (smaller > 0 && overlap / smaller > 0.10) {
          issues.push(`OVERLAP   ${t.toFixed(2)}s [${result.scene}] "${a.text.slice(0,20)}" × "${b.text.slice(0,20)}"`);
        }
      }
    }

    console.log(`  ${label}`);
  }

  await browser.close();

  // build contact sheet (3 columns, N rows)
  buildContactSheet(stills, outDir, slug);

  // print issues
  if (issues.length === 0) {
    console.log('[stills] ✓ no overlaps or overflows detected');
  } else {
    console.log(`\n[stills] ⚠ ${issues.length} issue(s) found:\n`);
    issues.forEach(i => console.log(' ', i));
    console.log('');
  }
}

function buildContactSheet(stills, outDir, slug) {
  // use ffmpeg to tile the stills into a contact sheet
  if (stills.length === 0) return;
  const cols = 3;
  const rows = Math.ceil(stills.length / cols);
  const tileW = 960, tileH = 540;

  // build ffmpeg filter_complex for tiling
  const inputs = stills.slice(0, cols * rows).map(s => `-i ${s.fpath}`).join(' ');
  const maps   = stills.slice(0, cols * rows).map((_, i) => `[${i}:v]scale=${tileW}:${tileH}[t${i}]`).join('; ');
  const layout = stills.slice(0, cols * rows).map((s, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    return `${col * tileW}_${row * tileH}`;
  }).join('|');
  const inputs2 = stills.slice(0, cols * rows).map((_, i) => `[t${i}]`).join('');
  const outPath = join(outDir, slug + '-stills.jpg');

  const cmd = `ffmpeg -y ${inputs} -filter_complex "${maps}; ${inputs2}xstack=inputs=${Math.min(stills.length, cols*rows)}:layout=${layout}[out]" -map [out] -q:v 3 ${outPath}`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`[stills] contact sheet → ${outPath}`);
  } catch (e) {
    console.warn('[stills] could not build contact sheet (ffmpeg error) — individual stills are in', join(outDir, 'stills'));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
