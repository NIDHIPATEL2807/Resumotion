// toolkit/audio.js — synth kit + mixer
// The same score(ctx, T0) runs in live AudioContext and OfflineAudioContext.
// All generated buffers (XY, noise) must use ctx.sampleRate, not a hardcoded value.

// ─── Core ────────────────────────────────────────────────────────────────────

// Oscillator with ADSR envelope
export const osc = (ctx, freq, {type='sine', detune=0, a=0.005, d=0.1, s=0.7, r=0.3, vol=1, t0=0, dur=1}) => {
  const g = ctx.createGain();
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  if (detune) o.detune.value = detune;
  o.connect(g);
  const t1 = t0 + a, t2 = t1 + d, t3 = t0 + dur, t4 = t3 + r;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t1);
  g.gain.linearRampToValueAtTime(vol * s, t2);
  g.gain.setValueAtTime(vol * s, t3);
  g.gain.linearRampToValueAtTime(0, t4);
  o.start(t0); o.stop(t4 + 0.01);
  return g;
};

// Envelope-only gain (for external sources)
export const env = (ctx, {a=0.005, d=0.1, s=0.7, r=0.3, vol=1, t0=0, dur=1}) => {
  const g = ctx.createGain();
  const t1 = t0 + a, t2 = t1 + d, t3 = t0 + dur, t4 = t3 + r;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t1);
  g.gain.linearRampToValueAtTime(vol * s, t2);
  g.gain.setValueAtTime(vol * s, t3);
  g.gain.linearRampToValueAtTime(0, t4);
  return g;
};

// Noise generator (white/pink) through a biquad filter
export const noise = (ctx, {type='lowpass', freq=1000, q=1, vol=1, t0=0, dur=0.1, r=0.05}) => {
  const sr = ctx.sampleRate;
  const len = Math.ceil((dur + r) * sr);
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  // seeded white noise — NOT Math.random
  const seed = Math.round(t0 * 1000);
  const hs = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  for (let i = 0; i < len; i++) data[i] = (hs(seed + i * 0.001) - 0.5) * 2;

  const src = ctx.createBufferSource();
  src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = type; flt.frequency.value = freq; flt.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.linearRampToValueAtTime(0, t0 + dur + r);
  src.connect(flt); flt.connect(g);
  src.start(t0); src.stop(t0 + dur + r + 0.01);
  return g;
};

// Pulse wave via PeriodicWave (duty: 0.125 = 12.5%, 0.25 = 25%, 0.5 = 50%)
export const pulseWave = (ctx, duty = 0.25) => {
  const N = 2048;
  const re = new Float32Array(N), im = new Float32Array(N);
  for (let k = 1; k < N; k++) {
    im[k] = (2 / (Math.PI * k)) * Math.sin(Math.PI * k * duty);
  }
  return ctx.createPeriodicWave(re, im, { disableNormalization: false });
};

// ─── Instruments ─────────────────────────────────────────────────────────────

// kick: sine pitch sweep + noise click
export const kick = (ctx, t0, vol = 1) => {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(165, t0);
  o.frequency.exponentialRampToValueAtTime(44, t0 + 0.11);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.38);
  o.connect(g); o.start(t0); o.stop(t0 + 0.4);
  const n = noise(ctx, { type: 'highpass', freq: 60, vol: vol * 0.18, t0, dur: 0.015, r: 0.005 });
  return [g, n];
};

// clap: 3 band-passed noise bursts
export const clap = (ctx, t0, vol = 1) => {
  return [0, 0.012, 0.028].map((off, i) =>
    noise(ctx, { type: 'bandpass', freq: 1500, q: 0.8, vol: vol * [1, 0.7, 0.5][i], t0: t0 + off, dur: 0.04, r: 0.08 })
  );
};

// hat: short hi-pass noise
export const hat = (ctx, t0, vol = 0.5, open = false) =>
  noise(ctx, { type: 'highpass', freq: 7500, q: 0.5, vol, t0, dur: open ? 0.18 : 0.03, r: open ? 0.12 : 0.02 });

// bass: saw + square (detuned 1.004), resonant LP, sidechain input on returned gain
export const bass = (ctx, t0, midiNote, vol = 0.3, dur = 0.25) => {
  const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
  const g = ctx.createGain();
  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass'; flt.frequency.value = 1100; flt.Q.value = 6;
  flt.frequency.setValueAtTime(1100, t0);
  flt.frequency.exponentialRampToValueAtTime(160, t0 + 0.06);
  ['sawtooth', 'square'].forEach((type, i) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq * (i ? 1.004 : 1);
    o.connect(flt); o.start(t0); o.stop(t0 + dur + 0.05);
  });
  g.gain.setValueAtTime(vol, t0);
  g.gain.linearRampToValueAtTime(0, t0 + dur + 0.04);
  flt.connect(g);
  return g;
};

