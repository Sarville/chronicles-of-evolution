export const CURRENT_SCHEMA_VERSION = 1;

export function normalizeEnvelope(envelope) {
  if (!envelope || envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return envelope;
  }

  return {
    ...envelope,
    run: {
      ...envelope.run,
      flags: envelope.run?.flags || {},
    },
    meta: {
      archiveFragments: 0,
      chronicle: [],
      persistentFlags: {},
      seenEntities: {},
      ...(envelope.meta || {}),
    },
    settings: {
      locale: 'ru',
      autosave: true,
      ...(envelope.settings || {}),
    },
    transactions: {
      pendingReset: null,
      ...(envelope.transactions || {}),
    },
  };
}

export function migrateEnvelope(envelope) {
  if (!envelope || envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return envelope;
  }
  return normalizeEnvelope(envelope);
}
