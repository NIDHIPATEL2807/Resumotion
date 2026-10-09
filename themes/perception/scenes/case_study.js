// case_study scene — problem → pipeline → outcomes (orange bg inversion)
// data: { company, context, pain, bottleneck_label, stages[], outcomes[] }

import { drawText, riseText, drawBox, fitFont, textWidth } from '../../../engine/fx.js';
import { P, L, easeOut, easeInOut, clamp } from '../../../engine/easing.js';

const SY = (w, s) => `${w} ${s}px Syne`;

export default function render(ctx, t, data, script, theme, frame) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const C = theme.palette ?? script.palette;
  const accent = C.accent ?? '#FF6B2B';

  const dur = data.scene_duration ?? 9;
  const company   = data.company ?? '';
  const context   = data.context ?? '';
  const pain      = data.pain ?? '';
  const stages    = data.stages ?? [];
  const outcomes  = data.outcomes ?? [];

  // orange background flood
  ctx.fillStyle = accent;
  ctx.globalAlpha = clamp(P(t, 0, 0.08));
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;

  const textCol = '#000';
  const subCol  = '#3a1206';
  const x = 140 * (W / 1920);

  // company label
  riseText(ctx, company, x, 190 * (H / 1080), 30 * (H / 1080),
    P(t, 0.05, 0.35), { f: SY(600, 30 * (H / 1080)), c: textCol });

  // context (the problem)
  const ctxSz = fitFont(ctx, context, q => SY(800, q), 48, W - 280);
  riseText(ctx, context, x, 400 * (H / 1080), ctxSz,
    P(t, 0.15, 0.5), { f: SY(800, ctxSz), c: textCol, ls: -ctxSz * 0.02 });

  // pain label
  riseText(ctx, pain, x, 530 * (H / 1080), 36 * (H / 1080),
    P(t, 0.25, 0.55), { f: SY(600, 36 * (H / 1080)), c: subCol });

  // pipeline stages — appear at 40% through
  const pipeStart = dur * 0.4;
  if (t >= pipeStart && stages.length > 0) {
    const colW = (W - 280) / stages.length;
    stages.forEach((stage, i) => {
      const st = pipeStart + i * 0.18;
      const sk = P(t, st, st + 0.3);
      if (sk <= 0) return;
      const sx  = x + i * (colW + 20 * (W / 1920));
      const sy  = 700 * (H / 1080);
      const ssz = fitFont(ctx, stage, q => SY(800, q), 28, colW - 20);
      riseText(ctx, stage, sx, sy, ssz, sk,
        { f: SY(800, ssz), c: textCol, ls: -ssz * 0.02 });
      drawBox(ctx, sx - 20, sy - ssz * 0.85,
        textWidth(ctx, stage, SY(800, ssz), -ssz * 0.02) + 40, ssz * 1.1,
        t, st + 0.1, { lab: `step_${i + 1}`, cf: 0.9 + i * 0.02, sd: 40 + i, C: { or: textCol } });

      // arrow
      if (i < stages.length - 1) {
        const ax = sx + textWidth(ctx, stage, SY(800, ssz), -ssz * 0.02) + 46 * (W / 1920);
        ctx.save();
        ctx.globalAlpha = easeOut(sk);
        ctx.strokeStyle = subCol;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax, sy - ssz * 0.3);
        ctx.lineTo(ax + 28 * (W / 1920), sy - ssz * 0.3);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  // outcomes — appear at 70%
  const outStart = dur * 0.7;
  if (t >= outStart && outcomes.length > 0) {
    const colW = (W - 280) / outcomes.length;
    outcomes.forEach((out, i) => {
      const ot = outStart + i * 0.2;
      const ok = P(t, ot, ot + 0.3);
      if (ok <= 0) return;
      const osz = fitFont(ctx, out, q => SY(800, q), 32, colW - 20);
      riseText(ctx, out, x + i * (colW + 20 * (W / 1920)), 860 * (H / 1080), osz, ok,
        { f: SY(800, osz), c: textCol, ls: -osz * 0.02 });
    });
  }

  // fade to black at end
  const fade = P(t, dur - 0.3, dur);
  if (fade > 0) {
    ctx.fillStyle = '#000';
    ctx.globalAlpha = easeInOut(fade);
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}
