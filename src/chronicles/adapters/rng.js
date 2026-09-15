export function createSeededRng(seed = 1) {
  let state = seed >>> 0;
  return {
    next() {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 0x100000000;
    },
    range(min, max) {
      return min + this.next() * (max - min);
    },
    getSeedState() {
      return state;
    },
  };
}

