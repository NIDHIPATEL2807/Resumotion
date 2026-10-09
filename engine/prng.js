// Seeded PRNG (mulberry32) — deterministic randomness for grain, jitter, glitch.
// Never use Math.random() in the engine. Always use a seeded instance.

export function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hash-based single value: reproducible per (n, salt) — no state needed.
// Equivalent to the hs() function in the reference reel.
export function hs(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
