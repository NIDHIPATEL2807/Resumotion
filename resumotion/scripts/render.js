#!/usr/bin/env node
// toolkit/render.js — Playwright → chunked frames → ffmpeg MP4
//
// Usage:
//   node toolkit/render.js <reel.html> [options]
//
// Options:
//   --out <dir>          output directory (default: out/)
//   --name <slug>        output filename slug (default: reel)
//   --from <frame>       start frame (resume support)
//   --to <frame>         end frame
//   --chunk <n>          frames per chunk (default: 400)
//   --fps <n>            frames per second (default: from __meta or 30)
//   --preset master|social|both   encode preset (default: both)
//   --no-audio           skip audio extraction
//   --stills-only        render stills contact sheet only (delegates to stills.js)

import { chromium } from 'playwright';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const htmlPath = args[0];
if (!htmlPath) { console.error('Usage: node toolkit/render.js <reel.html> [options]'); process.exit(1); }

const get = (flag, def) => { const i = args.indexOf(flag); return i >= 0 ? args[i+1] : def; };
const has = flag => args.includes(flag);

const outDir   = get('--out', 'out');
const slug     = get('--name', 'reel');
const fromArg  = parseInt(get('--from', '0'), 10);
const toArg    = get('--to', null);
const chunkSz  = parseInt(get('--chunk', '400'), 10);
const fpsArg   = get('--fps', null);
const preset   = get('--preset', 'both');
const noAudio  = has('--no-audio');
const stillsOnly = has('--stills-only');

if (stillsOnly) {
  // delegate
  const r = spawnSync('node', [join(__dir, 'stills.js'), htmlPath, '--out', outDir, '--name', slug], { stdio: 'inherit' });
  process.exit(r.status);
}

const framesDir = join(outDir, 'frames');
mkdirSync(framesDir, { recursive: true });

// ─── Check deps ───────────────────────────────────────────────────────────────

function checkDep(cmd, name, install) {
  try { execSync(`${cmd} -version`, { stdio: 'ignore' }); }
  catch { console.error(`[render] ✗ ${name} not found. ${install}`); process.exit(1); }
}
checkDep('ffmpeg', 'ffmpeg', 'Install: brew install ffmpeg / winget install ffmpeg / apt install ffmpeg');

// ─── Browser ──────────────────────────────────────────────────────────────────

