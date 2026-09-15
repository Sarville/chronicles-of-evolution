import { ruleset } from '../config/index.js';
import { createInitialGameState, toPersistedGameState } from '../domain/state.js';
import { validateGameState } from '../domain/validation.js';
import { jsonCodec } from './codec.js';
import { CURRENT_SCHEMA_VERSION, migrateEnvelope } from './migrations.js';

export const SAVE_KEYS = Object.freeze({
  primary: 'chronicles_evolution',
  backup: 'chronicles_evolution.backup',
  pending: 'chronicles_evolution.pending',
});

export const SAVE_FORMAT = 'chronicles-evolution-save';

function nowIso(clock) {
  return new Date(clock ? clock.getNow() : Date.now()).toISOString();
}

export function createSaveEnvelope(state, options = {}) {
  const persisted = toPersistedGameState(state);
  const timestamp = nowIso(options.clock);
  return {
    format: SAVE_FORMAT,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    saveRevision: options.saveRevision || 1,
    gameVersion: options.gameVersion || '1.4.10',
    rulesetVersion: state.run.rulesetVersion,
    createdAt: options.createdAt || timestamp,
    updatedAt: timestamp,
    ...persisted,
    transactions: {
      pendingReset: null,
      ...(options.transactions || {}),
    },
  };
}

export function parseEnvelope(payload, codec = jsonCodec) {
  try {
    const decoded = codec.decode(payload);
    const envelope = JSON.parse(decoded);
    return { ok: true, envelope: migrateEnvelope(envelope) };
  } catch (error) {
    return { ok: false, reason: 'PARSE_FAILED', error };
  }
}

export function validateEnvelope(envelope) {
  const errors = [];
  if (!envelope || envelope.format !== SAVE_FORMAT) {
    errors.push('Invalid save format');
  }
  if (envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    errors.push(`Unsupported schema version ${envelope.schemaVersion}`);
  }
  if (envelope.rulesetVersion !== ruleset.version) {
    errors.push(`Unsupported ruleset version ${envelope.rulesetVersion}`);
  }
  const stateValidation = validateGameState(
    { run: envelope.run, meta: envelope.meta, settings: envelope.settings, session: { dirty: false } },
    ruleset
  );
  errors.push(...stateValidation.errors);
  return { ok: errors.length === 0, errors };
}

export function createSaveRepository({ storage, codec = jsonCodec, clock } = {}) {
  if (!storage) {
    throw new Error('SaveRepository requires a StoragePort');
  }

  function encodeEnvelope(envelope) {
    return codec.encode(JSON.stringify(envelope));
  }

  function readKey(key) {
    const payload = storage.get(key);
    if (!payload) {
      return { ok: false, reason: 'MISSING' };
    }
    const parsed = parseEnvelope(payload, codec);
    if (!parsed.ok) {
      return parsed;
    }
    const validation = validateEnvelope(parsed.envelope);
    if (!validation.ok) {
      return { ok: false, reason: 'VALIDATION_FAILED', errors: validation.errors };
    }
    return { ok: true, envelope: parsed.envelope };
  }

  return {
    loadOrCreate() {
      for (const key of [SAVE_KEYS.primary, SAVE_KEYS.pending, SAVE_KEYS.backup]) {
        const loaded = readKey(key);
        if (loaded.ok) {
          return {
            ok: true,
            state: {
              run: loaded.envelope.run,
              meta: loaded.envelope.meta,
              settings: loaded.envelope.settings,
              session: { dirty: false, lastEvents: [] },
            },
            envelope: loaded.envelope,
            sourceKey: key,
          };
        }
      }
      return { ok: true, state: createInitialGameState(), created: true };
    },

    save(state, options = {}) {
      const current = readKey(SAVE_KEYS.primary);
      const saveRevision = current.ok ? current.envelope.saveRevision + 1 : 1;
      const envelope = createSaveEnvelope(state, {
        ...options,
        clock,
        saveRevision,
        createdAt: current.ok ? current.envelope.createdAt : undefined,
      });
      const validation = validateEnvelope(envelope);
      if (!validation.ok) {
        return { ok: false, reason: 'VALIDATION_FAILED', errors: validation.errors };
      }

      const encoded = encodeEnvelope(envelope);
      storage.set(SAVE_KEYS.pending, encoded);
      const pending = readKey(SAVE_KEYS.pending);
      if (!pending.ok || pending.envelope.saveRevision !== envelope.saveRevision) {
        return { ok: false, reason: 'PENDING_VERIFY_FAILED' };
      }

      const primaryPayload = storage.get(SAVE_KEYS.primary);
      if (primaryPayload) {
        storage.set(SAVE_KEYS.backup, primaryPayload);
      }
      storage.set(SAVE_KEYS.primary, encoded);

      const primary = readKey(SAVE_KEYS.primary);
      if (!primary.ok || primary.envelope.saveRevision !== envelope.saveRevision) {
        return { ok: false, reason: 'PRIMARY_VERIFY_FAILED' };
      }
      storage.remove(SAVE_KEYS.pending);
      state.session.dirty = false;
      return { ok: true, envelope };
    },
  };
}

