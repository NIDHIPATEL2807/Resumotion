// project scene — three variants: slam_right (default), fullscreen_visual, split_wipe
// data: { title, line, visual, variant? }

import { drawText, riseText, drawBox, fitFont, textWidth } from '../../../engine/fx.js';
import { P, L, easeOut, easeInOut, clamp } from '../../../engine/easing.js';
import { hs } from '../../../engine/prng.js';

const SY = (w, s) => `${w} ${s}px Syne`;
const MO = (w, s) => `${w} ${s}px JBM`;

export default function render(ctx, t, data, script, theme, frame) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const C = theme.palette ?? script.palette;
  const accent = C.accent ?? '#FF6B2B';
  const fg = C.fg ?? '#F2EDE6';
  const mu = C.muted ?? '#7a726b';

  const variant = data.variant ?? 'slam_right';

  if (variant === 'fullscreen_visual') {
    renderFullscreen(ctx, t, data, W, H, accent, fg, mu);
  } else if (variant === 'split_wipe') {
    renderSplitWipe(ctx, t, data, W, H, accent, fg, mu);
  } else {
    renderSlamRight(ctx, t, data, W, H, accent, fg, mu);
  }
}

// ── variant A: title slams left, detector box, subtitle right ─────────────────
function renderSlamRight(ctx, t, data, W, H, accent, fg, mu) {
  const x = 140 * (W / 1920);
  const title = (data.title ?? '').toUpperCase();
  const line  = data.line ?? '';

  const tsz = fitFont(ctx, title, q => SY(800, q), 60, W * 0.65);
  const tf  = SY(800, tsz);
  const ls  = -tsz * 0.03;

  riseText(ctx, title, x, 500 * (H / 1080), tsz, P(t, 0.1, 0.45),
    { f: tf, c: fg, ls });
  riseText(ctx, line, x, 630 * (H / 1080), 36 * (H / 1080), P(t, 0.25, 0.55),
    { f: SY(600, 36 * (H / 1080)), c: mu });

  const tw = textWidth(ctx, title, tf, ls);
  drawBox(ctx, x - 30, 500 * (H / 1080) - tsz * 0.85, tw + 60, tsz * 1.1,
    t, 0.3, { lab: data.visual ?? 'project', cf: 0.94, sd: 50, C: { or: accent } });

  // small generic detect visual: a few scan-style boxes on the right half
  const seed = data.title ? data.title.charCodeAt(0) : 99;
  for (let i = 0; i < 3; i++) {
    const bx = (W * 0.62 + hs(seed + i) * W * 0.25) ;
    const by = (H * 0.25 + hs(seed + i + 10) * H * 0.4);
    const bw = 120 + hs(seed + i + 20) * 180;
    const bh = 80 + hs(seed + i + 30) * 120;
    drawBox(ctx, bx, by, bw, bh, t, 0.15 + i * 0.1,
      { lab: `obj_${i + 1}`, cf: 0.8 + hs(seed + i) * 0.18, sd: seed + i, C: { or: accent } });
  }
}

// ── variant B: title types in at the bottom, visual framing fills screen ──────
function renderFullscreen(ctx, t, data, W, H, accent, fg, mu) {
  // depth-map style: horizontal gradient bands
  const bands = 12;
  for (let i = 0; i < bands; i++) {
    const y0 = (i / bands) * H;
    const y1 = ((i + 1) / bands) * H;
    const k  = P(t, 0.05 + i * 0.04, 0.25 + i * 0.04);
    if (k <= 0) continue;
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.04 * easeOut(k) * (1 - i / bands);
    ctx.fillRect(0, y0, W, y1 - y0);
    ctx.globalAlpha = 1;
  }

  const title = (data.title ?? '').toUpperCase();
  const line  = data.line ?? '';
  const tsz   = fitFont(ctx, title, q => SY(800, q), 80, W - 280);
  const tf    = SY(800, tsz);
  const ls    = -tsz * 0.03;

  riseText(ctx, title, 140 * (W / 1920), H * 0.78, tsz, P(t, 0.2, 0.5),
    { f: tf, c: fg, ls });
  riseText(ctx, line, 140 * (W / 1920), H * 0.88, 32 * (H / 1080), P(t, 0.35, 0.6),
    { f: SY(600, 32 * (H / 1080)), c: mu });

  drawBox(ctx, 140 * (W / 1920) - 30, H * 0.78 - tsz * 0.85,
    textWidth(ctx, title, tf, ls) + 60, tsz * 1.1,
    t, 0.35, { lab: data.visual ?? 'detect', cf: 0.96, sd: 60, C: { or: accent } });
}

// ── variant C: split screen, mask wipe from center ───────────────────────────
function renderSplitWipe(ctx, t, data, W, H, accent, fg, mu) {
  // left half: accent stripe
  const wipeK = easeOut(P(t, 0.05, 0.4));
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(0, 0, W * 0.48 * wipeK, H);
  ctx.globalAlpha = 1;

  const title = (data.title ?? '').toUpperCase();
  const line  = data.line ?? '';
  const tsz   = fitFont(ctx, title, q => SY(800, q), 48, W * 0.45);
  const tf    = SY(800, tsz);
  const ls    = -tsz * 0.03;
  const rx    = W * 0.52 + 40;

  riseText(ctx, title, rx, 480 * (H / 1080), tsz, P(t, 0.15, 0.45),
    { f: tf, c: fg, ls });
  riseText(ctx, line, rx, 600 * (H / 1080), 32 * (H / 1080), P(t, 0.3, 0.6),
    { f: SY(600, 32 * (H / 1080)), c: mu });

  // vertical divider line
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.globalAlpha = wipeK;
  ctx.beginPath();
  ctx.moveTo(W * 0.49, H * 0.1);
  ctx.lineTo(W * 0.49, H * 0.9);
  ctx.stroke();
  ctx.restore();

  drawBox(ctx, rx - 30, 480 * (H / 1080) - tsz * 0.85,
    textWidth(ctx, title, tf, ls) + 60, tsz * 1.1,
    t, 0.3, { lab: data.visual ?? 'project', cf: 0.93, sd: 70, C: { or: accent } });
}
