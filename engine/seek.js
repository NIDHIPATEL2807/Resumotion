// window.seek(t) API — called by render.js for frame-exact export.
// Sets the player to an absolute time t (seconds) and renders one frame.

// This file is injected into preview.html.
// The player calls window.__registerSeek(fn) to register the seek handler.

(function () {
  let _seekFn = null;

  window.__registerSeek = function (fn) {
    _seekFn = fn;
  };

  window.seek = function (t) {
    if (_seekFn) _seekFn(t);
  };
})();
