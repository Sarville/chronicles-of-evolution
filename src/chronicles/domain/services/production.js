import { createRulesetIndexes } from '../../config/index.js';
import { addResource } from './resources.js';
import { isAutoProductionUnlocked } from './modifiers.js';

export function producerMilestoneMultiplier(count, milestones = []) {
  return milestones.reduce((multiplier, milestone) => {
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

export function producerFlowRates(state, producer, count) {
  const milestoneMultiplier = producerMilestoneMultiplier(count, producer.milestones);
  const output = {};
  const input = {};
  for (const [resourceId, amount] of Object.entries(producer.output || {})) {
    output[resourceId] = count * amount * milestoneMultiplier * productionMultiplierForResource(state, resourceId);
  }
  for (const [resourceId, amount] of Object.entries(producer.input || {})) {
    // Source efficiency can improve output, but never creates a free input.
    input[resourceId] = count * amount;
  }
  return { input, output };
}

function activeProducerFlows(state, ruleset) {
  const autoProductionUnlocked = isAutoProductionUnlocked(state);
  const indexes = createRulesetIndexes(ruleset);
  return Object.entries(state.run.producers)
    .map(([producerId, producerState]) => ({ producer: indexes.producers[producerId], count: producerState.count || 0 }))
    .filter(({ producer, count }) => producer && count && (autoProductionUnlocked || producer.producesBeforeAutoUnlock === true))
    .map(({ producer, count }) => ({ producer, ...producerFlowRates(state, producer, count) }));
}

export function calculateProductionRates(state, ruleset) {
  const rates = {};
  for (const flow of activeProducerFlows(state, ruleset)) {
    for (const [resourceId, amount] of Object.entries(flow.output)) rates[resourceId] = (rates[resourceId] || 0) + amount;
    for (const [resourceId, amount] of Object.entries(flow.input)) rates[resourceId] = (rates[resourceId] || 0) - amount;
  }

  return rates;
}

export function applyProduction(state, ruleset, deltaMs, ports) {
  if (state.run.lifecycle !== 'active') {
    return { rates: {}, events: [] };
  }
  const seconds = deltaMs / 1000;
  const flows = activeProducerFlows(state, ruleset);
  const available = Object.fromEntries(Object.entries(state.run.resources).map(([resourceId, resource]) => [resourceId, resource.amount]));
  const actualRates = {};
  const appliedFlows = flows.map((flow) => {
    let scale = 1;
    for (const [resourceId, rate] of Object.entries(flow.input)) {
      const needed = rate * seconds;
      if (needed > 0) scale = Math.min(scale, Math.max(0, (available[resourceId] || 0) / needed));
    }
    for (const [resourceId, rate] of Object.entries(flow.input)) available[resourceId] = Math.max(0, (available[resourceId] || 0) - rate * seconds * scale);
    return { ...flow, scale };
  });
  const events = [];
  for (const flow of appliedFlows) {
    for (const [resourceId, rate] of Object.entries(flow.input)) {
      const appliedRate = rate * flow.scale;
      actualRates[resourceId] = (actualRates[resourceId] || 0) - appliedRate;
      events.push(...addResource(state, resourceId, -appliedRate * seconds, ruleset, ports));
    }
    for (const [resourceId, rate] of Object.entries(flow.output)) {
      const appliedRate = rate * flow.scale;
      actualRates[resourceId] = (actualRates[resourceId] || 0) + appliedRate;
      events.push(...addResource(state, resourceId, appliedRate * seconds, ruleset, ports));
    }
  }
  return { rates: actualRates, events };
}
