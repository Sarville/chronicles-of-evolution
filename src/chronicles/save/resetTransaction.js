import { createResetCandidate } from '../domain/services/reset.js';

export function createResetTransaction(state, transactionId) {
  return createResetCandidate(state, transactionId);
}

