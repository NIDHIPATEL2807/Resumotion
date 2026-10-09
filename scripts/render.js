#!/usr/bin/env node
// render.js — Playwright → frames → ffmpeg → MP4
// Usage:
//   node scripts/render.js examples/nidhi/script.json
//   node scripts/render.js examples/nidhi/script.json --stills-only
//   node scripts/render.js examples/nidhi/script.json --from 0 --to 60
//   node scripts/render.js examples/nidhi/script.json --out out/custom.mp4

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import { chromium } from 'playwright';

// resolve ffmpeg — check PATH first, fall back to known winget install location
function resolveFfmpeg() {
  try { execSync('ffmpeg -version', { stdio: 'pipe' }); return 'ffmpeg'; } catch {}
  const wingetPath = path.join(
    process.env.LOCALAPPDATA ?? '',
    'Microsoft', 'WinGet', 'Packages',
    'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe'
  );
  if (fs.existsSync(wingetPath)) {
    const bins = fs.readdirSync(wingetPath);
    for (const d of bins) {
      const ff = path.join(wingetPath, d, 'bin', 'ffmpeg.exe');
      if (fs.existsSync(ff)) return ff;
    }
  }
  throw new Error('ffmpeg not found — run: node scripts/check-deps.js');
}
const FFMPEG = resolveFfmpeg();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const scriptArg  = args.find(a => !a.startsWith('--')) ?? 'examples/nidhi/script.json';
const stillsOnly = args.includes('--stills-only');
const fromIdx = args.indexOf('--from');
const toIdx   = args.indexOf('--to');
const outIdx2 = args.indexOf('--out');
const fromArg = fromIdx >= 0 ? args[fromIdx + 1] : null;
const toArg   = toIdx   >= 0 ? args[toIdx   + 1] : null;
const outArg  = outIdx2 >= 0 ? args[outIdx2  + 1] : null;

const scriptPath  = path.resolve(ROOT, scriptArg);
const script      = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const FPS         = 30;
const W           = 1920;
const H           = 1080;

// compute total duration from script
function totalDuration(sc) {
  const spb = 60 / sc.bpm;
  return sc.scenes.reduce((s, x) => s + x.beats * spb, 0);
}
const totalSec = totalDuration(script);

// frame range
const frameFrom = fromArg != null ? parseInt(fromArg) : 0;
const frameTo   = toArg   != null ? parseInt(toArg)   : Math.floor(totalSec * FPS);

const outDir = path.resolve(ROOT, 'out');
fs.mkdirSync(outDir, { recursive: true });

// build preview HTML first (always fresh)
console.log('▸ building preview HTML…');
execSync(`node scripts/build-preview.js ${scriptArg}`, { cwd: ROOT, stdio: 'inherit' });

const previewPath = path.resolve(ROOT, 'out/preview.html');
const htmlUrl     = `file://${previewPath.replace(/\\/g, '/')}`;

// output paths
const nameSlug = path.basename(path.dirname(scriptPath));
const outMp4   = outArg ?? path.join(outDir, `reel-${nameSlug}-16x9.mp4`);
const outSocial = outMp4.replace('.mp4', '-social.mp4');
const outSheet  = outMp4.replace('.mp4', '-framesheet.jpg');
const outWav    = path.join(outDir, `audio-${nameSlug}.wav`);

// ── stills-only (Gate 2 preview) ─────────────────────────────────────────────
async function renderStills() {
  console.log('\n▸ Gate 2: rendering 3 stills per scene…');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: W, height: H } });

  await page.goto(htmlUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.seek !== undefined, { timeout: 10000 });
  await page.waitForTimeout(500); // fonts settle

  const spb = 60 / script.bpm;
  let cursor = 0;
  const stillPaths = [];

  for (let i = 0; i < script.scenes.length; i++) {
    const scene = script.scenes[i];
    const startSec = cursor * spb;
    const durSec   = scene.beats * spb;
    const mids     = [0.15, 0.5, 0.75].map(f => startSec + durSec * f);

    for (let j = 0; j < mids.length; j++) {
      const t   = mids[j];
      const out = path.join(outDir, `still-${i.toString().padStart(2,'0')}-${scene.type}-${j}.png`);
      await page.evaluate(t => window.seek(t), t);
      await page.waitForTimeout(80);
      const canvas = await page.$('canvas');
      await canvas.screenshot({ path: out });
      stillPaths.push(out);
      process.stdout.write(`  ✓ scene ${i} (${scene.type}) @ ${t.toFixed(2)}s\n`);
    }
    cursor += scene.beats;
  }

  await browser.close();
  console.log(`\n✓ stills written to out/  (${stillPaths.length} frames)`);
  console.log('  Review stills, then run without --stills-only to produce MP4.\n');
}

