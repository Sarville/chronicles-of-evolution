export function createNoopPlatformPort(locale = 'ru') {
  return {
    ready() {
      return Promise.resolve();
    },
    getLocale() {
      return locale;
    },
    getPlayerId() {
      return null;
    },
    loadCloudSave() {
      return Promise.resolve(null);
    },
    saveCloudSave() {
      return Promise.resolve({ ok: true, skipped: true });
    },
    showRewarded() {
      return Promise.resolve({ ok: false, reason: 'UNAVAILABLE' });
    },
    showInterstitial() {
      return Promise.resolve({ ok: false, reason: 'UNAVAILABLE' });
    },
    track() {},
  };
}

