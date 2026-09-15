export const CURRENT_SCHEMA_VERSION = 1;

export function normalizeEnvelope(envelope) {
  if (!envelope || envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return envelope;
  }

  return {
    ...envelope,
    run: {
      ...envelope.run,
      goals: {
        currentId: envelope.run?.goals?.currentId || null,
        chapter: envelope.run?.goals?.chapter || { activeId: envelope.run?.goals?.currentId || null },
        side: envelope.run?.goals?.side || { activeIds: [] },
        states: envelope.run?.goals?.states || {},
      },
      flags: envelope.run?.flags || {},
      discovery: envelope.run?.discovery || { seenEntities: [], corruptedSeen: [] },
      manualProcesses: envelope.run?.manualProcesses || {},
      stats: {
        totalEarned: {},
        ...(envelope.run?.stats || {}),
      },
    },
    meta: {
      archiveFragments: 0,
      chronicle: [],
      appliedTransactions: [],
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
