import { createDomainEvent } from '../domainEvents.js';
import { calculateCap, getResourceState } from './resources.js';

export function round3sig(value) {
  if (value === 0) {
    return 0;
  }
  const digits = Math.floor(Math.log10(Math.abs(value))) + 1;
  const factor = 10 ** Math.max(0, digits - 3);
  return Math.round(value / factor) * factor;
}

export function scaleCost(baseCost, growth, ownedCount) {
  const nextCostNumber = ownedCount + 1;
  return Object.fromEntries(
    Object.entries(baseCost).map(([resourceId, amount]) => [
      resourceId,
      round3sig(amount * growth ** (nextCostNumber - 1)),
    ])
  );
}

export function canAfford(state, cost) {
  for (const [resourceId, amount] of Object.entries(cost)) {
    const current = state.run.resources[resourceId]?.amount || 0;
    if (current < amount) {
      return { ok: false, resourceId, missing: amount - current };
    }
  }
  return { ok: true };
}

export function payCost(state, cost, ruleset, ports) {
  const affordability = canAfford(state, cost);
  if (!affordability.ok) {
    return {
      ok: false,
      reason: 'INSUFFICIENT_RESOURCES',
      details: affordability,
      events: [],
    };
  }

  const events = [];
  for (const [resourceId, amount] of Object.entries(cost)) {
    const resource = getResourceState(state, resourceId);
    const before = resource.amount;
    resource.amount = Math.max(0, Math.min(calculateCap(state, resourceId, ruleset), before - amount));
    events.push(
      createDomainEvent(
        'resource_changed',
        { resourceId, before, after: resource.amount, delta: resource.amount - before },
        state,
        ports
      )
    );
  }
  return { ok: true, events };
}

