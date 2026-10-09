// Player: loads script.json + theme, manages the render loop and seek API.
// Pure function render path: scene(ctx, localT, data, theme) — no global state.

import { makeTimeline } from './timeline.js';

export async function createPlayer(canvas, script, theme) {
  const tl = makeTimeline(script.bpm);
  const sceneMap = tl.buildSceneMap(script.scenes);
  const totalDuration = tl.totalSeconds(sceneMap);

  const ctx = canvas.getContext('2d');
  let animFrame = null;
  let startWallTime = null;
  let seekTime = null; // non-null during frame-exact export

  // Load all scene renderers from the theme
  const renderers = {};
  for (const sceneType of Object.keys(theme.scenes ?? {})) {
    try {
      const mod = await import(`../themes/${script.theme}/scenes/${sceneType}.js`);
      renderers[sceneType] = mod.default ?? mod.render;
    } catch {
      console.warn(`No renderer for scene type: ${sceneType}`);
    }
  }

  function renderFrame(t) {
    const frame = tl.toFrame(t);
    const { scene, localT } = tl.resolve(sceneMap, t);

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = script.palette?.bg ?? '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // dispatch to scene renderer
    const render = renderers[scene.type];
    if (render) {
      render(ctx, localT, scene.data ?? {}, script, theme, frame);
    } else {
      // fallback: black frame with scene type label
      ctx.fillStyle = '#F5F5F5';
      ctx.font = '400 24px JBM';
      ctx.textAlign = 'center';
      ctx.fillText(`[${scene.type}]`, canvas.width / 2, canvas.height / 2);
    }
  }

  function loop(wallTime) {
    if (startWallTime === null) startWallTime = wallTime;
    const t = Math.min((wallTime - startWallTime) / 1000, totalDuration);
    renderFrame(t);
    if (t < totalDuration) {
      animFrame = requestAnimationFrame(loop);
    }
  }

  // seek API (used by render.js)
  if (typeof window !== 'undefined' && window.__registerSeek) {
    window.__registerSeek(t => {
      seekTime = t;
      renderFrame(t);
    });
  }

  return {
    play() {
      startWallTime = null;
      animFrame = requestAnimationFrame(loop);
    },
    pause() {
      if (animFrame) cancelAnimationFrame(animFrame);
    },
    seekTo(t) {
      renderFrame(t);
    },
    totalDuration,
    sceneMap,
    tl,
  };
}
