// Shared visual effects: grain, jitter, chromatic split, box draw, rise helpers
import { hs } from './prng.js';
import { P, L, easeOut, easeInOut, backOut, clamp } from './easing.js';

// ── text helpers ──────────────────────────────────────────────────────────────

export function textWidth(ctx, str, font, letterSpacing = 0) {
  ctx.save();
  ctx.font = font;
  let w = ctx.measureText(str).width;
  if (letterSpacing) w += letterSpacing * (str.length - 1);
  ctx.restore();
  return w;
}

export function fitFont(ctx, str, fontFn, minPx, maxW) {
  let lo = minPx, hi = 400, mid;
  for (let i = 0; i < 18; i++) {
    mid = (lo + hi) / 2;
    if (textWidth(ctx, str, fontFn(mid)) > maxW) hi = mid; else lo = mid;
  }
  return Math.floor(lo);
}

// Draw text with optional letterSpacing, alpha, alignment
export function drawText(ctx, str, x, y, { f, c = '#F2EDE6', a = 1, al = 'left', ls = 0 } = {}) {
  if (a <= 0) return;
  ctx.save();
  ctx.font = f;
  ctx.fillStyle = c;
  ctx.globalAlpha = a;
  ctx.textBaseline = 'alphabetic';
  if (!ls) {
    ctx.textAlign = al;
    ctx.fillText(str, x, y);
  } else {
    // manual letter spacing
    const chars = [...str];
    const totalW = textWidth(ctx, str, f, ls);
    let cx = al === 'center' ? x - totalW / 2 : al === 'right' ? x - totalW : x;
    ctx.textAlign = 'left';
    for (const ch of chars) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + ls;
    }
  }
  ctx.restore();
}

// Text rising up from behind a clip line (masked reveal)
export function riseText(ctx, str, x, y, size, k, opts = {}) {
  if (k <= 0) return;
  const rise = size * 1.1 * (1 - easeOut(k));
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y - size * 1.3, ctx.canvas.width, size * 1.5);
  ctx.clip();
  drawText(ctx, str, x, y + rise, { ...opts, a: (opts.a ?? 1) * clamp(k * 4) });
  ctx.restore();
}

// Text fading out (reverse of rise)
export function outText(ctx, str, x, y, size, k, opts = {}) {
  if (k >= 1) return;
  drawText(ctx, str, x, y, { ...opts, a: (opts.a ?? 1) * (1 - easeInOut(k)) });
}

// ── detector box ─────────────────────────────────────────────────────────────

export function drawBox(ctx, x, y, w, h, t, t0, {
  lab = '', cf = 0.99, sd = 0, a = 1, C
} = {}) {
  const k = clamp((t - t0) * 6);
  if (k <= 0) return;
  const corner = 14, thick = 2, len = 18;
  const alpha = a * easeOut(k);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = C?.or ?? '#FF6B2B';
  ctx.lineWidth = thick;

  // draw corner brackets
  const corners = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]];
  const dirs = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  for (let i = 0; i < 4; i++) {
    const [cx, cy] = corners[i];
    const [dx, dy] = dirs[i];
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();
  }

  // label bottom-left
  if (lab) {
    ctx.font = `400 20px JBM`;
    ctx.fillStyle = C?.or ?? '#FF6B2B';
    ctx.textAlign = 'left';
    ctx.fillText(lab, x + 6, y + h + 22);

    // confidence
    const cfStr = cf.toFixed(2);
    ctx.textAlign = 'right';
    ctx.fillText(cfStr, x + w - 6, y + h + 22);
  }
  ctx.restore();
}

// ── film grain ────────────────────────────────────────────────────────────────

export function applyGrain(ctx, W, H, frame, intensity = 0.04) {
  if (intensity <= 0) return;
  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (hs(frame * 7919 + i * 0.001) - 0.5) * 255 * intensity;
    data[i]     = clamp(data[i]     + n, 0, 255);
    data[i + 1] = clamp(data[i + 1] + n, 0, 255);
    data[i + 2] = clamp(data[i + 2] + n, 0, 255);
  }
  ctx.putImageData(imageData, 0, 0);
}

// ── camera shake / chromatic aberration ──────────────────────────────────────

// Returns { shakeX, shakeY, aberration } for frame
export function getFX(frame, impacts, softImpacts) {
  let sh = 0, ab = 0;
  for (const [ti, v] of impacts) {
    const d = frame - ti;
    if (d >= 0) {
      sh += v * Math.exp(-d * 9) * 16;
      ab += v * Math.exp(-d * 11) * 12;
    }
  }
  for (const ti of softImpacts) {
    const d = frame - ti;
    if (d >= 0) {
      sh += Math.exp(-d * 14) * 4;
      ab += Math.exp(-d * 16) * 4;
    }
  }
  const r = hs(frame * 0.71);
  const r2 = hs(frame * 0.37);
  return {
    shakeX: (r - 0.5) * 2 * sh,
    shakeY: (r2 - 0.5) * 2 * sh,
    aberration: ab,
  };
}
