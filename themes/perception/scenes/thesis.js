// thesis — "I find the problem first" → "I build systems that [see/think/ship]". Port of S3.
// data.line1   first statement, e.g. "I find the problem first."
// data.stem    second line stem, e.g. "I build systems"
// data.words   cycling completions, e.g. ["that see.","that think.","that ship."]
// data.labels  box labels per word, e.g. ["perceive","reason","deploy"]
// data.confs   confidence per word, e.g. [0.97, 0.95, 0.99]

import { clamp, P, L, easeOut, easeInOut } from '../../../engine/easing.js';
import { hs } from '../../../engine/prng.js';

const SY = (w, s) => `${w} ${s}px Syne`;
const MO = (w, s) => `${w} ${s}px JetBrains Mono`;

function TW(ctx, s, f, ls = 0) {
  ctx.save(); ctx.font = f; ctx.letterSpacing = ls + 'px';
  const w = ctx.measureText(s).width; ctx.restore(); return w;
}

function FIT(ctx, s, fn, mx, mw) {
  const w = TW(ctx, s, fn(mx));
  return w > mw ? Math.floor(mx * mw / w) : mx;
}

function RISE(ctx, s, x, y, sz, k, opts = {}) {
  if (k <= 0) return;
  ctx.save();
  ctx.font = opts.f || SY(800, sz); ctx.letterSpacing = (opts.ls || 0) + 'px';
  const w  = ctx.measureText(s).width;
  const x0 = opts.al === 'center' ? x - w/2 : opts.al === 'right' ? x - w : x;
  ctx.beginPath(); ctx.rect(x0 - 40, y - sz * 1.05, w + 80, sz * 1.38); ctx.clip();
  ctx.fillStyle = opts.c || '#F2EDE6'; ctx.globalAlpha = opts.a ?? 1;
  ctx.textAlign = opts.al || 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y + (1 - easeOut(k)) * sz * 1.15);
  ctx.restore();
}

function OUT(ctx, s, x, y, sz, k, opts = {}) {
  if (k <= 0) return;
  ctx.save();
  ctx.font = opts.f || SY(800, sz); ctx.letterSpacing = (opts.ls || 0) + 'px';
  const w  = ctx.measureText(s).width;
  const x0 = opts.al === 'center' ? x - w/2 : opts.al === 'right' ? x - w : x;
  ctx.beginPath(); ctx.rect(x0 - 40, y - sz * 1.05, w + 80, sz * 1.38); ctx.clip();
  ctx.fillStyle = opts.c || '#F2EDE6'; ctx.globalAlpha = opts.a ?? 1;
  ctx.textAlign = opts.al || 'left'; ctx.textBaseline = 'alphabetic';
  // easeIn not imported — use exponential
  const ei = x2 => x2 <= 0 ? 0 : Math.pow(2, 10 * x2 - 10);
  ctx.fillText(s, x, y - ei(k) * sz * 1.2);
  ctx.restore();
}

function BOX(ctx, x, y, w, h, t, t0, or, opts = {}) {
  const k = P(t, t0, t0 + 0.32); if (k <= 0) return;
  const col = opts.c || or;
  const j   = opts.j ?? 1.6;
  const sd  = (opts.sd || 1) * 13.7 + Math.floor(t * 30);
  x += (hs(sd) - 0.5) * 2 * j; y += (hs(sd + 0.5) - 0.5) * 2 * j;
  const s = 1 + 0.22 * (1 - easeOut(k));
  const cx = x + w/2, cy = y + h/2; w *= s; h *= s; x = cx - w/2; y = cy - h/2;
  const a = (opts.a ?? 1) * (k < 0.45 ? (Math.floor(k * 14) % 2 ? 1 : 0.25) : 1);
  ctx.save();
  ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  const q = Math.min(26, w * 0.2, h * 0.2); ctx.lineWidth = 5; ctx.beginPath();
  [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([px,py,dx,dy]) => {
    ctx.moveTo(px+dx*q, py); ctx.lineTo(px, py); ctx.lineTo(px, py+dy*q);
  });
  ctx.stroke();
  if (opts.lab && k > 0.5) {
    const lab = opts.lab + (opts.cf != null ? '  ' + opts.cf.toFixed(2) : '');
    const f   = MO(700, 19);
    ctx.font = f; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px';
    const lw  = ctx.measureText(lab).width + 22;
    const ly  = opts.below ? y + h : y - 32;
    ctx.fillStyle = col; ctx.fillRect(x - 1, ly, lw, 32);
    ctx.fillStyle = '#000'; ctx.textAlign = 'left';
    ctx.fillText(lab, x + 10, ly + 22);
  }
  ctx.restore();
}

