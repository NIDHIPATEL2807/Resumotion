// name_slam — letter-by-letter slam with scale bounce + ghost echoes. Port of S2.
// data.name   full name in caps, e.g. "NIDHI PATEL" — split on space into lines
// data.role   role line, e.g. "AI-first full-stack engineer"
// data.sub    sub-line, e.g. "SPIT Mumbai '27  ·  B.Tech EXTC + AI minor"
// data.label  HUD label, e.g. "builder"
// data.conf   detector box confidence float, e.g. 0.99

import { clamp, P, L, easeOut, easeIn } from '../../../engine/easing.js';
import { hs } from '../../../engine/prng.js';

const SY = (w, s) => `${w} ${s}px Syne`;
const MO = (w, s) => `${w} ${s}px JetBrains Mono`;

function TW(ctx, s, f, ls = 0) {
  ctx.save(); ctx.font = f; ctx.letterSpacing = ls + 'px';
  const w = ctx.measureText(s).width;
  ctx.restore(); return w;
}

function FIT(ctx, s, fn, mx, mw) {
  const w = TW(ctx, s, fn(mx));
  return w > mw ? Math.floor(mx * mw / w) : mx;
}

function RISE(ctx, s, x, y, sz, k, opts = {}) {
  if (k <= 0) return;
  ctx.save();
  ctx.font = opts.f || SY(800, sz);
  ctx.letterSpacing = (opts.ls || 0) + 'px';
  const w  = ctx.measureText(s).width;
  const x0 = opts.al === 'center' ? x - w/2 : opts.al === 'right' ? x - w : x;
  ctx.beginPath();
  ctx.rect(x0 - 40, y - sz * 1.05, w + 80, sz * 1.38);
  ctx.clip();
  ctx.fillStyle   = opts.c || '#F2EDE6';
  ctx.globalAlpha = opts.a ?? 1;
  ctx.textAlign   = opts.al || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y + (1 - easeOut(k)) * sz * 1.15);
  ctx.restore();
}

function BOX(ctx, x, y, w, h, t, t0, or, opts = {}) {
  const k = P(t, t0, t0 + 0.32);
  if (k <= 0) return;
  const col = opts.c || or;
  const j   = opts.j ?? 1.6;
  const sd  = (opts.sd || 1) * 13.7 + Math.floor(t * 30);
  x += (hs(sd) - 0.5) * 2 * j; y += (hs(sd + 0.5) - 0.5) * 2 * j;
  const s = 1 + 0.22 * (1 - easeOut(k));
  const cx = x + w/2, cy = y + h/2; w *= s; h *= s; x = cx - w/2; y = cy - h/2;
  const a = (opts.a ?? 1) * (k < 0.45 ? (Math.floor(k * 14) % 2 ? 1 : 0.25) : 1);
  ctx.save();
  ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  const q = Math.min(26, w * 0.2, h * 0.2);
  ctx.lineWidth = 5; ctx.beginPath();
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
  const dur = data.scene_duration ?? 4.0;

  const or  = script.palette?.accent ?? '#FF6B2B';
  const fg  = script.palette?.fg     ?? '#F2EDE6';
  const mu  = script.palette?.muted  ?? '#7a726b';

  const fullName = (data.name ?? 'YOUR NAME').toUpperCase();
  const role     = data.role  ?? '';
  const sub      = data.sub   ?? '';
  const label    = data.label ?? 'builder';
  const conf     = data.conf  ?? 0.99;

  // split name into lines on space — up to 2 lines
  const words = fullName.split(' ');
  const lines = words.length >= 2
    ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')]
    : [fullName, ''];

  // scale reference timings (S2: 0–4s within scene) to our dur
  const sc = (refT) => refT * (dur / 4.0);

  const sz = 255, ls = -8;
  // exit fly-up
  const ex = P(t, sc(3.45), sc(3.95));
  const dy = -easeIn(ex) * 700;

  // ── letter slam ───────────────────────────────────────────────────────────
  const yOffsets = [H * 0.435, H * 0.66]; // two name lines

  lines.forEach((wd, wi) => {
    if (!wd) return;
    for (let i = 0; i < wd.length; i++) {
      const t0 = sc(wi * 0.25 + i * 0.0625);
      const k  = P(t, t0, t0 + sc(0.28));
      if (k <= 0) continue;

      const pre = TW(ctx, wd.slice(0, i), SY(800, sz), ls);
      const sca = L(1.7, 1, easeOut(k));
      ctx.save();
      ctx.translate(140 + pre, yOffsets[wi] + dy);
      ctx.scale(sca, sca);

      // ghost echo layers (g=2 behind, g=1 mid, g=0 final)
      for (let g = 2; g >= 0; g--) {
        if (g > 0 && ex <= 0 && k > 0.35) continue;
        const off = g * (ex > 0 ? 90 * easeIn(ex) : -60 * (1 - easeOut(k)));
        ctx.font = SY(800, sz);
        ctx.fillStyle = fg;
        ctx.globalAlpha = (g ? 0.18 : 1) * clamp(k * 5, 0, 1);
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.letterSpacing = ls + 'px';
        ctx.fillText(wd[i], 0, off);
      }
      ctx.restore();
    }
  });

  // ── detector box around name ──────────────────────────────────────────────
  const nw = Math.max(
    TW(ctx, lines[0], SY(800, sz), ls),
    lines[1] ? TW(ctx, lines[1], SY(800, sz), ls) : 0
  );
  ctx.save();
  ctx.translate(0, dy);
  BOX(ctx, 106, H * 0.24, nw + 70, H * 0.455, t, sc(0.55), or, { lab: label, cf: conf, sd: 2, a: 1 - ex });
  ctx.restore();

  // ── role + sub lines rise in ──────────────────────────────────────────────
  ctx.save();
  ctx.translate(0, dy * 0.6);
  RISE(ctx, role, 140, H * 0.8, 44, P(t, sc(1.25), sc(1.65)), { f: SY(600, 44), c: fg });
  if (sub) {
    RISE(ctx, sub, 140, H * 0.85, 24, P(t, sc(1.55), sc(1.9)), { f: MO(400, 22), c: mu });
  }
  ctx.restore();
}
