// experience scene — role, company, dates, one-line description
// data: { role, company, dates, line, logo? }

import { drawText, riseText, drawBox, fitFont, textWidth } from '../../../engine/fx.js';
import { P, easeOut, clamp } from '../../../engine/easing.js';

const SY = (w, s) => `${w} ${s}px Syne`;
const MO = (w, s) => `${w} ${s}px JBM`;

export default function render(ctx, t, data, script, theme, frame) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const C = theme.palette ?? script.palette;
  const accent = C.accent ?? '#FF6B2B';
  const fg = C.fg ?? '#F2EDE6';
  const mu = C.muted ?? '#7a726b';

  const x = 140 * (W / 1920);

  const company = (data.company ?? '').toUpperCase();
  const role    = data.role ?? '';
  const dates   = data.dates ?? '';
  const line    = data.line ?? '';

  // company — big
  const csz = fitFont(ctx, company || role, q => SY(800, q), 60, W - 280);
  riseText(ctx, company || role.toUpperCase(), x, 500 * (H / 1080), csz,
    P(t, 0.05, 0.35), { f: SY(800, csz), c: fg, ls: -csz * 0.03 });

  // role label
  if (company) {
    riseText(ctx, role, x, 610 * (H / 1080), 36 * (H / 1080), P(t, 0.15, 0.45),
      { f: SY(600, 36 * (H / 1080)), c: fg });
  }

  // dates
  riseText(ctx, dates, x, 670 * (H / 1080), 24 * (H / 1080), P(t, 0.25, 0.5),
    { f: MO(400, 24 * (H / 1080)), c: mu });

  // one-liner
  riseText(ctx, line, x, 760 * (H / 1080), 30 * (H / 1080), P(t, 0.35, 0.6),
    { f: SY(600, 30 * (H / 1080)), c: mu });

  // box
  const tw = textWidth(ctx, company || role.toUpperCase(), SY(800, csz), -csz * 0.03);
  drawBox(ctx, x - 30, 500 * (H / 1080) - csz * 0.85, tw + 60, csz * 1.1,
    t, 0.25, { lab: 'experience', cf: 0.96, sd: 80, C: { or: accent } });
}
