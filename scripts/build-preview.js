#!/usr/bin/env node
// build-preview.js — script.json + theme → standalone preview.html
// Usage: node scripts/build-preview.js examples/nidhi/script.json [--out out/preview.html]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const scriptArg = args.find(a => !a.startsWith('--')) ?? 'examples/nidhi/script.json';
const outIdx = args.indexOf('--out');
const outArg = outIdx >= 0 ? args[outIdx + 1] : 'out/preview.html';

const scriptPath = path.resolve(ROOT, scriptArg);
const outPath    = path.resolve(ROOT, outArg);

const script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const themeJsonPath = path.resolve(ROOT, 'themes', script.theme, 'theme.json');
const theme  = JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));

// Collect all scene JS files needed
const sceneTypes = [...new Set(script.scenes.map(s => s.type))];

// Build inline @font-face CSS from bundled woff2 files
const fontDefs = [
  { family: 'Syne',          weight: 400, file: 'Syne-400.woff2' },
  { family: 'Syne',          weight: 600, file: 'Syne-600.woff2' },
  { family: 'Syne',          weight: 800, file: 'Syne-800.woff2' },
  { family: 'JetBrains Mono', weight: 400, file: 'JetBrainsMono-400.woff2' },
  { family: 'JetBrains Mono', weight: 700, file: 'JetBrainsMono-700.woff2' },
];

const fontCSS = fontDefs.map(({ family, weight, file }) => {
  const fp = path.join(ROOT, 'assets/fonts', file);
  if (!fs.existsSync(fp)) return '';
  const b64 = fs.readFileSync(fp).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
}).join('\n');

// Read engine source files
const engineFiles = ['easing.js', 'prng.js', 'fx.js', 'seek.js', 'timeline.js', 'player.js'];
const engineSrc = engineFiles.map(f => {
  const src = fs.readFileSync(path.join(ROOT, 'engine', f), 'utf8');
  return `<!-- engine/${f} -->\n<script type="module">\n${src}\n</script>`;
}).join('\n');

// Read audio engine + score (inlined, imports stripped, buildScore exposed on window)
function stripImports(src) {
  return src.replace(/^import[^\n]+\n/gm, '').replace(/^export /gm, '');
}
const synthSrc  = stripImports(fs.readFileSync(path.join(ROOT, 'engine/audio/synth.js'), 'utf8'));
const mixerSrc  = stripImports(fs.readFileSync(path.join(ROOT, 'engine/audio/mixer.js'), 'utf8'));
const scoreRaw  = stripImports(fs.readFileSync(path.join(ROOT, 'themes', script.theme, 'score.js'), 'utf8'));
// expose buildScore on window for render.js audio export
const scoreSrc  = synthSrc + '\n\n' + mixerSrc + '\n\n' + scoreRaw + '\nwindow.__buildScore = buildScore;\n';

// Read scene renderers
const sceneSrc = sceneTypes.map(type => {
  const fp = path.join(ROOT, 'themes', script.theme, 'scenes', `${type}.js`);
  if (!fs.existsSync(fp)) return `<!-- no renderer for ${type} -->`;
  return `<!-- scene: ${type} -->\n${fs.readFileSync(fp, 'utf8')}`;
}).join('\n\n');

