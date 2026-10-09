// Perception theme score — drone → drop → groove → build → silence → resolve
// Runs identically in live AudioContext and OfflineAudioContext.
// All timing is absolute seconds from context start.

import { kick, clap, hihat, bass, pad, tick, blip, pop, whoosh, boing, createReverb, mf, A } from '../../engine/audio/synth.js';
import { createMasterBus, createSidechain } from '../../engine/audio/mixer.js';
import { hs } from '../../engine/prng.js';

// Impact timestamps (seconds) and their intensity — drives camera shake too
export const IMPACTS = [
  [7.5, 1], [12.15, 0.45], [14.75, 0.6], [16.5, 0.85],
  [20.5, 1], [25.5, 0.7], [30.5, 0.6], [35.5, 0.6],
  [40.5, 1], [41.5, 0.9], [42.5, 0.9], [43.5, 0.9], [44.5, 0.9],
];

export const SOFT_IMPACTS = [
  22, 22.75, 23.5, 24.25, 27, 28.25,
  33.5, 34.5, 38.25, 39.25, 47, 48.1, 49.2, 50.3, 51.4,
];

// D minor root notes (midi) for bass line
const ROOTS = {
  drone:  50, // D2
  drop:   50,
  groove: 50,
  build:  52,
  outro:  55,
};

function ROOT(t) {
  if (t < 7.5)  return ROOTS.drone;
  if (t < 16.5) return ROOTS.drop;
  if (t < 40.5) return ROOTS.groove;
  if (t < 52.5) return ROOTS.build;
  return ROOTS.outro;
}

export async function buildScore(audioCtx, totalDuration) {
  const { master } = createMasterBus(audioCtx);
  const rev = createReverb(audioCtx);
  rev.connect(master);

  // separate bus for bass so we can sidechain it
  const bassBus = audioCtx.createGain();
  bassBus.gain.value = 1;
  bassBus.connect(master);
  const duck = createSidechain(audioCtx, bassBus, 0.3, 0.005, 0.12);

  // ── DRONE (0–7.5) ─────────────────────────────────────────────────────────
  pad(audioCtx, 0, [50, 53, 57], 7.5, 0.025, master, rev);

  // ── GROOVE (7.5–52.5) — kick + clap + bass every half beat ───────────────
  for (let t = 7.5; t < 52.5; t += 0.5) {
    const b = Math.round((t - 7.5) / 0.5);
    // kick on every beat, skip if it's an impact frame (handled separately)
    const isImpact = IMPACTS.some(([ti]) => Math.abs(ti - t) < 0.02);
    if (!isImpact) kick(audioCtx, t, 0.9, master);
    duck(A(audioCtx, t));

    // clap on beats 2 and 4
    if (t >= 11.5 && b % 4 === 2) clap(audioCtx, t, t < 16.5 ? 0.6 : 1.0, master);

    // bass
    bass(audioCtx, t, ROOT(t) + ((b % 8 === 3 || b % 8 === 6) && t >= 16.5 ? 12 : 0),
      0.2, bassBus);
  }

  // ── HATS (7.5–52.5) ───────────────────────────────────────────────────────
  for (let t = 7.5; t < 52.5; t += 0.25) hihat(audioCtx, t, 0.15, master);

  // ── IMPACT KICKS ─────────────────────────────────────────────────────────
  for (const [ti, v] of IMPACTS) kick(audioCtx, ti, v, master);

  // ── SOFT TICKS (box locks, stats) ─────────────────────────────────────────
  for (const ti of SOFT_IMPACTS) tick(audioCtx, ti, 2200 + hs(ti) * 600, 0.05, master);

  // ── OUTRO (52.5–totalDuration) ───────────────────────────────────────────
  const outro = audioCtx.createGain();
  outro.gain.value = 1;
  outro.connect(master);
  pad(audioCtx, 53, [50, 53, 57, 64], 6.4, 0.032, outro, rev);

  // email tick sequence
  for (let i = 0; i < 20; i++) tick(audioCtx, 55 + i * 0.035, 2400 + hs(i) * 1000, 0.05, outro);
  blip(audioCtx, 55.9, 0.1, outro);
  pop(audioCtx, 57.05, outro);
  boing(audioCtx, 57.1, outro);
  for (let i = 0; i < 4; i++) tick(audioCtx, 57.45 + i * 0.05, 2800, 0.07, outro);
  whoosh(audioCtx, 58.05, 0.65, 0.15, 800, 5000, outro);

  // fade out
  outro.gain.setValueAtTime(1, A(audioCtx, totalDuration - 0.9));
  outro.gain.linearRampToValueAtTime(0, A(audioCtx, totalDuration));

  return { master };
}
