import { createRulesetIndexes } from '../config/index.js';
import { canAfford, multiplyCost, scaleCost } from './services/costs.js';
import { branchAvailable, branchCostMultiplier, prerequisitesMet } from './services/evolution.js';
import { calculateProductionRates } from './services/production.js';

export function selectResourceAmounts(state) {
  return Object.fromEntries(Object.entries(state.run.resources).map(([id, value]) => [id, value.amount]));
}

export function selectProductionRates(state, ruleset) {
  return calculateProductionRates(state, ruleset);
}

export function selectNodeStatus(state, ruleset, nodeId) {
  const indexes = createRulesetIndexes(ruleset);
  const node = indexes.nodes[nodeId];
  if (!node) {
    return 'unknown';
  }
  if (state.run.nodes.completed[nodeId]) {
    return 'completed';
  }
  if (!prerequisitesMet(state, node) || !branchAvailable(state, node)) {
    return 'locked';
  }
  const cost = selectNodeCost(state, ruleset, nodeId);
  return canAfford(state, cost).ok ? 'available_affordable' : 'available_unaffordable';
}

export function selectProducerPrice(state, ruleset, producerId) {
  const indexes = createRulesetIndexes(ruleset);
  const producer = indexes.producers[producerId];
  const count = state.run.producers[producerId]?.count || 0;
  let cost = scaleCost(producer.baseCost, producer.growth, count);
  for (const modifier of Object.values(state.run.modifiers.active)) {
    if (modifier.type !== 'producer_cost_multiplier') {
      continue;
    }
    if ((producer.tags || []).includes(modifier.producerTag)) {
      cost = multiplyCost(cost, modifier.value);
    }
  }
  return cost;
}

export function selectNodeCost(state, ruleset, nodeId) {
  const indexes = createRulesetIndexes(ruleset);
  const node = indexes.nodes[nodeId];
  return multiplyCost(node.cost, branchCostMultiplier(state, ruleset, node));
}
