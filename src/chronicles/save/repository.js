import { ruleset } from '../config/index.js';
import { createInitialGameState, toPersistedGameState } from '../domain/state.js';
import { validateGameState } from '../domain/validation.js';
import { jsonCodec } from './codec.js';
import { CURRENT_SCHEMA_VERSION, migrateEnvelope, normalizeEnvelope } from './migrations.js';

export const SAVE_KEYS = Object.freeze({
  primary: 'chronicles_evolution',
  backup: 'chronicles_evolution.backup',
  pending: 'chronicles_evolution.pending',
});

export const SAVE_FORMAT = 'chronicles-evolution-save';
export const OLD_RULESET_RESTART_VERSIONS = new Set(['timeline1-v1']);

function nowIso(clock) {
  return new Date(clock ? clock.getNow() : Date.now()).toISOString();
}

export function createSaveEnvelope(state, options = {}) {
  const persisted = toPersistedGameState(state);
  const timestamp = nowIso(options.clock);
  return normalizeEnvelope({
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
  });
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
  if (!envelope || typeof envelope !== 'object') {
    return { ok: false, errors: ['Save envelope must be an object'] };
  }
  if (envelope.format !== SAVE_FORMAT) {
    errors.push('Invalid save format');
  }
  if (envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    errors.push(`Unsupported schema version ${envelope.schemaVersion}`);
  }
  if (envelope.rulesetVersion !== ruleset.version) {
    errors.push(`Unsupported ruleset version ${envelope.rulesetVersion}`);
  }
  if (!Number.isInteger(envelope.saveRevision) || envelope.saveRevision < 1) {
    errors.push('Save revision must be a positive integer');
  }
  if (!envelope.createdAt || !envelope.updatedAt) {
    errors.push('Save envelope must include createdAt and updatedAt');
  }
  if (!envelope.transactions || !Object.prototype.hasOwnProperty.call(envelope.transactions, 'pendingReset')) {
    errors.push('Save envelope must include transactions.pendingReset');
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
    if (payload === null) {
      return { ok: false, reason: 'MISSING' };
    }
    const parsed = parseEnvelope(payload, codec);
    if (!parsed.ok) {
      return parsed;
    }
    if (OLD_RULESET_RESTART_VERSIONS.has(parsed.envelope?.rulesetVersion)) {
      return { ok: false, reason: 'OLD_RULESET_RESTART_REQUIRED', envelope: parsed.envelope };
    }
    const validation = validateEnvelope(parsed.envelope);
    if (!validation.ok) {
      return { ok: false, reason: 'VALIDATION_FAILED', errors: validation.errors };
    }
    return { ok: true, envelope: parsed.envelope };
  }

  return {
    loadOrCreate(options = {}) {
      const loadedSlots = [SAVE_KEYS.primary, SAVE_KEYS.pending, SAVE_KEYS.backup].map((key) => ({ key, loaded: readKey(key) }));
      const candidates = loadedSlots
        .filter((candidate) => candidate.loaded.ok);

      const primary = candidates.find((candidate) => candidate.key === SAVE_KEYS.primary);
      const recovered =
        primary ||
        candidates
          .filter((candidate) => candidate.key !== SAVE_KEYS.primary)
          .sort((a, b) => b.loaded.envelope.saveRevision - a.loaded.envelope.saveRevision)[0];

      if (recovered) {
        return {
          ok: true,
          state: {
            run: recovered.loaded.envelope.run,
            meta: recovered.loaded.envelope.meta,
            settings: recovered.loaded.envelope.settings,
            session: { dirty: false, lastEvents: [] },
          },
          envelope: recovered.loaded.envelope,
          sourceKey: recovered.key,
        };
      }
      const oldRuleset = loadedSlots
        .filter((candidate) => candidate.loaded.reason === 'OLD_RULESET_RESTART_REQUIRED')
        .sort((a, b) => (b.loaded.envelope.saveRevision || 0) - (a.loaded.envelope.saveRevision || 0))[0];
      if (oldRuleset) {
        const state = createInitialGameState();
        state.meta = normalizeEnvelope(oldRuleset.loaded.envelope).meta;
        state.settings = normalizeEnvelope(oldRuleset.loaded.envelope).settings;
        return {
          ok: true,
          state,
          created: true,
          oldRulesetRestarted: true,
          previousRulesetVersion: oldRuleset.loaded.envelope.rulesetVersion,
          sourceKey: oldRuleset.key,
        };
      }
      const damagedSlots = [SAVE_KEYS.primary, SAVE_KEYS.pending, SAVE_KEYS.backup]
        .map((key) => ({ key, loaded: readKey(key) }))
        .filter((candidate) => candidate.loaded.reason !== 'MISSING')
        .map((candidate) => ({
          key: candidate.key,
          reason: candidate.loaded.reason,
          errors: candidate.loaded.errors || [],
        }));

      if (damagedSlots.length > 0 && !options.startFreshAfterCorruption) {
        return { ok: false, reason: 'RECOVERY_REQUIRED', damagedSlots };
      }
      return { ok: true, state: createInitialGameState(), created: true };
    },

    startFreshAfterCorruption() {
      return this.loadOrCreate({ startFreshAfterCorruption: true });
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
