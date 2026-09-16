import { createRulesetIndexes } from '../config/index.js';
import { canAfford, multiplyCost, scaleCost } from './services/costs.js';
import { branchAvailable, branchCostMultiplier, prerequisitesMet } from './services/evolution.js';
import { getGoalState, goalConditionsMet } from './services/goals.js';
import { calculateManualReward, manualProcessAvailable, manualProcessCooldownMs } from './services/manualProcesses.js';
import { calculateProductionRates, producerMilestoneMultiplier, productionMultiplierForResource } from './services/production.js';

export function selectResourceAmounts(state) {
  return Object.fromEntries(Object.entries(state.run.resources).map(([id, value]) => [id, value.amount]));
}

export function selectProductionRates(state, ruleset) {
  return calculateProductionRates(state, ruleset);
}

export function selectVisibleResources(state, ruleset) {
  const indexes = createRulesetIndexes(ruleset);
  const active = indexes.eras[state.run.eraId]?.activeResources || Object.keys(state.run.resources);
  return active
    .filter((resourceId) => state.run.resources[resourceId])
    .map((resourceId) => ({
      id: resourceId,
      label: indexes.resources[resourceId]?.label || indexes.resources[resourceId]?.labelKey || resourceId,
      amount: state.run.resources[resourceId].amount,
      perSecond: calculateProductionRates(state, ruleset)[resourceId] || 0,
    }));
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
  if (!prerequisitesMet(state, node) || !branchAvailable(state, ruleset, node)) {
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

export function selectProducerStatus(state, ruleset, producerId) {
  const producer = createRulesetIndexes(ruleset).producers[producerId];
  if (!producer) {
    return 'unknown';
  }
  if (!producer.unlocksAtStart && !prerequisitesMet(state, producer)) {
    return 'locked';
  }
  return canAfford(state, selectProducerPrice(state, ruleset, producerId)).ok ? 'available_affordable' : 'available_unaffordable';
}

export function selectProducerOutputView(state, ruleset, producerId) {
  const producer = createRulesetIndexes(ruleset).producers[producerId];
  if (!producer) {
    return null;
  }
  const count = state.run.producers[producerId]?.count || 0;
  const milestoneMultiplier = producerMilestoneMultiplier(count, producer.milestones);
  const nextMilestone = (producer.milestones || []).find((candidate) => count < candidate.count) || null;
  const reachedMilestone = [...(producer.milestones || [])].reverse().find((candidate) => count >= candidate.count) || null;
  const basePerUnit = {};
  const currentTotal = {};
  for (const [resourceId, output] of Object.entries(producer.output || {})) {
    basePerUnit[resourceId] = output;
    currentTotal[resourceId] =
      count * output * milestoneMultiplier * productionMultiplierForResource(state, resourceId);
  }
  return {
    count,
    basePerUnit,
    currentTotal,
    milestoneMultiplier,
    nextMilestone,
    reachedMilestone,
  };
}

export function selectNodeCost(state, ruleset, nodeId) {
  const indexes = createRulesetIndexes(ruleset);
  const node = indexes.nodes[nodeId];
  return multiplyCost(node.cost, branchCostMultiplier(state, ruleset, node));
}

export function selectCurrentGoal(state, ruleset) {
  const indexes = createRulesetIndexes(ruleset);
  const goal = indexes.goals[state.run.goals.currentId];
  if (!goal) {
    return null;
  }
  return {
    ...goal,
    state: getGoalState(state, goal.id),
    completed: goalConditionsMet(state, goal),
  };
}

export function selectSideGoals(state, ruleset) {
  const indexes = createRulesetIndexes(ruleset);
  return state.run.goals.side.activeIds
    .map((goalId) => indexes.goals[goalId])
    .filter(Boolean)
    .map((goal) => ({ ...goal, state: getGoalState(state, goal.id), completed: goalConditionsMet(state, goal) }));
}

export function selectManualProcessView(state, ruleset, processId) {
  const process = createRulesetIndexes(ruleset).manualProcesses[processId];
  if (!process) {
    return null;
  }
  const processState = state.run.manualProcesses[processId] || { uses: 0, availableAtMs: 0 };
  return {
    ...process,
    state: processState,
    available: manualProcessAvailable(state, process),
    reward: calculateManualReward(state, ruleset, process),
    cooldownMs: manualProcessCooldownMs(state, process),
  };
}