export default function render(ctx, localT, data, script, theme, frame) {
  const W   = ctx.canvas.width;
  const H   = ctx.canvas.height;
  const t   = localT;
  const dur = data.scene_duration ?? 5.0;

  const or  = script.palette?.accent ?? '#FF6B2B';
  const fg  = script.palette?.fg     ?? '#F2EDE6';
  const mu  = script.palette?.muted  ?? '#7a726b';

  const line1  = data.line1  ?? 'I find the problem first.';
  const stem   = data.stem   ?? 'I build systems';
  const words  = data.words  ?? ['that see.', 'that think.', 'that ship.'];
  const labels = data.labels ?? words.map((_, i) => ['perceive','reason','deploy'][i] ?? 'build');
  const confs  = data.confs  ?? words.map((_, i) => [0.97,0.95,0.99][i] ?? 0.98);

  // reference S3 spans 0–5s. scale all timings.
  const sc = (refT) => refT * (dur / 5.0);

  // ── line1: rises word-by-word, shrinks + moves up as stem rises ──────────
  const up = easeOut(P(t, sc(1.4), sc(1.8)));
  const w1arr = line1.split(' ');
  const z1 = FIT(ctx, line1, q => SY(800, q), 150, W - 280);
  const sz = L(z1, 64, up);
  const y1 = L(H * 0.52, H * 0.28, up);
  const f1 = SY(800, sz), ls1 = -sz * 0.03;

  let x = W/2 - TW(ctx, w1arr.join(' '), f1, ls1) / 2;
  w1arr.forEach((w, i) => {
    RISE(ctx, w, x, y1, sz, P(t, sc(i * 0.12), sc(0.35 + i * 0.12)), {
      f: f1, ls: ls1, c: up > 0.5 ? mu : fg,
    });
    x += TW(ctx, w + ' ', f1, ls1);
  });

  if (t < sc(1.6)) {
    const tw = TW(ctx, w1arr.join(' '), f1, ls1);
    BOX(ctx, W/2 - tw/2 - 36, y1 - sz*0.9, tw + 72, sz*1.2, t, sc(0.65), or,
      { lab: 'discover', cf: 0.98, sd: 70, a: 1 - P(t, sc(1.35), sc(1.5)) });
  }

  // ── stem: "I build systems" rises word-by-word ────────────────────────────
  const f = SY(800, 140), ls = -4.5;
  const stemWords = stem.split(' ');
  x = W/2 - TW(ctx, stem, f, ls) / 2;
  stemWords.forEach((w, i) => {
    RISE(ctx, w, x, H * 0.48, 140, P(t, sc(1.5 + i * 0.18), sc(1.85 + i * 0.18)), { f, ls });
    x += TW(ctx, w + ' ', f, ls);
  });

  // ── cycling completions ───────────────────────────────────────────────────
  const spacing = dur > 0 ? (dur - sc(2.25)) / words.length : 0.5;
  words.forEach((w, i) => {
    const t0 = sc(2.25) + i * spacing;
    const nx = t0 + spacing;
    if (t < t0 || t > nx + 0.1) return;
    if (t < nx) {
      RISE(ctx, w, W/2, H * 0.648, 140, P(t, t0 + sc(0.05), t0 + sc(0.32)), { f, ls, al: 'center' });
    } else {
      OUT(ctx, w, W/2, H * 0.648, 140, P(t, nx, nx + 0.1), { f, ls, al: 'center' });
    }
  });

  // morphing box width follows active word
  let cur = -1;
  const t0s = words.map((_, i) => sc(2.25) + i * spacing);
  t0s.forEach((t0, i) => { if (t >= t0) cur = i; });
  if (cur >= 0) {
    const ws   = words.map(w => TW(ctx, w, f, ls));
    const prev = cur > 0 ? ws[cur - 1] : ws[cur];
    const bw   = L(prev, ws[cur], cur ? easeOut(P(t, t0s[cur], t0s[cur] + sc(0.3))) : 1) + 70;
    BOX(ctx, W/2 - bw/2, H * 0.546, bw, 150, t, t0s[0], or,
      { lab: labels[cur] ?? 'build', cf: confs[cur] ?? 0.98, sd: 3 });
  }

  // ── orange wipe transition at end ─────────────────────────────────────────
  const sw = P(t, sc(4.4), dur);
  if (sw > 0) {
    ctx.save();
    ctx.fillStyle = or;
    ctx.beginPath();
    const e = L(-260, W + 260, easeInOut(sw));
    ctx.moveTo(-300, 0);
    for (let y2 = 0; y2 <= H; y2 += 36) {
      ctx.lineTo(e + (hs(Math.floor(y2/36) + Math.floor(t*12)) - 0.5) * 140, y2);
    }
    ctx.lineTo(-300, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
