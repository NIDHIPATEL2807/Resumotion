# Craft — Claude Reference

Hard-won lessons from 6 reels across 5 themes. Read before writing a single line of HTML.

---

## Rendering & pipeline

**1. One self-contained HTML per person.**
`window.__render(t)` is a pure function of t — no side effects, no state that drifts. `window.__audio()` returns a base64 WAV from `OfflineAudioContext` running the exact same `score()` as the live preview. Same code = perfect sync.

**2. No `Math.random()`, no timers, no `Date.now()`.**
Seeded hash only. Derive seed from the person's name:
```js
const hs = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
const seed = name.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0) % 10000;
// use hs(seed + offset) for every independent random value
```
Same person → same grain, jitter, box positions, glitch timing every time.

**3. Render in chunks — never one long command.**
The claude.ai sandbox kills commands after ~5 minutes. ~400–600 frames per chunk is safe. Write frames to disk per chunk, encode in a separate pass. Resume from the last frame on timeout. Implement this from day one in `toolkit/render.js` — don't retrofit it.

**4. Two encodes, two targets.**
- Master: `-crf 20` (high quality)
- Social: `-crf 25 -tune grain` (textured reels) or `-crf 26 -tune stillimage` (calm reels like Prospectus)
- Target: < 30 MB for chat upload limit, < 100 MB for GitHub

**5. Keep everything in the repo.**
Workspaces reset between sessions. Every theme, reference, helper, and reference HTML lives in the repo — not in scratch folders. If it's not committed, it's gone.

---

## Canvas

**6. Font loading — the most common failure.**
`document.fonts.ready` fires too early for canvas. Canvas fonts don't load until first used, so `fonts.ready` resolves before they're actually available.

```js
await Promise.all([
  document.fonts.load('800 1em Syne'),
  document.fonts.load('600 1em Syne'),
  document.fonts.load('400 1em Syne'),
  document.fonts.load('700 1em JetBrains Mono'),
  document.fonts.load('400 1em JetBrains Mono'),
  // every family/weight you use
])
```
Call this before frame 0. If any frame renders before this resolves, it will use system fonts and look wrong.

**7. globalAlpha — the fades-break bug.**
Every helper and every `save()` block must **multiply** globalAlpha, never assign it. Assigning it overrides the caller's alpha — scene fades, composite effects, and transparency chains all break silently.

```js
// wrong — breaks parent fades
ctx.globalAlpha = k;

// right — composable
ctx.globalAlpha = (opts.a ?? 1) * k;
```
This was the cause of all broken fades in Prospectus. Apply it everywhere without exception.

**8. Text measurement and fit-to-width.**
Syne 800 is extremely wide. Every headline, name, company name, and counter needs fit-to-width — don't eyeball it.

```js
// measure after setting ctx.font
ctx.font = `800 ${sz}px Syne`;
ctx.letterSpacing = ls + 'px';
const w = ctx.measureText(str).width;

// fit helper
function FIT(ctx, str, fontFn, maxSize, maxWidth) {
  const w = TW(ctx, str, fontFn(maxSize));
  return w > maxWidth ? Math.floor(maxSize * maxWidth / w) : maxSize;
}
```
For counters: fit using the **final value**, not the current animated value. Otherwise the text jumps as it counts up.

**9. One font family name per Indic script.**
Never bundle multiple scripts under one family name — canvas mis-renders them. Use `Indic0`, `Indic1`, `Indic2` etc. for each script family.

**10. Cut-outs and iris wipes.**
Don't rely on counter-clockwise arcs alone — they behave differently across browsers. Use `evenodd` fill rule:
```js
ctx.beginPath();
ctx.rect(0, 0, W, H);
ctx.moveTo(cx + r, cy);
ctx.arc(cx, cy, r, 0, Math.PI * 2);
ctx.fill('evenodd'); // cuts the circle out of the rectangle
```

