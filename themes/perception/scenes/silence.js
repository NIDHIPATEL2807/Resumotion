// silence scene — screen stays on (never blank), just the dot
// data: {}

import { P, easeOut } from '../../../engine/easing.js';

export default function render(ctx, t, data, script, theme, frame) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const accent = (theme.palette ?? script.palette)?.accent ?? '#FF6B2B';

  // dot pulses softly — not blank, never blank
  const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
  ctx.save();
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.3 + 0.4 * pulse;
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
