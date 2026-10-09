// opener — boot sequence + depth scanner. Faithful port of S0+S1 from reference.
// data.boot_text  string typed on screen, e.g. "loading nino.model"
// data.label      HUD identifier shown top-left, e.g. "nino"
// data.name_seed  number, seeds scan-box positions for variety (default 0)

import { clamp, P, L, easeOut, easeIn, backOut } from '../../../engine/easing.js';
import { hs } from '../../../engine/prng.js';
import { textWidth } from '../../../engine/fx.js';

const SY = (w, s) => `${w} ${s}px Syne`;
const MO = (w, s) => `${w} ${s}px JetBrains Mono`;

function buildScan(seed) {
  const boxes = [];
  for (let i = 0; i < 64; i++) {
    const t0 = 3.75 + Math.pow(hs(i * 3.1 + seed * 0.01), 0.65) * 3.15;
    boxes.push({
      t0,
      life: 0.1  + hs(i * 7.7  + seed * 0.01) * 0.28,
      x:   140   + hs(i * 1.3  + seed * 0.01) * 1380,
      y:   150   + hs(i * 2.9  + seed * 0.01) * 640,
      w:    90   + hs(i * 5.1  + seed * 0.01) * 380,
      h:    70   + hs(i * 4.4  + seed * 0.01) * 260,
      c:   Math.floor(12 + hs(i * 9.2 + seed * 0.01) * 55),
    });
  }
  return boxes;
}

// thermal LUT: black → dark-red → orange → cream
const LUT = (() => {
  const stops = [[0,[0,0,0]],[0.35,[58,18,6]],[0.62,[160,52,16]],[0.82,[255,107,43]],[1,[242,237,230]]];
  return Array.from({length: 256}, (_, i) => {
    const v = i / 255;
    let j = 0;
    while (j < stops.length - 2 && v > stops[j+1][0]) j++;
    const [ta, ca] = stops[j], [tb, cb] = stops[j+1];
    const k = (tb[0] - ta[0]) > 0 ? (v - ta[0]) / (tb[0] - ta[0]) : 0;
    return ca.map((c, x) => Math.round(c + (cb[x] - c) * k));
  });
})();

function drawDepth(ctx, t, alpha, W, H) {
  if (alpha <= 0) return;
  const dw = 128, dh = 72;
  const id = ctx.createImageData(dw, dh);
  const d  = id.data;
  for (let y = 0; y < dh; y++) {
    for (let x = 0; x < dw; x++) {
      let v = Math.pow(y / dh, 1.6) * 0.75;
      v += 0.35 * Math.exp(-(((x - 40 - 18 * Math.sin(t * 0.7)) / 18) ** 2 + ((y - 38) / 14) ** 2));
      v += 0.28 * Math.exp(-(((x - 92 + 14 * Math.cos(t * 0.5)) / 12) ** 2 + ((y - 30 - 6 * Math.sin(t)) / 20) ** 2));
      v += 0.08 * Math.sin(x * 0.21 + t * 1.3) * Math.cos(y * 0.17 - t * 0.9);
      v = clamp(v, 0, 1);
      v = Math.round(v * 7) / 7;
      const col = LUT[Math.floor(v * 255)];
      const idx = (y * dw + x) * 4;
      d[idx] = col[0]; d[idx+1] = col[1]; d[idx+2] = col[2]; d[idx+3] = 255;
    }
  }
  const tmp = document.createElement('canvas');
  tmp.width = dw; tmp.height = dh;
  tmp.getContext('2d').putImageData(id, 0, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, W, H);
  ctx.restore();
}

function BOX(ctx, x, y, w, h, t, t0, or, opts = {}) {
  const k = P(t, t0, t0 + 0.32);
  if (k <= 0) return;
  const col = opts.c || or;
  const j   = opts.j ?? 1.6;
  const sd  = (opts.sd || 1) * 13.7 + Math.floor(t * 30);
  x += (hs(sd) - 0.5) * 2 * j;
  y += (hs(sd + 0.5) - 0.5) * 2 * j;
  const s = 1 + 0.22 * (1 - easeOut(k));
  const cx2 = x + w / 2, cy2 = y + h / 2;
  w *= s; h *= s; x = cx2 - w / 2; y = cy2 - h / 2;
  const a = (opts.a ?? 1) * (k < 0.45 ? (Math.floor(k * 14) % 2 ? 1 : 0.25) : 1);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  const q = Math.min(26, w * 0.2, h * 0.2);
  ctx.lineWidth = 5;
  ctx.beginPath();
  [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([px,py,dx,dy]) => {
    ctx.moveTo(px + dx*q, py); ctx.lineTo(px, py); ctx.lineTo(px, py + dy*q);
  });
  ctx.stroke();
  if (opts.lab && k > 0.5) {
    const lab = opts.lab + (opts.cf != null ? '  ' + opts.cf.toFixed(2) : '');
    const f   = MO(700, 19);
    ctx.font  = f; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px';
    const lw  = ctx.measureText(lab).width + 22;
    const ly  = opts.below ? y + h : y - 32;
    ctx.fillStyle = col;
    ctx.fillRect(x - 1, ly, lw, 32);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText(lab, x + 10, ly + 22);
  }
  ctx.restore();
}

