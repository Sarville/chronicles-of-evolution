import { createRulesetIndexes } from '../config/index.js';
import { canAfford, multiplyCost, scaleCost } from './services/costs.js';
import { branchAvailable, branchCostMultiplier, prerequisitesMet } from './services/evolution.js';
import { getGoalState, goalConditionsMet } from './services/goals.js';
import {
  calculateManualReward,
  manualProcessAvailable,
  manualProcessCooldownMs,
  manualProcessInputCost,
} from './services/manualProcesses.js';
import { calculateProductionRates, producerFlowRates, producerMilestoneMultiplier, productionMultiplierForResource } from './services/production.js';
import { calculateCap } from './services/resources.js';
import { calculatePopulationCap } from './services/population.js';
import { cognitionValue } from './services/evolution.js';

export function formatResourceAmount(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return String(Math.floor(Math.max(0, value)));
}

export function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  if (days > 0) {
    return `${days}д ${hours}ч ${minutes}м`;
  }
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  if (minutes > 0) {
    return `${minutes}м ${remainingSeconds}с`;
  }
  return `${remainingSeconds}с`;
}

export function formatEtaDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0с';
  }
  const totalSeconds = Math.ceil(seconds);
  if (totalSeconds < 3600) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    if (minutes > 0 && remainingSeconds === 0) {
      return `${minutes}м`;
    }
    if (minutes > 0) {
      return `${minutes}м ${remainingSeconds}с`;
    }
    return `${remainingSeconds}с`;
  }

  const totalMinutes = Math.ceil(seconds / 60);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) {
    return `${days}д ${hours}ч ${minutes}м`;
  }
  return `${hours}ч ${minutes}м`;
}

export function formatEta(eta) {
  if (!eta || eta.status === 'unavailable') {
    return 'Недоступно';
  }
  if (eta.status === 'now') {
    return 'Сейчас';
  }
  return `≈${formatEtaDuration(eta.seconds)}`;
}

export function selectResourceAmounts(state) {
  return Object.fromEntries(Object.entries(state.run.resources).map(([id, value]) => [id, value.amount]));
}

export function selectProductionRates(state, ruleset) {
  return calculateProductionRates(state, ruleset);
}

export function timeUntilAffordable(state, ruleset, cost) {
  const rates = calculateProductionRates(state, ruleset);
  let seconds = 0;
  const missing = {};
  for (const [resourceId, amount] of Object.entries(cost || {})) {
    const current = state.run.resources[resourceId]?.amount || 0;
    const deficit = amount - current;
    if (deficit <= 0) {
      continue;
    }
    missing[resourceId] = deficit;
    if ((rates[resourceId] || 0) <= 0) {
      return { status: 'unavailable', resourceId, missing };
    }
    seconds = Math.max(seconds, deficit / rates[resourceId]);
  }
  if (seconds <= 0) {
    return { status: 'now', seconds: 0, missing };
  }
  return { status: 'waiting', seconds, missing };
}

export function selectPurchaseEta(state, ruleset, status, cost) {
  if (status === 'completed') {
    return null;
  }
  if (status === 'locked' || status === 'unknown') {
    return { status: 'unavailable' };
  }
  return timeUntilAffordable(state, ruleset, cost);
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
      cap: calculateCap(state, resourceId, ruleset),
      perSecond: calculateProductionRates(state, ruleset)[resourceId] || 0,
    }));
}

export function selectPopulation(state) {
  if (!state.run.population) return null;
  const assigned = Object.values(state.run.population.assignments || {}).reduce((sum, value) => sum + value, 0);
  return {
    ...state.run.population,
    cap: calculatePopulationCap(state),
    assigned,
    unassigned: Math.max(0, Math.floor(state.run.population.current) - assigned),
  };
}

export function selectCognition(state, ruleset) {
  const contributions = ruleset.nodes.flatMap((node) => node.cognitionContribution ? [{ nodeId: node.id, value: node.cognitionContribution }] : []);
  return { value: cognitionValue(state, contributions), max: 100 };
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
  if ((node.adaptationPointCost || 0) > (state.run.adaptation?.points || 0)) {
    return 'available_unaffordable';
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

export function selectBuildingPrice(state, ruleset, buildingId) {
  const building = createRulesetIndexes(ruleset).buildings[buildingId];
  if (!building) return null;
  const count = state.run.buildings[buildingId]?.count || 0;
  return scaleCost(building.baseCost, building.growth, count);
}

export function selectBuildingStatus(state, ruleset, buildingId) {
  const building = createRulesetIndexes(ruleset).buildings[buildingId];
  if (!building) return 'unknown';
  if (!prerequisitesMet(state, building)) return 'locked';
  const count = state.run.buildings[buildingId]?.count || 0;
  if (building.maxCount != null && count >= building.maxCount) return 'maxed';
  return canAfford(state, selectBuildingPrice(state, ruleset, buildingId)).ok
    ? 'available_affordable'
    : 'available_unaffordable';
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
  const basePerUnit = { ...(producer.output || {}) };
  const inputPerUnit = { ...(producer.input || {}) };
  const flow = producerFlowRates(state, producer, count);
  const currentTotal = flow.output;
  return {
    count,
    basePerUnit,
    inputPerUnit,
    currentInput: flow.input,
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

export function selectEvolutionRevealLevel(state, ruleset, nodeId, memo = {}) {
  if (memo[nodeId] != null) return memo[nodeId];
  const node = createRulesetIndexes(ruleset).nodes[nodeId];
  if (!node || state.run.nodes.completed[nodeId]) return -1;
  const incompleteRequirements = (node.requiresNodes || []).filter(
    (requiredId) => !requiredId.endsWith('*') && !state.run.nodes.completed[requiredId]
  );
  let level = incompleteRequirements.length
    ? Math.max(...incompleteRequirements.map((requiredId) => selectEvolutionRevealLevel(state, ruleset, requiredId, memo) + 1))
    : 0;
  if (node.requiresAnyBranchGroup && !state.run.nodes.selectedBranchByGroup[node.requiresAnyBranchGroup]) {
    const branchLevels = ruleset.branchGroups[node.requiresAnyBranchGroup]
      .map((branchNodeId) => selectEvolutionRevealLevel(state, ruleset, branchNodeId, memo));
    level = Math.max(level, Math.min(...branchLevels) + 1);
  }
  memo[nodeId] = level;
  return level;
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
  const inputCost = manualProcessInputCost(process);
  const affordable = canAfford(state, inputCost).ok;
  return {
    ...process,
    state: processState,
    available: manualProcessAvailable(state, process),
    affordable,
    inputCost,
    reward: calculateManualReward(state, ruleset, process),
    cooldownMs: manualProcessCooldownMs(state, process),
  };
}
