// toolkit/helpers.js — shared canvas + math primitives
// Every reel imports this. All functions are pure. No DOM access at module level.

// ─── Math ────────────────────────────────────────────────────────────────────

export const cl  = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
export const P   = (t, a, b) => cl((t - a) / (b - a));
export const L   = (a, b, k) => a + (b - a) * k;

// easings
export const eo  = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);          // easeOutExpo
export const ei  = x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10);          // easeInExpo
export const eio = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3)/2;  // easeInOutCubic
export const es  = x => x < .5 ? 2*x*x : -1+(4-2*x)*x;                  // easeInOutQuad
export const bo  = (c1 = 1.9) => x => {                                   // easeOutBack (strength param)
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// seeded hash — deterministic "random" from a number
// derive seed from name: name.split('').reduce((a,c,i)=>a+c.charCodeAt(0)*(i+1),0)%10000
export const hs = n => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ─── Time ────────────────────────────────────────────────────────────────────

// Call initTime(BPM) once per reel, then use TB / BT / sceneAt
let _B = 0.5; // seconds per beat (default 120 BPM)
export const initTime = bpm => { _B = 60 / bpm; };
export const TB = beat => beat * _B;        // beats → seconds
export const BT = t    => t / _B;           // seconds → beats

// sceneAt(t, scenes) where scenes = [[name, beat0, beat1], ...]
// returns the current scene name or null
export const sceneAt = (t, scenes) => {
  for (const [name, b0, b1] of scenes)
    if (t >= TB(b0) && t < TB(b1)) return name;
  return null;
};

// ENV — fade a scene in at its start and lift out over the last 0.4 s
// fn(a) is called with the computed alpha if t is inside [t0, t1]
export const ENV = (ctx, t, t0, t1, fn, fadeIn = 0.25, fadeOut = 0.4) => {
  if (t < t0 || t >= t1) return;
  const a = Math.min(P(t, t0, t0 + fadeIn), 1 - P(t, t1 - fadeOut, t1));
  fn(cl(a));
};

// ─── Text ─────────────────────────────────────────────────────────────────────

// Measure text width (sets font + letterSpacing on ctx)
export const TW = (ctx, s, font, ls = 0) => {
  ctx.save();
  ctx.font = font;
  ctx.letterSpacing = ls + 'px';
  const w = ctx.measureText(s).width;
  ctx.restore();
  return w;
};

// Fit: shrink maxSize until text fits maxWidth
export const FIT = (ctx, s, fontFn, maxSize, maxWidth, ls = 0) => {
  const w = TW(ctx, s, fontFn(maxSize), ls);
  return w > maxWidth ? Math.floor(maxSize * maxWidth / w) : maxSize;
};

// Draw text — always multiplies globalAlpha, never sets it
export const T = (ctx, s, x, y, opts = {}) => {
  if (!s) return;
  ctx.save();
  ctx.font        = opts.f  || '800 80px Syne';
  ctx.fillStyle   = opts.c  || '#F2EDE6';
  ctx.textAlign   = opts.al || 'left';
  ctx.textBaseline = opts.bl || 'alphabetic';
  ctx.letterSpacing = (opts.ls || 0) + 'px';
  ctx.globalAlpha *= (opts.a ?? 1);
  if (opts.glow) {
    ctx.shadowColor = opts.glow;
    ctx.shadowBlur  = opts.glowR || 18;
  }
  // push to overlap registry in debug mode
  if (typeof window !== 'undefined' && window.__boxes) {
    const w = TW(ctx, s, ctx.font, opts.ls || 0);
    const m = ctx.measureText(s);
    const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    const bx = opts.al === 'center' ? x - w/2 : opts.al === 'right' ? x - w : x;
    window.__boxes.push({ text: s, x: bx, y: y - m.actualBoundingBoxAscent, w, h, scene: window.__currentScene || '' });
  }
  ctx.fillText(s, x, y);
  ctx.restore();
};

// RISE — text slides up from behind a clip mask
export const RISE = (ctx, s, x, y, sz, k, opts = {}) => {
  if (k <= 0) return;
  ctx.save();
  const font = opts.f || `800 ${sz}px Syne`;
  ctx.font = font;
  ctx.letterSpacing = (opts.ls || 0) + 'px';
  const w   = ctx.measureText(s).width;
  const x0  = opts.al === 'center' ? x - w/2 : opts.al === 'right' ? x - w : x;
  ctx.beginPath();
  ctx.rect(x0 - 40, y - sz * 1.05, w + 80, sz * 1.38);
  ctx.clip();
  ctx.fillStyle    = opts.c || '#F2EDE6';
  ctx.globalAlpha *= (opts.a ?? 1);
  ctx.textAlign    = opts.al || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y + (1 - eo(k)) * sz * 1.15);
  ctx.restore();
};

// OUT — text flies up and out (reverse RISE)
export const OUT = (ctx, s, x, y, sz, k, opts = {}) => {
  RISE(ctx, s, x, y, sz, 1 - k, { ...opts, a: (opts.a ?? 1) * (1 - k) });
};

// TYPE — typewriter: returns how many characters to show at time t
export const TYPE = (s, t, t0, cps = 30) => {
  const n = Math.floor((t - t0) * cps);
  return n <= 0 ? '' : n >= s.length ? s : s.slice(0, n);
};

