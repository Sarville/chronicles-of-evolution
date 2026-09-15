import { ruleset as defaultRuleset } from '../config/index.js';
import { createInitialGameState } from '../domain/state.js';
import { createResetCandidate } from '../domain/services/reset.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createCanonicalResetTransactionId({ sourceRunId, timelineId, endingId, createdAtSimulationMs }) {
  return `reset:${timelineId}:${sourceRunId}:${endingId}:${createdAtSimulationMs}`;
}

export function prepareResetTransaction(state, input = {}) {
  const endingId = input.endingId || 'ENDING_ASH';
  const createdAtSimulationMs = input.createdAtSimulationMs ?? state.run.clock.simulationMs;
  const id =
    input.id ||
    input.transactionId ||
    createCanonicalResetTransactionId({
      sourceRunId: state.run.id,
      timelineId: state.run.timelineId,
      endingId,
      createdAtSimulationMs,
    });

  return {
    id,
    transactionId: id,
    status: 'prepared',
    source: {
      runId: state.run.id,
      timelineId: state.run.timelineId,
      endingId,
    },
    closedRunId: state.run.id,
    timelineId: state.run.timelineId,
    endingId,
    createdAtSimulationMs,
    reward: clone(input.reward || {}),
    chronicleRecord: input.chronicleRecord ? clone(input.chronicleRecord) : null,
  };
}

export function createResetTransaction(state, transactionId) {
  const candidate = createResetCandidate(state, transactionId);
  return prepareResetTransaction(state, {
    id: transactionId,
    endingId: candidate.endingId,
    createdAtSimulationMs: candidate.createdAtSimulationMs,
  });
}

export function applyPreparedResetTransaction(state, transaction, options = {}) {
  if (!transaction || transaction.status !== 'prepared') {
    return { ok: false, reason: 'RESET_TRANSACTION_NOT_PREPARED' };
  }

  const meta = clone(state.meta);
  const settings = clone(state.settings);
  meta.appliedTransactions = meta.appliedTransactions || {};
  const alreadyApplied = Boolean(meta.appliedTransactions[transaction.id]);

  if (!alreadyApplied) {
    if (Number.isFinite(transaction.reward?.archiveFragments)) {
      meta.archiveFragments = (meta.archiveFragments || 0) + transaction.reward.archiveFragments;
    }
    if (transaction.chronicleRecord) {
      const chronicle = Array.isArray(meta.chronicle) ? meta.chronicle : [];
      if (!chronicle.some((record) => record.transactionId === transaction.id)) {
        chronicle.push({ ...clone(transaction.chronicleRecord), transactionId: transaction.id });
      }
      meta.chronicle = chronicle;
    }
    meta.appliedTransactions[transaction.id] = {
      status: 'applied',
      source: clone(transaction.source),
      appliedAtSimulationMs: state.run.clock.simulationMs,
    };
  }

  const nextState = createInitialGameState({
    ruleset: options.ruleset || defaultRuleset,
    runId: options.nextRunId || `${transaction.source.runId}:next`,
  });
  nextState.meta = meta;
  nextState.settings = settings;
  nextState.session.dirty = true;

  return { ok: true, state: nextState, transaction, alreadyApplied };
}
