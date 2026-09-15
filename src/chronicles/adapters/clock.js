export function createFakeClock(startMs = 0) {
  let now = startMs;
  let paused = false;
  let timeScale = 1;
  let tickHandler = null;

  return {
    start(onTick) {
      tickHandler = onTick;
    },
    stop() {
      tickHandler = null;
    },
    setPaused(nextPaused) {
      paused = nextPaused;
    },
    setTimeScale(nextScale) {
      timeScale = nextScale;
    },
    getNow() {
      return now;
    },
    advance(deltaMs) {
      now += deltaMs;
      if (tickHandler && !paused) {
        tickHandler(deltaMs * timeScale);
      }
    },
  };
}