// ── framesheet ────────────────────────────────────────────────────────────────
function buildFrameSheet(framePaths) {
  // 5-column grid using ffmpeg tile filter
  const listFile = path.join(outDir, '_framelist.txt');
  fs.writeFileSync(listFile, framePaths.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
  const cols = 5;
  const rows = Math.ceil(framePaths.length / cols);
  try {
    execSync(
      `"${FFMPEG}" -y -f concat -safe 0 -i "${listFile}" -vf "scale=384:-1,tile=${cols}x${rows}" -frames:v 1 "${outSheet}"`,
      { stdio: 'pipe' }
    );
    console.log(`  ✓ framesheet → ${outSheet}`);
  } catch (e) {
    console.log('  ⚠ framesheet failed (non-fatal):', e.message.slice(0, 80));
  }
  fs.unlinkSync(listFile);
}

// ── audio export via OfflineAudioContext ──────────────────────────────────────
async function exportAudio(page) {
  console.log('\n▸ exporting audio via OfflineAudioContext…');

  const wavBase64 = await page.evaluate(async (totalSec) => {
    // score.js is already loaded into the page — call buildScore directly
    const sampleRate = 44100;
    const offCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * totalSec), sampleRate);

    // buildScore is registered on window by the inlined score.js
    if (!window.__buildScore) return null;
    await window.__buildScore(offCtx, totalSec);

    const buffer = await offCtx.startRendering();
    // buffer → interleaved 16-bit PCM WAV
    const numCh = buffer.numberOfChannels;
    const numSamples = buffer.length;
    const pcm = new Int16Array(numSamples * numCh);
    for (let ch = 0; ch < numCh; ch++) {
      const chData = buffer.getChannelData(ch);
      for (let i = 0; i < numSamples; i++) {
        pcm[i * numCh + ch] = Math.max(-32768, Math.min(32767, Math.round(chData[i] * 32767)));
      }
    }
    // build WAV header
    const hdr = new ArrayBuffer(44);
    const v = new DataView(hdr);
    const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
    const byteRate = sampleRate * numCh * 2;
    writeStr(0, 'RIFF');
    v.setUint32(4, 36 + pcm.byteLength, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, numCh, true);
    v.setUint32(24, sampleRate, true);
    v.setUint32(28, byteRate, true);
    v.setUint16(32, numCh * 2, true);
    v.setUint16(34, 16, true);
    writeStr(36, 'data');
    v.setUint32(40, pcm.byteLength, true);
    const wav = new Uint8Array(hdr.byteLength + pcm.byteLength);
    wav.set(new Uint8Array(hdr), 0);
    wav.set(new Uint8Array(pcm.buffer), hdr.byteLength);
    // return as base64
    let bin = '';
    for (let i = 0; i < wav.length; i++) bin += String.fromCharCode(wav[i]);
    return btoa(bin);
  }, totalSec);

  if (!wavBase64) {
    console.log('  ⚠ __buildScore not found on window — audio skipped');
    return false;
  }
  fs.writeFileSync(outWav, Buffer.from(wavBase64, 'base64'));
  console.log(`  ✓ audio → ${outWav}`);
  return true;
}

// ── full render ───────────────────────────────────────────────────────────────
async function renderFull() {
  console.log(`\n▸ rendering frames ${frameFrom}–${frameTo} @ ${FPS}fps (${((frameTo - frameFrom) / FPS).toFixed(1)}s)…`);

  const browser = await chromium.launch({ headless: true });
  const page    = await browser.newPage({ viewport: { width: W, height: H } });

  await page.goto(htmlUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.seek !== undefined, { timeout: 10000 });
  await page.waitForTimeout(600); // fonts settle

  // export audio while browser is open
  const hasAudio = await exportAudio(page);

  // spawn ffmpeg stdin pipe for frames
  // CRF 20 = broadcast quality master
  const ffArgs = [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-i', 'pipe:0',
    ...(hasAudio ? ['-i', outWav] : []),
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    ...(hasAudio ? ['-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    outMp4,
  ];

  const ff = spawn(FFMPEG, ffArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
  ff.stderr.on('data', d => {
    const line = d.toString();
    if (line.includes('frame=') || line.includes('error') || line.includes('Error')) {
      process.stdout.write('\r  ' + line.trim().slice(0, 80));
    }
  });

  const canvas   = await page.$('canvas');
  const total    = frameTo - frameFrom;
  const sheetSampleFrames = [];

  for (let f = frameFrom; f <= frameTo; f++) {
    const t = f / FPS;
    await page.evaluate(t => window.seek(t), t);
    const buf = await canvas.screenshot({ type: 'png' });
    ff.stdin.write(buf);

    // collect 10 evenly-spaced frames for framesheet
    if (total > 0 && (f - frameFrom) % Math.floor(total / 10) === 0 && sheetSampleFrames.length < 10) {
      const fp = path.join(outDir, `_sheet_${f}.png`);
      fs.writeFileSync(fp, buf);
      sheetSampleFrames.push(fp);
    }

    if (f % 30 === 0) {
      const pct = (((f - frameFrom) / total) * 100).toFixed(0);
      process.stdout.write(`\r  frame ${f}/${frameTo}  (${pct}%)`);
    }
  }

  ff.stdin.end();
  await new Promise((res, rej) => {
    ff.on('close', code => code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`)));
  });
  process.stdout.write('\n');

  // framesheet
  if (sheetSampleFrames.length > 0) {
    buildFrameSheet(sheetSampleFrames);
    sheetSampleFrames.forEach(f => { try { fs.unlinkSync(f); } catch {} });
  }

  // social encode: CRF 26, scale to 1280x720
  if (!fromArg && !toArg) {
    console.log('▸ encoding social cut (1280×720, CRF 26)…');
    try {
      execSync(
        `"${FFMPEG}" -y -i "${outMp4}" -vf scale=1280:720 -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -movflags +faststart ${hasAudio ? '-c:a aac -b:a 128k' : ''} "${outSocial}"`,
        { stdio: 'pipe' }
      );
      console.log(`  ✓ social → ${outSocial}`);
    } catch (e) {
      console.log('  ⚠ social encode failed:', e.message.slice(0, 80));
    }
  }

  await browser.close();

  console.log(`\n✓ master → ${outMp4}`);
  if (!fromArg && !toArg) console.log(`✓ social  → ${outSocial}`);
  console.log(`✓ sheet   → ${outSheet}\n`);
}

// ── entry ─────────────────────────────────────────────────────────────────────
if (stillsOnly) {
  renderStills().catch(e => { console.error(e); process.exit(1); });
} else {
  renderFull().catch(e => { console.error(e); process.exit(1); });
}
