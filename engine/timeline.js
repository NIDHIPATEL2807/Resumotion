// Beat clock: beats ↔ seconds ↔ frames
// Single source of truth for all timing in the engine.

export function makeTimeline(bpm, fps = 30) {
  const spb = 60 / bpm; // seconds per beat

  return {
    bpm,
    fps,
    spb,

    // beats → seconds
    toSeconds(beats) { return beats * spb; },

    // seconds → beats
    toBeats(seconds) { return seconds / spb; },

    // seconds → frame number
    toFrame(seconds) { return Math.round(seconds * fps); },

    // frame number → seconds
    fromFrame(frame) { return frame / fps; },

    // build a flat list of scene start times in seconds from a scenes array
    // each scene has a `beats` field
    buildSceneMap(scenes) {
      let cursor = 0;
      return scenes.map(scene => {
        const startSec = cursor * spb;
        const durationSec = scene.beats * spb;
        cursor += scene.beats;
        return { ...scene, startSec, durationSec, endSec: startSec + durationSec };
      });
    },

    // given absolute time t (seconds), return { scene, localT }
    // where localT is time within that scene (0 = start)
    resolve(sceneMap, t) {
      for (let i = sceneMap.length - 1; i >= 0; i--) {
        if (t >= sceneMap[i].startSec) {
          return { scene: sceneMap[i], localT: t - sceneMap[i].startSec, index: i };
        }
      }
      return { scene: sceneMap[0], localT: 0, index: 0 };
    },

    // total duration in seconds
    totalSeconds(sceneMap) {
      const last = sceneMap[sceneMap.length - 1];
      return last.endSec;
    },
  };
}
