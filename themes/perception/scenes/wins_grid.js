// wins_grid scene — achievements: first show each one big, then grid summary
// data: { items: [{ label, event, detail, logo? }] }

import { drawText, riseText, drawBox, fitFont, textWidth } from '../../../engine/fx.js';
import { P, L, easeOut, easeInOut, clamp } from '../../../engine/easing.js';

const SY = (w, s) => `${w} ${s}px Syne`;
const MO = (w, s) => `${w} ${s}px JBM`;

export default function render(ctx, t, data, script, theme, frame) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const C = theme.palette ?? script.palette;
  const accent = C.accent ?? '#FF6B2B';
  const fg = C.fg ?? '#F2EDE6';
  const mu = C.muted ?? '#7a726b';

  const items = data.items ?? [];
  if (items.length === 0) return;

  const dur = data.scene_duration ?? 8;
  // first 60% of scene: cycle through each win large
  // last 40%: grid of all wins
  const splitT = dur * 0.6;

  if (t < splitT) {
    // large single-item view — cycles one per equal slice
    const sliceDur = splitT / items.length;
    const ci = Math.min(Math.floor(t / sliceDur), items.length - 1);
    const localT = t - ci * sliceDur;
    const item = items[ci];

    const label = item.label ?? '';
    const event = item.event ?? '';
    const detail = item.detail ?? '';

    const x = 140 * (W / 1920);
    const lsz = fitFont(ctx, label, q => SY(800, q), 100, W - 280);
    const lf  = SY(800, lsz);
    const ls  = -lsz * 0.03;

    riseText(ctx, label, x, 580 * (H / 1080), lsz, P(localT, 0, 0.3),
      { f: lf, c: fg, ls });
    riseText(ctx, event, x, 700 * (H / 1080), 40 * (H / 1080), P(localT, 0.1, 0.35),
      { f: SY(600, 40 * (H / 1080)), c: fg });
    riseText(ctx, detail, x, 760 * (H / 1080), 24 * (H / 1080), P(localT, 0.2, 0.42),
      { f: MO(400, 24 * (H / 1080)), c: mu });

    const tw = textWidth(ctx, label, lf, ls);
    drawBox(ctx, x - 30, 580 * (H / 1080) - lsz * 0.82, tw + 60, lsz * 0.98,
      t, ci * sliceDur + 0.18, { lab: 'achievement', cf: 0.99, sd: 10 + ci, C: { or: accent } });

  } else {
    // grid view
    const cols = Math.min(items.length, 3);
    const rows = Math.ceil(items.length / cols);
    const cw = Math.floor((W - 280) / cols - 40);
    const ch = 270 * (H / 1080);
    const gx = (W - cols * (cw + 40) + 40) / 2;
    const gridT = t - splitT;

    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const ix  = gx + col * (cw + 40);
      const iy  = (rows === 1 ? H * 0.35 : H * 0.22) + row * (ch + 40);
      const k   = P(gridT, i * 0.07, i * 0.07 + 0.3);
      if (k <= 0) return;

      const lsz = fitFont(ctx, item.label ?? '', q => SY(800, q), 40, cw - 70);
      riseText(ctx, item.label ?? '', ix + 34, iy + ch * 0.65, lsz, k,
        { f: SY(800, lsz), c: fg, ls: -lsz * 0.03 });

      const sub = (item.detail || item.event || '').slice(0, 34);
      riseText(ctx, sub, ix + 36, iy + ch * 0.85, 24 * (H / 1080),
        P(gridT, i * 0.07 + 0.1, i * 0.07 + 0.4),
        { f: SY(600, 24 * (H / 1080)), c: mu });

      drawBox(ctx, ix, iy, cw, ch, t, splitT + i * 0.08,
        { lab: `win_${i + 1}`, sd: 20 + i, C: { or: accent } });
    });

    // fade to black at scene end
    const fade = P(t, dur - 0.3, dur);
    if (fade > 0) {
      ctx.fillStyle = '#000';
      ctx.globalAlpha = easeInOut(fade);
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }
}
