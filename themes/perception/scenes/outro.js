// outro scene — CTA, contact, dot journey to center
// data: { cta, email, github?, linkedin?, site?, label, conf }

import { drawText, riseText, fitFont, textWidth } from '../../../engine/fx.js';
import { P, L, easeOut, easeInOut, clamp, backOut } from '../../../engine/easing.js';

const SY = (w, s) => `${w} ${s}px Syne`;
const MO = (w, s) => `${w} ${s}px JBM`;

export default function render(ctx, t, data, script, theme, frame) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const C = theme.palette ?? script.palette;
  const accent = C.accent ?? '#FF6B2B';
  const fg = C.fg ?? '#F2EDE6';
  const mu = C.muted ?? '#7a726b';

  const dur = data.scene_duration ?? 8;
  const cta    = data.cta    ?? "Let's build something.";
  const email  = data.email  ?? '';
  const github = data.github ?? '';
  const site   = data.site   ?? '';
  const fo = 1 - P(t, dur - 0.5, dur - 0.1);

  // CTA — big, centered
  const ctaSz = fitFont(ctx, cta, q => SY(800, q), 80, W - 320);
  const ctaF  = SY(800, ctaSz);
  const ctaLs = -ctaSz * 0.03;
  const ctaW  = textWidth(ctx, cta, ctaF, ctaLs);

  // split at last space for two-tone: up-to-last-word in fg, last word in accent
  const spaceIdx = cta.lastIndexOf(' ');
  const part1 = spaceIdx > 0 ? cta.slice(0, spaceIdx) : cta;
  const part2 = spaceIdx > 0 ? cta.slice(spaceIdx + 1) : '';

  const riseK = P(t, 0.15, 0.55);
  const x0 = W / 2 - ctaW / 2;

  riseText(ctx, part1, x0, H / 2 - ctaSz * 0.1, ctaSz, riseK,
    { f: ctaF, c: fg, ls: ctaLs, a: fo });

  if (part2) {
    const p1w = textWidth(ctx, part1 + ' ', ctaF, ctaLs);
    riseText(ctx, part2, x0 + p1w, H / 2 - ctaSz * 0.1, ctaSz, P(t, 0.25, 0.6),
      { f: ctaF, c: accent, ls: ctaLs, a: fo });
  }

  // contact line
  const contactParts = [email, github, site].filter(Boolean);
  const contactStr = contactParts.join('     ');
  if (contactStr) {
    drawText(ctx, contactStr, W / 2, H / 2 + ctaSz * 0.9, {
      f: MO(400, 24 * (H / 1080)),
      c: mu,
      al: 'center',
      a: P(t, 0.6, 0.9) * fo,
    });
  }

  // label + conf HUD
  if (data.label) {
    drawText(ctx, data.label, 36 * (W / 1920) + 18, 36 * (H / 1080) + 40,
      { f: `400 22px JBM`, c: fg, a: P(t, 0.1, 0.4) * fo });
    drawText(ctx, `conf: ${(data.conf ?? 1.0).toFixed(2)}`,
      W - 54 * (W / 1920), 36 * (H / 1080) + 40,
      { f: `400 22px JBM`, c: accent, al: 'right', a: P(t, 0.1, 0.4) * fo });
  }

  // dot journeys to center at end
  if (t >= dur - 1.5) {
    const k = easeInOut(P(t, dur - 1.5, dur - 0.3));
    const dotX = L(W - 80 * (W / 1920), W / 2, k);
    const dotY = L(H - 80 * (H / 1080), H / 2, k) - Math.sin(k * Math.PI) * 120;
    ctx.save();
    ctx.fillStyle = k > 0.05 ? accent : '#e84a4a';
    ctx.beginPath();
    ctx.arc(dotX, dotY, L(8, 9, k), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // end card — "made with resumotion°"
  if (t >= dur - 0.8) {
    const ek = P(t, dur - 0.8, dur - 0.3);
    drawText(ctx, 'made with resumotion°', W / 2, H - 48 * (H / 1080), {
      f: MO(400, 18 * (H / 1080)),
      c: mu,
      al: 'center',
      a: easeOut(ek),
    });
  }
}