// WRAP — break text into lines of maxWidth
export const WRAP = (ctx, s, font, maxWidth, ls = 0) => {
  ctx.save(); ctx.font = font; ctx.letterSpacing = ls + 'px';
  const words = s.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line); line = w;
    } else { line = test; }
  }
  if (line) lines.push(line);
  ctx.restore();
  return lines;
};

// NUM — animated counter: lerps from 0 to v over k (0→1), formatted
export const NUM = (v, k, dec = 0, pre = '', suf = '') => {
  const n = v * eo(k);
  return pre + (dec ? n.toFixed(dec) : Math.round(n).toLocaleString()) + suf;
};

// ─── Canvas utilities ─────────────────────────────────────────────────────────

// Create an offscreen canvas
export const mk = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
};

// Pre-render N grain frames (call once, reuse every frame)
export const makeGrain = (w, h, n = 7, alpha = 0.055, seed = 0) => {
  return Array.from({ length: n }, (_, i) => {
    const c = mk(w, h), x = c.getContext('2d');
    const id = x.createImageData(w, h);
    for (let p = 0; p < id.data.length; p += 4) {
      const v = Math.floor(hs(seed + i * 1000 + p * 0.001) * 255);
      id.data[p] = id.data[p+1] = id.data[p+2] = v;
      id.data[p+3] = Math.floor(alpha * 255);
    }
    x.putImageData(id, 0, 0);
    return c;
  });
};

// Draw grain frame
export const drawGrain = (ctx, grains, t, fps = 30) => {
  const i = Math.floor(t * fps) % grains.length;
  ctx.drawImage(grains[i], 0, 0);
};

// Radial vignette (transparent at inner → black at outer)
export const drawVignette = (ctx, w, h, inner = 0.35, outer = 0.72) => {
  ctx.save();
  const g = ctx.createRadialGradient(w/2, h/2, inner * Math.min(w,h)/2, w/2, h/2, outer * Math.max(w,h)/2);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.72)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
};

// Cutout: draw a filled rectangle with a circular hole (evenodd)
// rect = {x,y,w,h}, circle = {cx,cy,r}
export const cutout = (ctx, fill, rect, circle) => {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.moveTo(circle.cx + circle.r, circle.cy);
  ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
  ctx.fill('evenodd');
  ctx.restore();
};

// ─── Post-processing composite ────────────────────────────────────────────────

// Apply shake, chroma split, glitch slices to a source canvas
// impacts: array of {t: number, v: number} — hit time + velocity
export const composite = (ctx, src, t, { shake, chroma, glitch, grain } = {}) => {
  const W = ctx.canvas.width, H = ctx.canvas.height;

  // screen shake
  let dx = 0, dy = 0;
  if (shake) {
    for (const { t: th, v } of shake) {
      const d = t - th;
      if (d >= 0 && d < 0.5) {
        const amp = v * Math.exp(-9 * d) * 16;
        dx += (hs(th * 100) - 0.5) * 2 * amp;
        dy += (hs(th * 200) - 0.5) * 2 * amp;
      }
    }
  }

  // chroma split
  let ca = 0;
  if (chroma) {
    for (const { t: th, v } of chroma) {
      const d = t - th;
      if (d >= 0 && d < 0.4) ca = Math.max(ca, v * Math.exp(-11 * d) * 12);
    }
  }

  if (ca > 0.5) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.55;
    ctx.drawImage(src, dx - ca, dy, W, H);
    ctx.drawImage(src, dx + ca, dy, W, H);
    ctx.restore();
    ctx.globalAlpha = 0.55;
    ctx.drawImage(src, dx, dy, W, H);
    ctx.globalAlpha = 1;
  } else {
    ctx.drawImage(src, dx, dy, W, H);
  }

  // glitch slices (horizontal strips shifted)
  if (glitch) {
    for (const { t: th } of glitch) {
      const d = t - th;
      if (d >= 0 && d < 0.12) {
        const strips = 9;
        const sh = H / strips;
        ctx.save();
        for (let i = 0; i < strips; i++) {
          const off = (hs(th * 10 + i * 3 + Math.floor(d * 30)) - 0.5) * 260;
          ctx.drawImage(src, 0, i * sh, W, sh, off, i * sh, W, sh);
        }
        ctx.restore();
      }
    }
  }

  // grain
  if (grain) drawGrain(ctx, grain.frames, t, grain.fps);
};

// ─── Font loading ─────────────────────────────────────────────────────────────

// loadFonts(['800 40px Syne', '400 40px JetBrains Mono', ...]) → Promise
export const loadFonts = specs =>
  Promise.all(specs.map(s => document.fonts.load(s)));

// ─── Image loading ────────────────────────────────────────────────────────────

// loadImages({key: 'data:image/png;base64,...'}) → Promise<{key: HTMLImageElement}>
export const loadImages = async src => {
  const out = {};
  await Promise.all(Object.entries(src).map(([k, uri]) => {
    const img = new Image();
    out[k] = img;
    img.src = uri;
    return img.decode();
  }));
  return out;
};

// Tint an image to a single colour (logo tinting)
// Returns a canvas with the image tinted to `color` at `opacity` (0–1)
export const tintImage = (img, color, opacity = 0.78) => {
  const c = mk(img.naturalWidth, img.naturalHeight);
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0);
  x.globalCompositeOperation = 'source-atop';
  x.fillStyle = color;
  x.globalAlpha = opacity;
  x.fillRect(0, 0, c.width, c.height);
  return c;
};
