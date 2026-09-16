import { createDomainEvent } from '../domainEvents.js';
import { initializePopulation } from './population.js';
import { addResource } from './resources.js';

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
  initializePopulation(state, era);
  const startEvents = Object.entries(era.civilizationStart?.resources || {}).flatMap(([resourceId, amount]) => {
    return addResource(state, resourceId, amount, ruleset, ports);
  });
  return [createDomainEvent('era_changed', { previousEraId, eraId: nextEraId }, state, ports), ...startEvents];
}