**11. Timed world objects (Speedrun, side-scrollers).**
Place objects by integrating speed into a distance table, not by guessing pixel positions:
```js
// build once: D[i] = distance at frame i
const D = [0];
for (let i = 1; i < totalFrames; i++) D[i] = D[i-1] + SPEED(i/FPS) / FPS;
// place an object to be at screen x=520 on beat b:
const WX = beat => D[Math.round(beat * B * FPS)] + 520;
```
This makes every jump, coin pickup, and block bump land exactly on its beat. The gameplay becomes the drum track.

**12. Particles and confetti.**
Particles must fade out before readable contact info appears. HUD panels should hide during finale moments. Neither is optional — both caused layout failures across multiple reels.

---

## Audio

**13. Every visual event gets a sound.**
Big moments (name slam, drop, outro) get full hits. Small moments (box lock, stat tick) get soft ticks. Some micro-moments get nothing — but nothing big should happen silently. The silence beat must be digitally silent: cut the music bus gain in ≤ 30 ms. Reverb tails leak through a bus cut — cut the reverb return too if true silence is required.

**14. Sidechain + master bus.**
Sidechain the music bus on kicks (gain 0.45 → 1 over 0.24 s). Compressor on master (-16 dB threshold, 4:1). Peak-normalise to −1 dBFS on export.

**15. Check RMS per 2-second window after rendering.**
- Drop must be louder than the intro
- Intros must not be near-silent (RMS < 0.01–0.02 is too quiet)
- Silence is truly zero (not just quiet)

**16. XY / oscilloscope audio — special rules.**
XY audio must bypass all dynamics processing and reverb (direct to destination). Otherwise the drawing distorts. Generate XY buffers per AudioContext sample rate — 44.1k for live preview, 48k for offline export; they're different. Resample contours by arc length, 2 samples per jump, 6 ms fades at segment edges. Persistence = draw the last ~50 ms of samples in chunks with age-based alpha; break the path where consecutive points jump > ~34 px.

---

## Assets

**17. Logos: one colour only, user-supplied only.**
Never fetch logos from the web. Convert user-supplied logos to one colour via luminance/saturation alpha:
```js
// draw the logo, then overlay the target colour source-atop
ctx.drawImage(logo, x, y, w, h);
ctx.globalCompositeOperation = 'source-atop';
ctx.fillStyle = accentColor;
ctx.globalAlpha = 0.75;
ctx.fillRect(x, y, w, h);
ctx.globalCompositeOperation = 'source-over';
```

**18. Mascots.**
Request ≥ 800 px transparent PNG. Never edit the image itself — frame it (e.g. the Speedrun kart hides a soft bottom fade and adds wheels). The mascot's identity is its look; don't distort or recolour it.

---

## Process

**19. Contact sheet before every full render.**
Render ~12 stills (one per scene) into a contact sheet before the full render. Every overlap bug across all 6 reels was visible in the contact sheet. This catches layout problems in seconds, not minutes. Automate an overflow/overlap check on these stills.

**20. Script.md approval is the contract.**
Show the person every scene, every time range, every word of on-screen text before building. Their edits become facts — update `facts.json` immediately. Never silently change approved words post-Gate 1.

**21. Ask before publishing to any shareable link.**
Users can decline. One did.

---

## Theme-matching (from XY Mode lesson)

**22. Match the person's discipline, not just their tools.**
An oscilloscope reads as signals/measurement — not VLSI. The XY theme was visually strong but wrong for a chip designer. The correct framing for VLSI is the chip flow: RTL → place & route → floorplan → coverage → DRC/LVS/timing sign-off → tape-out → first silicon. Use the XY trick only as the "first silicon" finale, not the whole identity.

**23. Hook in the first 2 seconds.**
XY Mode buried the hook at 4 s. Perception v2 and IPO Day got it in the first 2. If the hook isn't visible in frame 1–2, restructure the opener.
