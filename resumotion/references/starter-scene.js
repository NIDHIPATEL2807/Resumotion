// starter-scene.js — a complete working scene: name slam + detector box + impact sound
// Copy this into scenes.js as the name scene, then replace the placeholder content.
// All helpers come from scripts/helpers.js (already imported by player.html).

// ── Name scene (beats 0–10, example at 120 BPM) ──────────────────────────────
//
// What it shows:
//   - Frame 0: background fades in
//   - Beat 2: name slams in (big, fit-to-width, Syne 800)
//   - Beat 4: detector box locks around the name with a confidence score
//   - Beat 6: role fades in below
//   - Beat 8: identity label appears (e.g. "builder 0.99")
//   Beat timing comes from your BPM — adjust TB() calls to match.

const NAME_SCENE = {
  // ── Replace these with real content from facts.json ──
  name:      'ALEX CHEN',
  role:      'ML engineer · open to AI infra',
  label:     'builder 0.99',
  accent:    '#58A6FF',          // theme accent or brand colour
  bg:        '#0D1117',
  ink:       '#E6EDF3',
};

scenes.push(function nameScene(ctx, t, W, H, FPS, TB, hs, seed) {
  const { name, role, label, accent, bg, ink } = NAME_SCENE;

  // ── Background ──
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Name slam: scale from 96% → 100% + fade in ──
  const nameProg = eo(P(t, TB(2), TB(2.6)));
  if (nameProg > 0) {
    ctx.save();
    ctx.globalAlpha *= nameProg;

    // Fit-to-width: measure at maxSize, scale down if too wide
    const maxW = W - 240;
    const nameSz = FIT(ctx, name, 'Syne', 800, 160, maxW);
    const scale = 0.96 + 0.04 * nameProg;                   // 96%→100% scale slam

    ctx.translate(W / 2, H / 2 - 80);
    ctx.scale(scale, scale);
    ctx.translate(-W / 2, -(H / 2 - 80));

    ctx.font = `800 ${nameSz}px Syne`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = ink;
    ctx.fillText(name, W / 2, H / 2 - 80);

    ctx.restore();
  }

  // ── Detector box: locks around name on beat 4 ──
  const boxProg = eo(P(t, TB(4), TB(4.5)));
  if (boxProg > 0 && nameProg > 0) {
    const nameSz = FIT(ctx, name, 'Syne', 800, 160, W - 240);
    ctx.font = `800 ${nameSz}px Syne`;
    const nw = ctx.measureText(name).width;
    const nh = nameSz * 1.1;
    const nx = W / 2 - nw / 2, ny = H / 2 - 80 - nh / 2;
    const pad = 18;

    ctx.save();
    ctx.globalAlpha *= boxProg * nameProg;

    // Expanding corners (draws 4 L-shaped corner marks)
    const cl = 32;  // corner length
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    [
      [nx - pad, ny - pad, 1, 1],
      [nx + nw + pad, ny - pad, -1, 1],
      [nx - pad, ny + nh + pad, 1, -1],
      [nx + nw + pad, ny + nh + pad, -1, -1],
    ].forEach(([cx, cy, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy + sy * cl);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + sx * cl, cy);
      ctx.stroke();
    });

    // Label pill: "builder 0.99" bottom-right of box
    const pillFont = `700 20px 'JetBrains Mono'`;
    ctx.font = pillFont;
    const pw = ctx.measureText(label).width + 24;
    const ph = 32, px = nx + nw + pad - pw, py = ny + nh + pad + 10;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 6);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, px + 12, py + ph / 2);

    ctx.restore();
  }

  // ── Role: fades in on beat 6 ──
  const roleProg = eo(P(t, TB(6), TB(7)));
  if (roleProg > 0) {
    ctx.save();
    ctx.globalAlpha *= roleProg;
    ctx.font = `400 32px Syne`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#8B949E';   // dim
    ctx.fillText(role, W / 2, H / 2 + 60);
    ctx.restore();
  }
});

// ── Impact sound for the name slam (add to score.js) ──────────────────────────
//
// Copy the relevant lines into your score(ac, T0) function:
//
//   // Name slam hit — beat 2
//   const slamT = T0 + TB(2);
//   // sub thud
//   { const g = ac.createGain(), o = ac.createOscillator();
//     o.type = 'sine'; o.frequency.setValueAtTime(80, slamT);
//     o.frequency.exponentialRampToValueAtTime(30, slamT + 0.18);
//     g.gain.setValueAtTime(0.3, slamT); g.gain.exponentialRampToValueAtTime(0.0001, slamT + 0.3);
//     o.connect(g); g.connect(ac.destination); o.start(slamT); o.stop(slamT + 0.4); }
//   // transient click
//   { const g = ac.createGain(), o = ac.createOscillator();
//     o.type = 'square'; o.frequency.value = 200;
//     g.gain.setValueAtTime(0.18, slamT); g.gain.exponentialRampToValueAtTime(0.0001, slamT + 0.04);
//     o.connect(g); g.connect(ac.destination); o.start(slamT); o.stop(slamT + 0.06); }
//
//   // Detector box lock — beat 4
//   const lockT = T0 + TB(4);
//   [0, 0.04, 0.08].forEach((d, i) => {
//     const g = ac.createGain(), o = ac.createOscillator();
//     o.type = 'sine'; o.frequency.value = 880 + i * 440;
//     g.gain.setValueAtTime(0.04, lockT + d); g.gain.exponentialRampToValueAtTime(0.0001, lockT + d + 0.12);
//     o.connect(g); g.connect(ac.destination); o.start(lockT + d); o.stop(lockT + d + 0.2);
//   });
