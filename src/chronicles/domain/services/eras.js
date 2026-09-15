import { createDomainEvent } from '../domainEvents.js';

export function applyEraTransition(state, nextEraId, ruleset, ports) {
  if (!nextEraId || state.run.eraId === nextEraId) {
    return [];
  }
  const era = ruleset.eras.find((candidate) => candidate.id === nextEraId);
  if (!era) {
    return [];
  }
  const previousEraId = state.run.eraId;
  state.run.eraId = nextEraId;
  state.run.chapterId = era.chapterId;
  return [createDomainEvent('era_changed', { previousEraId, eraId: nextEraId }, state, ports)];
}