const W = 1920, H = 1080;
const scriptJson = JSON.stringify(script);
const themeJson  = JSON.stringify(theme);

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>resumotion preview — ${script.theme}</title>
<style>
${fontCSS}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
  canvas { max-width: 100vw; max-height: 100vh; }
  #controls { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 10; }
  button { background: #FF6B2B; color: #000; border: none; padding: 8px 18px; font-family: 'JetBrains Mono', monospace; font-size: 13px; cursor: pointer; }
  #time { color: #7a726b; font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 8px; }
</style>
</head>
<body>
<canvas id="c" width="${W}" height="${H}"></canvas>
<div id="controls">
  <button id="btnPlay">▶ PLAY</button>
  <button id="btnSound">♪ SOUND ON</button>
  <span id="time">0.00s</span>
</div>

<script type="module">
// ── injected data ──────────────────────────────────────────────────────────
const SCRIPT = ${scriptJson};
const THEME  = ${themeJson};
const W = ${W}, H = ${H}, FPS = 30;

// ── seek API ──────────────────────────────────────────────────────────────
let _seekFn = null;
window.__registerSeek = fn => { _seekFn = fn; };
window.seek = t => { if (_seekFn) _seekFn(t); };

// ── easing ────────────────────────────────────────────────────────────────
${fs.readFileSync(path.join(ROOT, 'engine/easing.js'), 'utf8').replace(/^export /gm, '')}

// ── prng ──────────────────────────────────────────────────────────────────
${fs.readFileSync(path.join(ROOT, 'engine/prng.js'), 'utf8').replace(/^export /gm, '')}

// ── fx ────────────────────────────────────────────────────────────────────
${fs.readFileSync(path.join(ROOT, 'engine/fx.js'), 'utf8').replace(/^import[^\n]+\n/gm, '').replace(/^export /gm, '')}

// ── timeline ─────────────────────────────────────────────────────────────
${fs.readFileSync(path.join(ROOT, 'engine/timeline.js'), 'utf8').replace(/^export /gm, '')}

// ── audio (synth + mixer + score) ────────────────────────────────────────
${scoreSrc}

// ── scene renderers ───────────────────────────────────────────────────────
const _renderers = {};
${sceneTypes.map(type => {
  const fp = path.join(ROOT, 'themes', script.theme, 'scenes', `${type}.js`);
  if (!fs.existsSync(fp)) return `// no renderer: ${type}`;
  const src = fs.readFileSync(fp, 'utf8')
    .replace(/^import[^\n]+\n/gm, '')
    .replace(/export default function render/, `_renderers['${type}'] = function render`)
    .replace(/^export /gm, '');
  // wrap in block scope so file-level consts don't collide across scene files
  return `// scene: ${type}\n{\n${src}\n}`;
}).join('\n\n')}

// ── player ────────────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const tl = makeTimeline(SCRIPT.bpm);

// add scene_duration to each scene's data
const sceneMap = tl.buildSceneMap(SCRIPT.scenes).map(s => ({
  ...s,
  data: { ...s.data, scene_duration: s.durationSec }
}));
const totalDuration = tl.totalSeconds(sceneMap);

function renderFrame(t) {
  const { scene, localT } = tl.resolve(sceneMap, t);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = SCRIPT.palette?.bg ?? '#000';
  ctx.fillRect(0, 0, W, H);
  const fn = _renderers[scene.type];
  if (fn) fn(ctx, localT, scene.data ?? {}, SCRIPT, THEME, Math.round(t * FPS));
}

let playing = false, startWall = null, lastT = 0;
window.__registerSeek(t => { lastT = t; renderFrame(t); });

function loop(now) {
  if (!playing) return;
  if (!startWall) startWall = now - lastT * 1000;
  const t = Math.min((now - startWall) / 1000, totalDuration);
  lastT = t;
  document.getElementById('time').textContent = t.toFixed(2) + 's';
  renderFrame(t);
  if (t < totalDuration) requestAnimationFrame(loop);
  else { playing = false; document.getElementById('btnPlay').textContent = '↺ REPLAY'; }
}

document.getElementById('btnPlay').addEventListener('click', () => {
  const btn = document.getElementById('btnPlay');
  if (!playing) {
    if (lastT >= totalDuration) { lastT = 0; startWall = null; }
    else startWall = null;
    playing = true;
    btn.textContent = '⏸ PAUSE';
    requestAnimationFrame(loop);
  } else {
    playing = false;
    startWall = null;
    btn.textContent = '▶ PLAY';
  }
});

// font preload before first frame
async function preload() {
  const families = ['800 1em Syne', '600 1em Syne', '400 1em Syne', '700 1em JetBrains Mono', '400 1em JetBrains Mono'];
  await Promise.all(families.map(f => document.fonts.load(f)));
  renderFrame(0);
}
preload();
</script>
</body>
</html>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');
console.log(`✓ preview written → ${outPath}`);
console.log(`  open it in a browser to preview`);
