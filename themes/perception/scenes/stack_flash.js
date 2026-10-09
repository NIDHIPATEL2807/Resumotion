// stack_flash scene — skill categories or tools flash in with bordered pills
// data: { items: string[] }

import { drawText, riseText, textWidth } from '../../../engine/fx.js';
import { P, easeOut, clamp } from '../../../engine/easing.js';

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

  const dur = data.scene_duration ?? 2;
  const ff  = MO(700, 30 * (H / 1080));

  // measure all pill widths
  const pads = 44 * (W / 1920);
  const gap  = 18 * (W / 1920);
  const pillH = 62 * (H / 1080);

  const widths = items.map(s => {
    ctx.font = ff;
    return ctx.measureText(s).width + pads;
  });

  // wrap into rows
  const maxRowW = W - 280;
  const rows = [];
  let row = [], rowW = 0;
  for (let i = 0; i < items.length; i++) {
    if (rowW + widths[i] + gap > maxRowW && row.length > 0) {
      rows.push(row);
      row = [];
      rowW = 0;
    }
    row.push(i);
    rowW += widths[i] + gap;
  }
  if (row.length) rows.push(row);

  const totalH = rows.length * (pillH + 24 * (H / 1080));
  const startY = H / 2 - totalH / 2 + pillH;

  rows.forEach((rowIdxs, ri) => {
    const rowW2 = rowIdxs.reduce((acc, i) => acc + widths[i] + gap, -gap);
    let rx = W / 2 - rowW2 / 2;
    const ry = startY + ri * (pillH + 24 * (H / 1080));

    rowIdxs.forEach(i => {
      const delay = i * 0.06;
      const k = P(t, delay, delay + 0.25) * (1 - P(t, dur - 0.1, dur));
      if (k > 0) {
        ctx.save();
        ctx.globalAlpha = easeOut(k);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(rx, ry - pillH * 0.8 + (1 - easeOut(k)) * 30, widths[i], pillH);
        ctx.restore();
        drawText(ctx, items[i], rx + 22 * (W / 1920),
          ry - pillH * 0.8 + pillH * 0.65 + (1 - easeOut(k)) * 30,
          { f: ff, c: fg, a: easeOut(k) });
      }
      rx += widths[i] + gap;
    });
  });
}