async function launchBrowser() {
  // try bundled path first (sandbox), then default
  const envPath = process.env.PLAYWRIGHT_BROWSERS_PATH;
  const opts = { headless: true };
  if (envPath) opts.executablePath = envPath;
  try {
    return await chromium.launch(opts);
  } catch {
    return await chromium.launch({ headless: true });
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────

async function main() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[page error]', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('[page console]', m.text()); });

  await page.goto('file://' + resolve(htmlPath));
  await page.waitForFunction(() => window.__ready instanceof Promise ? window.__ready : Promise.resolve());
  await page.evaluate(() => window.__ready);

  const meta = await page.evaluate(() => window.__meta || { DUR: 60, FPS: 30, BPM: 120, scenes: [] });
  const FPS  = fpsArg ? parseInt(fpsArg) : (meta.FPS || 30);
  const DUR  = meta.DUR || 60;
  const totalFrames = Math.ceil(DUR * FPS);
  const toFrame = toArg ? parseInt(toArg) : totalFrames;

  console.log(`[render] ${slug} | ${DUR}s | ${FPS}fps | ${totalFrames} frames total`);
  console.log(`[render] rendering frames ${fromArg}–${toFrame}`);

  // render frames in chunks
  let rendered = 0;
  for (let f = fromArg; f < toFrame; f += chunkSz) {
    const end = Math.min(f + chunkSz, toFrame);
    const frameNums = Array.from({ length: end - f }, (_, i) => f + i);

    // skip already-rendered frames
    const todo = frameNums.filter(n => !existsSync(join(framesDir, String(n).padStart(6, '0') + '.jpg')));
    if (todo.length === 0) { console.log(`[render] chunk ${f}–${end} already done, skipping`); continue; }

    const jpgs = await page.evaluate(async ({ frames, fps }) => {
      const out = {};
      for (const n of frames) {
        window.__render(n / fps);
        const canvas = document.querySelector('canvas');
        out[n] = canvas.toDataURL('image/jpeg', 0.93);
      }
      return out;
    }, { frames: todo, fps: FPS });

    for (const [n, dataUrl] of Object.entries(jpgs)) {
      const b64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
      writeFileSync(join(framesDir, String(n).padStart(6, '0') + '.jpg'), Buffer.from(b64, 'base64'));
    }
    rendered += todo.length;
    const pct = ((f + chunkSz - fromArg) / (toFrame - fromArg) * 100).toFixed(0);
    console.log(`[render] ${Math.min(f + chunkSz, toFrame)}/${toFrame} frames (${pct}%)`);
  }

  console.log(`[render] ${rendered} new frames written`);

  // audio
  if (!noAudio) {
    console.log('[render] exporting audio…');
    const wavB64 = await page.evaluate(async () => window.__audio ? window.__audio() : null);
    if (wavB64) {
      const wavPath = join(outDir, slug + '.wav');
      writeFileSync(wavPath, Buffer.from(wavB64.replace(/^data:audio\/wav;base64,/, ''), 'base64'));
      console.log(`[render] audio → ${wavPath}`);
    } else {
      console.warn('[render] no __audio() found — video will be silent');
    }
  }

  await browser.close();

  // encode
  if (fromArg === 0 && !toArg) {
    encode(outDir, slug, FPS, DUR, preset, noAudio);
  } else {
    console.log('[render] partial render — skipping encode. Run again without --from/--to to encode.');
  }
}

function encode(outDir, slug, fps, dur, preset, noAudio) {
  const framesPattern = join(outDir, 'frames', '%06d.jpg');
  const wavPath = join(outDir, slug + '.wav');
  const hasAudio = !noAudio && existsSync(wavPath);

  const encodeOne = (outPath, crf, tuneFlag) => {
    const audioArgs = hasAudio ? ['-i', wavPath] : [];
    const cmd = [
      'ffmpeg', '-y',
      '-framerate', fps,
      '-i', framesPattern,
      ...audioArgs,
      '-c:v', 'libx264',
      '-crf', crf,
      ...(tuneFlag ? ['-tune', tuneFlag] : []),
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      ...(hasAudio ? ['-c:a', 'aac', '-b:a', '256k', '-shortest'] : []),
      outPath
    ];
    console.log(`[encode] → ${outPath}`);
    execSync(cmd.join(' '), { stdio: 'inherit' });

    // verify duration
    const probe = spawnSync('ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_format', outPath], { encoding: 'utf8' });
    if (probe.stdout) {
      const info = JSON.parse(probe.stdout);
      const actual = parseFloat(info.format?.duration || '0');
      if (Math.abs(actual - dur) > 0.5) {
        console.warn(`[encode] ⚠ duration mismatch: expected ${dur}s, got ${actual.toFixed(2)}s`);
      }
    }

    // size check
    const { size } = require('fs').statSync(outPath);
    const mb = size / 1024 / 1024;
    console.log(`[encode] ${outPath} — ${mb.toFixed(1)} MB`);
    if (mb > 100) console.warn(`[encode] ⚠ > 100 MB — too large for GitHub`);
    if (mb > 30)  console.warn(`[encode] ⚠ > 30 MB — too large for chat upload (social cut will re-encode)`);
    return mb;
  };

  if (preset === 'master' || preset === 'both') {
    encodeOne(join(outDir, slug + '-master.mp4'), 20, null);
  }
  if (preset === 'social' || preset === 'both') {
    // detect calm vs textured from theme (heuristic: no grain = stillimage)
    const socialTune = existsSync(join(outDir, slug + '-master.mp4')) ? 'grain' : 'stillimage';
    const socialOut = join(outDir, slug + '-social.mp4');
    // scale to 1280×720 for social
    const cmd = [
      'ffmpeg', '-y',
      '-framerate', fps,
      '-i', framesPattern,
      ...(existsSync(wavPath) ? ['-i', wavPath] : []),
      '-vf', 'scale=1280:720',
      '-c:v', 'libx264', '-crf', 25,
      '-tune', socialTune,
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      ...(existsSync(wavPath) ? ['-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
      socialOut
    ];
    console.log(`[encode] → ${socialOut} (social)`);
    execSync(cmd.join(' '), { stdio: 'inherit' });
  }
}

main().catch(e => { console.error(e); process.exit(1); });
