#!/usr/bin/env node
// check-deps.js — run this before anything else.
// Checks Node version, ffmpeg, and Playwright Chromium.
// Prints clear install instructions if anything is missing.

import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let allGood = true;

function ok(msg)   { console.log(`  ✓ ${msg}`); }
function fail(msg) { console.log(`  ✗ ${msg}`); allGood = false; }
function info(msg) { console.log(`    ${msg}`); }

console.log('\n── resumotion dependency check ──\n');

// ── Node version ──────────────────────────────────────────────────────────
const [major] = process.versions.node.split('.').map(Number);
if (major >= 20) {
  ok(`Node ${process.versions.node}`);
} else {
  fail(`Node ${process.versions.node} — need Node 20+`);
  info('Install from https://nodejs.org or use nvm: nvm install 20');
}

// ── ffmpeg ────────────────────────────────────────────────────────────────
try {
  const ver = execSync('ffmpeg -version 2>&1', { encoding: 'utf8' }).split('\n')[0];
  ok(ver.slice(0, 60));
} catch {
  fail('ffmpeg not found');
  info('Mac:     brew install ffmpeg');
  info('Windows: winget install ffmpeg  OR  choco install ffmpeg');
  info('Linux:   sudo apt install ffmpeg');
}

// ── Playwright ────────────────────────────────────────────────────────────
try {
  require.resolve('playwright');
  ok('playwright package installed');

  // check Chromium browser binary
  try {
    execSync('node -e "require(\'playwright\').chromium.executablePath()" 2>&1', { encoding: 'utf8' });
    ok('Playwright Chromium binary present');
  } catch {
    fail('Playwright Chromium binary missing');
    info('Run: npx playwright install chromium');
  }
} catch {
  fail('playwright not installed');
  info('Run: npm install');
}

// ── result ────────────────────────────────────────────────────────────────
console.log('');
if (allGood) {
  console.log('✓ all dependencies ready — you can render\n');
} else {
  console.log('✗ fix the issues above, then re-run: node scripts/check-deps.js\n');
  process.exit(1);
}