function RISE(ctx, s, x, y, sz, k, opts = {}) {
  if (k <= 0) return;
  ctx.save();
  ctx.font = opts.f || `400 ${sz}px Syne`;
  ctx.letterSpacing = (opts.ls || 0) + 'px';
  const w  = ctx.measureText(s).width;
  const x0 = opts.al === 'center' ? x - w/2 : opts.al === 'right' ? x - w : x;
  ctx.beginPath();
  ctx.rect(x0 - 40, y - sz * 1.05, w + 80, sz * 1.38);
  ctx.clip();
  ctx.fillStyle  = opts.c || '#F2EDE6';
  ctx.globalAlpha = opts.a ?? 1;
  ctx.textAlign   = opts.al || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y + (1 - easeOut(k)) * sz * 1.15);
  ctx.restore();
}

export default function render(ctx, localT, data, script, theme, frame) {
  const W  = ctx.canvas.width;
  const H  = ctx.canvas.height;
  const t  = localT;
  const dur = data.scene_duration ?? 7.5;

  const or = script.palette?.accent ?? '#FF6B2B';
  const fg = script.palette?.fg     ?? '#F2EDE6';
  const mu = script.palette?.muted  ?? '#7a726b';

  const bootText = data.boot_text ?? 'loading model';
  const label    = data.label     ?? '';
  const seed     = data.name_seed ?? 0;

  // scale reference absolute times (0–7.5s) to our scene duration
  const sc = (refT) => refT * (dur / 7.5);

  const SCAN = buildScan(seed);

  // ── crosshair flash ───────────────────────────────────────────────────────
  if (t < sc(0.3)) {
    ctx.save();
    ctx.strokeStyle = fg; ctx.globalAlpha = 0.35; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W/2 - 34, H/2); ctx.lineTo(W/2 - 14, H/2);
    ctx.moveTo(W/2 + 14, H/2); ctx.lineTo(W/2 + 34, H/2);
    ctx.moveTo(W/2, H/2 - 34); ctx.lineTo(W/2, H/2 - 14);
    ctx.moveTo(W/2, H/2 + 14); ctx.lineTo(W/2, H/2 + 34);
    ctx.stroke();
    ctx.restore();
  }

  // ── orange dot drop + bounce ──────────────────────────────────────────────
  if (t >= sc(0.25) && t < sc(2.45)) {
    const fall = easeIn(P(t, sc(0.25), sc(0.55)));
    const y    = L(H/2, H/2 + 80, fall) + (t > sc(0.55) ? Math.sin((t - sc(0.55)) * 30) * 3 : 0);
    const st   = (t > sc(0.25) && t < sc(0.55)) ? 1 + fall * 0.5 : 1;
    ctx.save();
    ctx.fillStyle = or;
    ctx.translate(W/2, y); ctx.scale(1/st, st);
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill();
    ctx.restore();
  }

  // ── ring ripple ───────────────────────────────────────────────────────────
  if (t > sc(0.78) && t < sc(1.1)) {
    const k = P(t, sc(0.78), sc(1.1));
    ctx.save();
    ctx.strokeStyle = or; ctx.globalAlpha = 1 - k; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(W/2, H/2 + 80, L(10, 70, easeOut(k)), 0, 7); ctx.stroke();
    ctx.restore();
  }

  // ── boot text phase ───────────────────────────────────────────────────────
  if (t >= sc(2.25)) {
    const pk   = P(t, sc(2.25), sc(2.45));
    const ring = P(t, sc(3.1),  sc(3.7));

    // center dot expands
    ctx.save();
    ctx.fillStyle = or;
    ctx.globalAlpha = 1 - P(t, sc(3.3), sc(3.5));
    ctx.beginPath();
    ctx.arc(W/2, H/2, 9 * backOut(pk) * (1 - easeOut(ring) * 0.3), 0, 7);
    ctx.fill();
    ctx.restore();

    // outward ring
    if (ring > 0) {
      ctx.save();
      ctx.strokeStyle = or;
      ctx.lineWidth = L(6, 1, ring);
      ctx.globalAlpha = 1 - ring;
      ctx.beginPath();
      ctx.arc(W/2, H/2, L(8, 900, easeOut(ring)), 0, 7);
      ctx.stroke();
      ctx.restore();
    }

    // boot text typewriter
    const fa = 1 - P(t, sc(3.1), sc(3.4));
    const charRate = sc(bootText.length * 0.028);
    const n = Math.floor(clamp((t - sc(2.3)) / Math.max(charRate, 0.01), 0, 1) * bootText.length);
    ctx.font = MO(400, 20);
    ctx.fillStyle = mu; ctx.globalAlpha = fa;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px';
    ctx.fillText(bootText.slice(0, n), W/2, H/2 + 72);

    if (t > sc(2.97)) {
      ctx.font = MO(700, 20);
      ctx.fillStyle = or;
      ctx.fillText('ready', W/2, H/2 + 106);
    }
    ctx.globalAlpha = 1;
  }

  // ── depth scanner ─────────────────────────────────────────────────────────
  if (t >= sc(3.5)) {
    const rev = P(t, sc(3.5), sc(4.1));
    if (rev > 0) {
      drawDepth(ctx, t, 0.95 * easeOut(rev) * (1 - P(t, sc(7.35), sc(7.5))), W, H);
      if (rev < 1) {
        ctx.fillStyle = '#000';
        for (let i = 0; i < 192; i++) {
          if (hs(i * 1.7) > rev) {
            ctx.fillRect((i % 16) * Math.ceil(W/16), Math.floor(i / 16) * Math.ceil(H/12), Math.ceil(W/16), Math.ceil(H/12));
          }
        }
      }
    }

    // converging scan boxes
    const tgt = [106, 262, 1200, 490];
    for (const b of SCAN) {
      const bt  = b.t0 * (dur / 7.5);
      if (t < bt || t > bt + b.life * (dur / 7.5)) continue;
      const k   = P(bt, sc(6), sc(7));
      const ek  = k > 0 ? k : 0;
      BOX(ctx, L(b.x, tgt[0], ek), L(b.y, tgt[1], ek), L(b.w, tgt[2], ek), L(b.h, tgt[3], ek),
        t, bt, or, { lab: k > 0.6 ? 'person' : 'obj', cf: L(b.c/100, 0.9 + 0.09*hs(b.x), ek), sd: b.x, a: 0.9, j: 3 });
    }

    // status text
    const fa = P(t, sc(4.1), sc(4.3)) * (1 - P(t, sc(6.9), sc(7)));
    if (fa > 0) {
      ctx.font = MO(400, 20); ctx.globalAlpha = fa;
      ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px';
      ctx.fillText('searching', 140, H - 140);
      ctx.fillStyle = mu;
      ctx.fillText((Math.floor(t * 30) % 997).toString().padStart(3, '0') + ' candidates', 140, H - 110);
      ctx.globalAlpha = 1;
    }
  }

  // ── HUD corner brackets ───────────────────────────────────────────────────
  if (t > sc(0.5)) {
    const hk  = easeOut(P(t, sc(3.0), sc(3.8)));
    const m   = 56;
    const len = L(18, 64, hk);
    const ix  = L(W/2 - 140, m, hk);
    const iy  = L(H/2 - 110, m, hk);
    ctx.save();
    ctx.strokeStyle = fg; ctx.globalAlpha = 0.5; ctx.lineWidth = 2;
    ctx.beginPath();
    [[ix,iy,1,1],[W-ix,iy,-1,1],[ix,H-iy,1,-1],[W-ix,H-iy,-1,-1]].forEach(([x,y,dx,dy]) => {
      ctx.moveTo(x + dx*len, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy*len);
    });
    ctx.stroke();
    ctx.restore();

    if (label && t > sc(3.5)) {
      const aa = P(t, sc(3.5), sc(4.1)) * 0.42;
      ctx.font = MO(400, 17); ctx.fillStyle = mu; ctx.globalAlpha = aa;
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '0px';
      ctx.fillText(label, m + 18, m + 40);
      ctx.fillText('frame ' + String(frame).padStart(6, '0'), m + 18, H - m - 24);
      ctx.globalAlpha = 1;
    }
  }
}
