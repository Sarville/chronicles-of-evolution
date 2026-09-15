export function createMemoryStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    set(key, value) {
      store.set(key, String(value));
    },
    remove(key) {
      store.delete(key);
    },
    snapshot() {
      return Object.fromEntries(store.entries());
    },
  };
}

export function createBrowserStorage(storage = globalThis.localStorage) {
  return {
    get(key) {
      return storage.getItem(key);
    },
    set(key, value) {
      storage.setItem(key, value);
    },
    remove(key) {
      storage.removeItem(key);
    },
  };
}

