// Master bus: sidechain ducking, soft limiter, gain management.

export function createMasterBus(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0.85;

  // soft limiter via dynamics compressor
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -3;
  limiter.knee.value = 2;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.001;
  limiter.release.value = 0.05;

  master.connect(limiter);
  limiter.connect(ctx.destination);

  return { master, limiter };
}

// Sidechain: duck `target` gain when `trigger` fires
// Returns a function: triggerDuck(t) — call on each kick
export function createSidechain(ctx, target, duckGain = 0.3, attackSec = 0.005, releaseSec = 0.12) {
  return function triggerDuck(t) {
    target.gain.setValueAtTime(1, t);
    target.gain.linearRampToValueAtTime(duckGain, t + attackSec);
    target.gain.linearRampToValueAtTime(1, t + attackSec + releaseSec);
  };
}
