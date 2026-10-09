// Easing library — all functions map t ∈ [0,1] → [0,1]

export const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;

// linear progress: clamp((t - a) / (b - a))
export const P = (t, a, b) => clamp((t - a) / (b - a));

// linear interp
export const L = (a, b, k) => a + (b - a) * k;

export const easeOut  = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);  // expo out
export const easeIn   = x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10);  // expo in
export const easeInOut = x =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;         // cubic in-out

// back-out (overshoot then settle) — used for box slam
export const backOut = x => {
  const c1 = 1.9, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
