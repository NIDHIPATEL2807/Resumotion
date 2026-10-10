#!/usr/bin/env node
// toolkit/check-audio.js — LUFS + RMS + silence + drop checks
//
// Usage:
//   node toolkit/check-audio.js <video.mp4|audio.wav> [--xy] [--silences b0:b1,b2:b3] [--bpm 120]
//
// Returns exit code 0 if all checks pass, 1 if any fail.

import { execSync, spawnSync } from 'child_process';
import { existsSync } from 'fs';

const args   = process.argv.slice(2);
const file   = args[0];
if (!file || !existsSync(file)) { console.error(`Usage: node toolkit/check-audio.js <file>`); process.exit(1); }

const get = (flag, def) => { const i = args.indexOf(flag); return i >= 0 ? args[i+1] : def; };
const has = flag => args.includes(flag);

const xyMode    = has('--xy');
const bpm       = parseFloat(get('--bpm', '120'));
const silArg    = get('--silences', null); // e.g. "52:53,56:57"
const B         = 60 / bpm;

let pass = 0, fail = 0;

function ok  (label, msg) { console.log(`  ✓ ${label}${msg ? ' — ' + msg : ''}`); pass++; }
function warn(label, msg) { console.log(`  ⚠ ${label}${msg ? ' — ' + msg : ''}`); }
function err (label, msg) { console.log(`  ✗ ${label}${msg ? ' — ' + msg : ''}`); fail++; }

// ─── LUFS + true peak (ffmpeg loudnorm) ──────────────────────────────────────

function getLUFS(file) {
  const cmd = `ffmpeg -i "${file}" -af loudnorm=print_format=json -f null -`;
  const r = spawnSync('ffmpeg', ['-i', file, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
  const out = r.stderr || '';
  // ffmpeg prints loudnorm JSON to stderr
  const match = out.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

console.log('\n[check-audio] Integrated loudness\n');
const lufs = getLUFS(file);
if (!lufs) {
  err('LUFS', 'could not parse loudnorm output');
} else {
  const i   = parseFloat(lufs.input_i);
  const tp  = parseFloat(lufs.input_tp);
  const lra = parseFloat(lufs.input_lra);

  if (i >= -15 && i <= -13) ok('LUFS integrated', `${i.toFixed(1)} LUFS (target −14 ±1)`);
  else err('LUFS integrated', `${i.toFixed(1)} LUFS — target −14 ±1`);

  if (tp <= -1) ok('True peak', `${tp.toFixed(1)} dBTP`);
  else err('True peak', `${tp.toFixed(1)} dBTP — must be ≤ −1 dBTP`);

  console.log(`     LRA: ${lra.toFixed(1)} LU`);
}

// ─── Per-section RMS (2s windows) ────────────────────────────────────────────

console.log('\n[check-audio] Per-section RMS (2s windows)\n');

function getRMS(file) {
  const r = spawnSync('ffmpeg', ['-i', file, '-af', 'astats=metadata=1:reset=2,ametadata=print:key=lavfi.astats.Overall.RMS_level', '-f', 'null', '-'], { encoding: 'utf8' });
  const out = r.stderr || '';
  const matches = [...out.matchAll(/pts_time:([\d.]+).*?lavfi\.astats\.Overall\.RMS_level=([\d.-]+)/gs)];
  return matches.map(m => ({ t: parseFloat(m[1]), rms: parseFloat(m[2]) }));
}

const rmsData = getRMS(file);
if (rmsData.length === 0) {
  warn('RMS', 'could not parse per-section RMS');
} else {
  const firstFew = rmsData.slice(0, 3);
  const lastFew  = rmsData.slice(-3);
  const introRMS = firstFew.reduce((a, r) => a + Math.pow(10, r.rms / 20), 0) / firstFew.length;
  const bodyRMS  = rmsData.slice(2, -2).reduce((a, r) => a + Math.pow(10, r.rms / 20), 0) / Math.max(1, rmsData.length - 4);

  if (introRMS < 0.015) err('Intro volume', `RMS ≈ ${introRMS.toFixed(3)} — intro too quiet (seen in IPO Day)`);
  else ok('Intro volume', `RMS ≈ ${introRMS.toFixed(3)}`);

  if (bodyRMS > introRMS * 1.5) ok('Drop louder than intro', `body RMS ${bodyRMS.toFixed(3)} vs intro ${introRMS.toFixed(3)}`);
  else warn('Drop level', `body RMS ${bodyRMS.toFixed(3)} — should be louder than intro ${introRMS.toFixed(3)}`);

  // print table
  console.log('  t(s)    RMS level (dBFS)');
  for (const { t, rms } of rmsData) {
    const bar = '█'.repeat(Math.max(0, Math.round((rms + 60) / 2)));
    console.log(`  ${String(t.toFixed(1)).padStart(5)}   ${String(rms.toFixed(1)).padStart(6)} ${bar}`);
  }
}

// ─── Silence windows ─────────────────────────────────────────────────────────

if (silArg) {
  console.log('\n[check-audio] Silence windows\n');
  const windows = silArg.split(',').map(s => s.split(':').map(Number));

  for (const [b0, b1] of windows) {
    const t0 = b0 * B, t1 = b1 * B;
    // extract the window and measure RMS
    const r = spawnSync('ffmpeg', [
      '-i', file,
      '-ss', t0.toFixed(3), '-to', t1.toFixed(3),
      '-af', 'astats=metadata=1,ametadata=print:key=lavfi.astats.Overall.RMS_level',
      '-f', 'null', '-'
    ], { encoding: 'utf8' });
    const m = (r.stderr || '').match(/RMS_level=([\d.-]+)/);
    if (m) {
      const rms = parseFloat(m[1]);
      if (rms < -50) ok(`Silence b${b0}–b${b1}`, `${rms.toFixed(1)} dBFS`);
      else err(`Silence b${b0}–b${b1}`, `${rms.toFixed(1)} dBFS — should be below −50 dBFS (allow reverb tail)`);
    }
  }
}

// ─── XY mode (optional) ──────────────────────────────────────────────────────

if (xyMode) {
  console.log('\n[check-audio] XY balance\n');
  // measure L and R channel RMS separately in 10s windows
  const r = spawnSync('ffmpeg', ['-i', file, '-af', 'channelsplit[L][R]; [L]astats=reset=10,ametadata=print:key=lavfi.astats.RMS_level[l]; [R]astats=reset=10,ametadata=print:key=lavfi.astats.RMS_level[r]', '-f', 'null', '-'], { encoding: 'utf8' });
  const out = r.stderr || '';
  const Ls = [...out.matchAll(/\[Parsed_astats.*?pts_time:([\d.]+).*?RMS_level=([\d.-]+)/gs)].filter((_, i) => i % 2 === 0);
  const Rs = [...out.matchAll(/\[Parsed_astats.*?pts_time:([\d.]+).*?RMS_level=([\d.-]+)/gs)].filter((_, i) => i % 2 === 1);
  if (Ls.length && Rs.length) {
    console.log('  window  L (dBFS)   R (dBFS)   balance');
    for (let i = 0; i < Math.min(Ls.length, Rs.length); i++) {
      const t = Ls[i][1], l = parseFloat(Ls[i][2]), r2 = parseFloat(Rs[i][2]);
      const diff = Math.abs(l - r2);
      console.log(`  ${t.padStart(5)}s  ${l.toFixed(1).padStart(8)}  ${r2.toFixed(1).padStart(8)}  ${diff > 3 ? '⚠ imbalanced' : '✓'}`);
    }
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n[check-audio] ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
