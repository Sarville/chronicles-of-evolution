export const CURRENT_SCHEMA_VERSION = 1;

export function migrateEnvelope(envelope) {
  if (!envelope || envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return envelope;
  }
  return envelope;
}

