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
  const baseCap = config?.baseCap ?? Infinity;
  if (!Number.isFinite(baseCap)) return baseCap;
  const expansion = Object.values(state.run.modifiers.active).reduce((total, modifier) => {
    if (modifier.type !== 'resource_capacity' || modifier.resourceId !== resourceId) return total;
    return total + modifier.value;
  }, 0);
  return Math.max(0, baseCap + expansion);
}

export function addResource(state, resourceId, amount, ruleset, ports) {
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid resource delta for ${resourceId}`);
  }

  const resource = getResourceState(state, resourceId);
  const before = resource.amount;
  const cap = calculateCap(state, resourceId, ruleset);
  resource.amount = Math.min(cap, Math.max(0, before + amount));
  state.run.stats.totalEarned ||= {};
  state.run.stats.totalEarned[resourceId] =
    (state.run.stats.totalEarned[resourceId] || 0) + Math.max(0, resource.amount - before);

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
