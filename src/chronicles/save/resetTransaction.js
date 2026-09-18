import { ruleset as defaultRuleset } from '../config/index.js';
import { createInitialGameState } from '../domain/state.js';
import { createResetCandidate } from '../domain/services/reset.js';
import { applyArchiveRecallPerks, applyArchiveRecallEndgamePerks } from '../domain/services/archiveRecall.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const NEXT_ACT_ONE_ATTEMPT = { T1: 'T2', T2: 'T3', T3: 'T4', T4: 'T5' };

function formatTimelineId(timelineId) {
  return String(timelineId).padStart(3, '0');
}

export function createCanonicalResetTransactionId({ timelineId, endingId }) {
  return `timeline_${formatTimelineId(timelineId)}_ending_${endingId}`;
}

export function prepareResetTransaction(state, input = {}) {
  const endingId = input.endingId || 'ENDING_ASH';
  const createdAtSimulationMs = input.createdAtSimulationMs ?? state.run.clock.simulationMs;
  const id =
    input.id ||
    input.transactionId ||
    createCanonicalResetTransactionId({
      timelineId: state.run.timelineId,
      endingId,
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
  meta.appliedTransactions = Array.isArray(meta.appliedTransactions) ? meta.appliedTransactions : [];
  const alreadyApplied = meta.appliedTransactions.includes(transaction.id);

  if (!alreadyApplied) {
    if (Number.isFinite(transaction.reward?.archiveFragments)) {
      meta.archiveFragments = (meta.archiveFragments || 0) + transaction.reward.archiveFragments;
    }
    if (transaction.reward?.archiveRecallPerk) {
      const { chapterKey, styleChoice, perkId, defensePerkId } = transaction.reward.archiveRecallPerk;
      meta.archiveRecall = meta.archiveRecall || { chapters: {}, endgame: {} };
      meta.archiveRecall.chapters = { ...meta.archiveRecall.chapters, [chapterKey]: { styleChoice, perkId, defensePerkId: defensePerkId ?? null } };
    }
    if (transaction.reward?.archiveRecallEndgamePerk) {
      const grant = transaction.reward.archiveRecallEndgamePerk;
      meta.archiveRecall = meta.archiveRecall || { chapters: {}, endgame: {} };
      const endgame = { ...(meta.archiveRecall.endgame || {}) };
      if (grant.unlock) {
        endgame[grant.unlock] = 1;
      } else if (grant.scaleAll) {
        for (const perkKey of Object.keys(endgame)) endgame[perkKey] = (endgame[perkKey] || 0) + 1;
      }
      meta.archiveRecall.endgame = endgame;
    }
    if (transaction.chronicleRecord) {
      const chronicle = Array.isArray(meta.chronicle) ? meta.chronicle : [];
      if (!chronicle.some((record) => record.transactionId === transaction.id)) {
        chronicle.push({ ...clone(transaction.chronicleRecord), transactionId: transaction.id });
      }
      meta.chronicle = chronicle;
    }
    meta.appliedTransactions.push(transaction.id);
  }

  const nextState = createInitialGameState({
    ruleset: options.ruleset || defaultRuleset,
    runId: options.nextRunId || `${transaction.source.runId}:next`,
  });
  nextState.meta = meta;
  nextState.settings = settings;
  nextState.session.dirty = true;
  if (transaction.reward?.archiveRecallPerk) {
    const nextAttempt = NEXT_ACT_ONE_ATTEMPT[transaction.reward.archiveRecallPerk.chapterKey];
    if (nextAttempt) nextState.run.actOneAttempt = nextAttempt;
  }
  // T5 loops back to itself: Act 2/3 don't exist yet in code, and every
  // further T5 completion keeps mattering via the endgame perks' numeric
  // scaling (docs/gdd/10_META_PROGRESSION.md sec.4.4/4.6).
  if (transaction.reward?.archiveRecallEndgamePerk) {
    nextState.run.actOneAttempt = 'T5';
  }
  applyArchiveRecallPerks(nextState);
  applyArchiveRecallEndgamePerks(nextState);

  return { ok: true, state: nextState, transaction, alreadyApplied };
}
