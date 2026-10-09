// Synthesis primitives — identical code runs in live AudioContext and OfflineAudioContext.
// All functions accept an AudioContext (or OfflineAudioContext) as first arg.

// midi note → frequency
export const mf = n => 440 * Math.pow(2, (n - 69) / 12);

// schedule absolute time within context
export const A = (ctx, t) => ctx.currentTime + t;

// create oscillator + gain, connected to dest
export function osc(ctx, t, dur, type, freq, dest) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = 0;
  o.connect(g);
  g.connect(dest);
  o.start(A(ctx, t));
  o.stop(A(ctx, t + dur + 0.1));
  return { o, g };
}

// create noise source
export function noise(ctx, dur, dest, filterType = 'lowpass', filterFreq = 2000) {
  const bufLen = ctx.sampleRate * (dur + 0.5);
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = filterType;
  filt.frequency.value = filterFreq;
  const g = ctx.createGain();
  g.gain.value = 0;
  src.connect(filt);
  filt.connect(g);
  g.connect(dest);
  src.start();
  return { src, g };
}

// simple ADSR envelope on a GainNode
export function env(g, ctx, t, attack, peak, release) {
  g.gain.setValueAtTime(0, A(ctx, t));
  g.gain.linearRampToValueAtTime(peak, A(ctx, t + attack));
  g.gain.exponentialRampToValueAtTime(0.0001, A(ctx, t + attack + release));
}

// send a gain node to a reverb/delay with wet level
export function send(g, wet, dest) {
  if (!dest) return;
  const s = g.context.createGain();
  s.gain.value = wet;
  g.connect(s);
  s.connect(dest);
}

// ── instruments ──────────────────────────────────────────────────────────────

export function kick(ctx, t, vol = 0.9, dest) {
  const { g } = osc(ctx, t, 0.5, 'sine', 60, dest);
  const o2 = ctx.createOscillator();
  o2.type = 'sine';
  o2.frequency.setValueAtTime(160, A(ctx, t));
  o2.frequency.exponentialRampToValueAtTime(40, A(ctx, t + 0.08));
  o2.connect(g);
  o2.start(A(ctx, t));
  o2.stop(A(ctx, t + 0.5));
  env(g, ctx, t, 0.003, vol, 0.22);
}

export function clap(ctx, t, vol = 0.6, dest) {
  const { g } = noise(ctx, 0.12, dest, 'bandpass', 1800);
  env(g, ctx, t, 0.003, vol, 0.1);
}

export function hihat(ctx, t, vol = 0.3, dest) {
  const { g } = noise(ctx, 0.08, dest, 'highpass', 8000);
  env(g, ctx, t, 0.001, vol, 0.05);
}

export function bass(ctx, t, note, vol = 0.2, dest) {
  const { g } = osc(ctx, t, 0.38, 'sawtooth', mf(note), dest);
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = 400;
  g.connect(filt);
  filt.connect(dest);
  env(g, ctx, t, 0.005, vol, 0.3);
}

export function pad(ctx, t, notes, dur, vol, dest, reverb) {
  for (const n of notes) {
    const { g } = osc(ctx, t, dur, 'sine', mf(n), dest);
    env(g, ctx, t, 0.3, vol, dur * 0.7);
    if (reverb) send(g, 0.8, reverb);
  }
}

export function tick(ctx, t, freq, vol, dest) {
  const { g } = osc(ctx, t, 0.04, 'sine', freq, dest);
  env(g, ctx, t, 0.001, vol, 0.03);
}

export function blip(ctx, t, vol = 0.1, dest) {
  const { g } = osc(ctx, t, 0.06, 'sine', 1200, dest);
  env(g, ctx, t, 0.002, vol, 0.05);
}

export function pop(ctx, t, dest) {
  const { g } = osc(ctx, t, 0.08, 'sine', 80, dest);
  env(g, ctx, t, 0.001, 0.5, 0.07);
}

export function whoosh(ctx, t, dur, vol, freqLo, freqHi, dest) {
  const { src, g } = noise(ctx, dur, dest, 'bandpass', (freqLo + freqHi) / 2);
  env(g, ctx, t, 0.05, vol, dur * 0.8);
}

export function boing(ctx, t, dest) {
  const { o, g } = osc(ctx, t, 0.4, 'sine', 300, dest);
  o.frequency.exponentialRampToValueAtTime(80, A(ctx, t + 0.15));
  env(g, ctx, t, 0.002, 0.3, 0.35);
}

// create a simple convolution reverb
export function createReverb(ctx, dur = 2.5, decay = 3) {
  const len = ctx.sampleRate * dur;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  const rev = ctx.createConvolver();
  rev.buffer = buf;
  return rev;
}
