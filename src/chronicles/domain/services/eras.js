import { createDomainEvent } from '../domainEvents.js';
import { initializePopulation } from './population.js';
import { addResource } from './resources.js';
import { createInitialCrisisState } from './crisis.js';

function remapJobsForEra(state, eraId, ruleset) {
  const assignments = state.run.population?.assignments;
  if (!assignments) return;
  const remapped = {};
  for (const [jobId, count] of Object.entries(assignments)) {
    if (!count) continue;
    const oldJob = ruleset.jobs.find((job) => job.id === jobId);
    if (!oldJob) continue;
    const replacement = ruleset.jobs.find((job) => job.eraIds?.includes(eraId) && job.lineage === oldJob.lineage);
    if (replacement) remapped[replacement.id] = (remapped[replacement.id] || 0) + count;
  }
  state.run.population.assignments = remapped;
}

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
  remapJobsForEra(state, nextEraId, ruleset);
  if (nextEraId === 'ATOMIC' && !state.run.crisis) {
    state.run.crisis = createInitialCrisisState();
  }
  const startEvents = Object.entries(era.civilizationStart?.resources || {}).flatMap(([resourceId, amount]) => {
    return addResource(state, resourceId, amount, ruleset, ports);
  });
  return [
    createDomainEvent('era_changed', { previousEraId, eraId: nextEraId }, state, ports),
    ...(nextEraId === 'ATOMIC' ? [createDomainEvent('crisis_started', { stability: state.run.crisis?.stability ?? 100 }, state, ports)] : []),
    ...startEvents,
  ];
}
