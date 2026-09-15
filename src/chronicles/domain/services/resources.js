import { createRulesetIndexes } from '../../config/index.js';
import { createDomainEvent } from '../domainEvents.js';

export function getResourceState(state, resourceId) {
  if (!state.run.resources[resourceId]) {
    state.run.resources[resourceId] = { amount: 0 };
  }
  return state.run.resources[resourceId];
}

export function calculateCap(state, resourceId, ruleset) {
  const resourceState = state.run.resources[resourceId];
  if (resourceState && resourceState.capOverride != null) {
    return resourceState.capOverride;
  }
  const indexes = createRulesetIndexes(ruleset);
  const config = indexes.resources[resourceId];
  return config ? config.baseCap : Infinity;
}

export function addResource(state, resourceId, amount, ruleset, ports) {
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid resource delta for ${resourceId}`);
  }

  const resource = getResourceState(state, resourceId);
  const before = resource.amount;
  const cap = calculateCap(state, resourceId, ruleset);
  resource.amount = Math.min(cap, Math.max(0, before + amount));
  state.run.stats.totalEarned[resourceId] = Math.max(
    state.run.stats.totalEarned[resourceId] || 0,
    (state.run.stats.totalEarned[resourceId] || 0) + Math.max(0, resource.amount - before)
  );

  if (before !== resource.amount) {
    return [
      createDomainEvent(
        'resource_changed',
        { resourceId, before, after: resource.amount, delta: resource.amount - before },
        state,
        ports
      ),
    ];
  }
  return [];
}