// pad: detuned saws through LP, slow attack
export const pad = (ctx, t0, midiNotes, dur = 4, vol = 0.05) => {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.6);
  g.gain.setValueAtTime(vol, t0 + dur - 0.5);
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass';
  flt.frequency.setValueAtTime(500, t0);
  flt.frequency.linearRampToValueAtTime(1600, t0 + 0.5);
  flt.connect(g);
  for (const note of midiNotes) {
    const freq = 440 * Math.pow(2, (note - 69) / 12);
    for (const det of [-9, 0, 9]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      o.detune.value = det;
      o.connect(flt); o.start(t0); o.stop(t0 + dur + 0.1);
    }
  }
  return g;
};

// pluck: saw through fast LP decay
export const pluck = (ctx, t0, midiNote, vol = 0.06) => {
  const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
  const o = ctx.createOscillator();
  o.type = 'sawtooth'; o.frequency.value = freq;
  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass';
  flt.frequency.setValueAtTime(3800, t0);
  flt.frequency.exponentialRampToValueAtTime(500, t0 + 0.3);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
  o.connect(flt); flt.connect(g);
  o.start(t0); o.stop(t0 + 0.4);
  return g;
};

// bell: inharmonic partials (for outros, wins)
export const bell = (ctx, t0, midiNote, vol = 0.08, dur = 1.2) => {
  const f0 = 440 * Math.pow(2, (midiNote - 69) / 12);
  const partials = [[1, 1], [2.76, 0.5], [5.4, 0.25], [8.93, 0.12]];
  const nodes = partials.map(([ratio, amp]) => {
    const o = ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = f0 * ratio;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * amp, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur * (1 / ratio + 0.2));
    o.connect(g); o.start(t0); o.stop(t0 + dur + 0.1);
    return g;
  });
  return nodes;
};

// piano: harmonic partials with decay
export const piano = (ctx, t0, midiNote, vol = 0.1, dur = 0.8) => {
  const f0 = 440 * Math.pow(2, (midiNote - 69) / 12);
  return [1, 2, 3, 4, 5].map((h, i) => {
    const o = ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = f0 * h;
    const g = ctx.createGain();
    const amp = vol / (i + 1);
    g.gain.setValueAtTime(amp, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur * (1 - i * 0.1));
    o.connect(g); o.start(t0); o.stop(t0 + dur + 0.1);
    return g;
  });
};

// ─── SFX ─────────────────────────────────────────────────────────────────────

// impact: kick + sub + noise LP + crack HP + reverse swell (scheduled 0.5 s before t0)
export const impact = (ctx, t0, vol = 1) => {
  const nodes = [];
  const [kg, kn] = kick(ctx, t0, vol);
  nodes.push(kg, kn);
  // sub
  const sub = ctx.createOscillator();
  const subG = ctx.createGain();
  sub.frequency.setValueAtTime(41, t0);
  sub.frequency.exponentialRampToValueAtTime(30, t0 + 0.2);
  subG.gain.setValueAtTime(vol * 0.9, t0);
  subG.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
  sub.connect(subG); sub.start(t0); sub.stop(t0 + 0.55);
  nodes.push(subG);
  // noise swell (starts before t0)
  nodes.push(noise(ctx, { type: 'lowpass', freq: 1100, vol: vol * 0.4, t0: t0 - 0.5, dur: 0.45, r: 0.05 }));
  // crack
  nodes.push(noise(ctx, { type: 'highpass', freq: 2600, vol: vol * 0.3, t0, dur: 0.02, r: 0.03 }));
  return nodes;
};

// riser: band-pass noise sweeping up
export const riser = (ctx, t0, dur = 2, vol = 0.3) => {
  const n = noise(ctx, { type: 'bandpass', freq: 400, q: 2, vol, t0, dur, r: 0.1 });
  return n;
};

// whoosh: wide band-pass sweep
export const whoosh = (ctx, t0, vol = 0.4) => {
  const n = noise(ctx, { type: 'bandpass', freq: 200, q: 1.5, vol, t0, dur: 0.25, r: 0.1 });
  return n;
};

// tick/key: short high sine
export const tick = (ctx, t0, freq = 2600, vol = 0.06) => {
  const o = ctx.createOscillator();
  o.type = 'sine'; o.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.02);
  o.connect(g); o.start(t0); o.stop(t0 + 0.03);
  return g;
};

// blip: two-note triangle
export const blip = (ctx, t0, f1 = 1760, f2 = 2637, vol = 0.12) => {
  return [f1, f2].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = 'triangle'; o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * (i ? 0.7 : 1), t0 + i * 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.04 + 0.06);
    o.connect(g); o.start(t0 + i * 0.04); o.stop(t0 + i * 0.04 + 0.08);
    return g;
  });
};

