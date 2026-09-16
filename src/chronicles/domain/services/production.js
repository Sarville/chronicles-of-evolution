import { createRulesetIndexes } from '../../config/index.js';
import { addResource } from './resources.js';
import { isAutoProductionUnlocked } from './modifiers.js';

const PRODUCER_MILESTONES = [
  { count: 50, multiplier: 2.5 },
  { count: 25, multiplier: 2 },
  { count: 10, multiplier: 2 },
];

export function producerMilestoneMultiplier(count) {
  return PRODUCER_MILESTONES.reduce((multiplier, milestone) => {
    return count >= milestone.count ? multiplier * milestone.multiplier : multiplier;
  }, 1);
}

export function productionMultiplierForResource(state, resourceId) {
  let multiplier = 1;
  for (const modifier of Object.values(state.run.modifiers.active)) {
    if (modifier.type === 'global_production_multiplier') {
      multiplier *= modifier.value;
    }
    if (modifier.type === 'resource_production_multiplier' && modifier.resourceId === resourceId) {
      multiplier *= modifier.value;
    }
  }
  return multiplier;
}

export function calculateProductionRates(state, ruleset) {
  const autoProductionUnlocked = isAutoProductionUnlocked(state);
  const indexes = createRulesetIndexes(ruleset);
  const rates = {};

  for (const [producerId, producerState] of Object.entries(state.run.producers)) {
    const producer = indexes.producers[producerId];
    if (!producer || !producerState.count) {
      continue;
    }
    if (!autoProductionUnlocked && producer.producesBeforeAutoUnlock !== true) {
      continue;
    }

    const milestoneMultiplier = producerMilestoneMultiplier(producerState.count);
    for (const [resourceId, output] of Object.entries(producer.output)) {
      const resourceMultiplier = productionMultiplierForResource(state, resourceId);
      rates[resourceId] =
        (rates[resourceId] || 0) + producerState.count * output * milestoneMultiplier * resourceMultiplier;
    }
  }

  return rates;
}

export function applyProduction(state, ruleset, deltaMs, ports) {
  if (state.run.lifecycle !== 'active') {
    return { rates: {}, events: [] };
  }
  const seconds = deltaMs / 1000;
  const rates = calculateProductionRates(state, ruleset);
  const events = [];
  for (const [resourceId, perSecond] of Object.entries(rates)) {
    events.push(...addResource(state, resourceId, perSecond * seconds, ruleset, ports));
  }
  return { rates, events };
}