// chime: 4-note pulse ascending
export const chime = (ctx, t0, root = 60, vol = 0.15) => {
  return [0, 4, 7, 12].map((semi, i) => {
    const t = t0 + i * 0.07;
    const freq = 440 * Math.pow(2, (root + semi - 69) / 12);
    const o = ctx.createOscillator();
    o.setPeriodicWave(pulseWave(ctx, 0.25));
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); o.start(t); o.stop(t + 0.35);
    return g;
  });
};

// stab: sharp square chord
export const stab = (ctx, t0, midiNotes, vol = 0.2) => {
  return midiNotes.map(note => {
    const freq = 440 * Math.pow(2, (note - 69) / 12);
    const o = ctx.createOscillator();
    o.type = 'square'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.15);
    o.connect(g); o.start(t0); o.stop(t0 + 0.2);
    return g;
  });
};

// alarm: AM modulated sine
export const alarm = (ctx, t0, dur = 0.4, vol = 0.3) => {
  const carrier = ctx.createOscillator();
  carrier.frequency.value = 880;
  const modG = ctx.createGain();
  const mod = ctx.createOscillator();
  mod.frequency.value = 8;
  modG.gain.value = 0.5;
  mod.connect(modG); modG.connect(carrier.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  carrier.connect(g); carrier.start(t0); carrier.stop(t0 + dur + 0.01);
  mod.start(t0); mod.stop(t0 + dur + 0.01);
  return g;
};

// pop/boing: pitch drop
export const pop = (ctx, t0, vol = 0.2) => {
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(600, t0);
  o.frequency.exponentialRampToValueAtTime(80, t0 + 0.18);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
  o.connect(g); o.start(t0); o.stop(t0 + 0.25);
  return g;
};

// ─── Mixer ────────────────────────────────────────────────────────────────────

// buildMixer(ctx) → { mus, sfx, xyOut, master, connect(node, bus) }
// Buses: mus (music, cut for silences), sfx, xyOut (bypasses dynamics)
// master → compressor → destination
export const buildMixer = (ctx) => {
  const master = ctx.createGain();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 4;
  comp.attack.value = 0.003; comp.release.value = 0.25;
  master.connect(comp); comp.connect(ctx.destination);

  const mus = ctx.createGain(); mus.gain.value = 1;
  const sfx = ctx.createGain(); sfx.gain.value = 1;
  const xyOut = ctx.createGain(); xyOut.gain.value = 1; // bypasses compressor
  mus.connect(master); sfx.connect(master); xyOut.connect(ctx.destination);

  // sidechain duck: call duck(t) each kick to pump the music bus
  const duck = (t) => {
    mus.gain.setValueAtTime(0.45, t);
    mus.gain.linearRampToValueAtTime(1, t + 0.24);
  };

  // cutMusic: silence the music bus instantly (for silence beats)
  const cutMusic = (t, dur, fadeMs = 0.03) => {
    mus.gain.setValueAtTime(1, t - fadeMs);
    mus.gain.linearRampToValueAtTime(0, t);
    mus.gain.setValueAtTime(0, t + dur);
    mus.gain.linearRampToValueAtTime(1, t + dur + fadeMs);
  };

  const connect = (node, bus = mus) => {
    if (Array.isArray(node)) node.forEach(n => n && n.connect(bus));
    else if (node) node.connect(bus);
  };

  return { mus, sfx, xyOut, master, duck, cutMusic, connect };
};

// ─── WAV export ──────────────────────────────────────────────────────────────

// Encode an AudioBuffer to a base64 WAV string, peak-normalised to -1 dBFS
export const encodeWAV = (buffer) => {
  const numCh = buffer.numberOfChannels;
  const sr = buffer.sampleRate;
  const len = buffer.length;

  // collect channels and peak-normalise
  const channels = Array.from({ length: numCh }, (_, i) => buffer.getChannelData(i));
  let peak = 0;
  channels.forEach(ch => ch.forEach(s => { const a = Math.abs(s); if (a > peak) peak = a; }));
  const gain = peak > 0 ? 0.891 / peak : 1; // -1 dBFS = 0.891

  const byteLen = len * numCh * 2;
  const ab = new ArrayBuffer(44 + byteLen);
  const view = new DataView(ab);

  const wr = (pos, str) => { for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i)); };
  const wi = (pos, v, size = 4) => { if (size === 4) view.setUint32(pos, v, true); else view.setUint16(pos, v, true); };
  wr(0, 'RIFF'); wi(4, 36 + byteLen); wr(8, 'WAVE');
  wr(12, 'fmt '); wi(16, 16); wi(20, 1, 2); wi(22, numCh, 2);
  wi(24, sr); wi(28, sr * numCh * 2); wi(32, numCh * 2, 2); wi(34, 16, 2);
  wr(36, 'data'); wi(40, byteLen);

  let off = 44;
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < numCh; c++) {
      const s = Math.max(-1, Math.min(1, channels[c][i] * gain));
      view.setInt16(off, s < 0 ? s * 32768 : s * 32767, true);
      off += 2;
    }
  }

  const bytes = new Uint8Array(ab);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(bin);
};
