import { createRulesetIndexes } from '../config/index.js';
import { selectNodeCost, selectProducerPrice } from './selectors.js';
import { createDomainEvent } from './domainEvents.js';
import { payCost, scaleCost } from './services/costs.js';
import { applyEraTransition } from './services/eras.js';
import { branchAvailable, prerequisitesMet } from './services/evolution.js';
import { eventBlocksNode, queueEventsForGoal, queueEventsForNode, resolveEvent } from './services/events.js';
import { evaluateGoals } from './services/goals.js';
import { useManualProcess } from './services/manualProcesses.js';
import { applyEffects } from './services/modifiers.js';
import { assertPopulationRequirement } from './services/population.js';
import { addResource } from './services/resources.js';

function ok(state, events) {
  state.session.dirty = true;
  state.session.lastEvents = events;
  return { ok: true, events };
}

function withGoalEvaluation(state, ruleset, events, ports) {
  const goalEvents = evaluateGoals(state, ruleset, ports);
  const queuedEvents = goalEvents.flatMap((event) => {
    if (event.type === 'goal_completed') {
      return queueEventsForGoal(state, ruleset, event.payload.goalId, ports);
    }
    return [];
  });
  return [...events, ...goalEvents, ...queuedEvents];
}

function rejected(reason, details = {}) {
  return { ok: false, reason, details, events: [] };
}

export function dispatchCommand(state, ruleset, command, ports = {}) {
  if (!state.run || state.run.lifecycle !== 'active') {
    if (command.type === 'TICK') {
      return { ok: true, events: [], frozen: true };
    }
    return rejected('RUN_NOT_ACTIVE');
  }

  switch (command.type) {
    case 'ADD_RESOURCE': {
      const events = addResource(state, command.resourceId, command.amount, ruleset, ports);
      return ok(state, withGoalEvaluation(state, ruleset, events, ports));
    }
    case 'USE_MANUAL_PROCESS':
      return manualProcess(state, ruleset, command, ports);
    case 'BUY_PRODUCER':
      return buyProducer(state, ruleset, command.producerId, ports);
    case 'BUY_NODE':
      return buyNode(state, ruleset, command.nodeId, ports);
    case 'RESOLVE_EVENT':
      return resolvePendingEvent(state, ruleset, command, ports);
    case 'BUY_BUILDING':
      return buyBuilding(state, ruleset, command.buildingId, ports);
    case 'TICK': {
      state.run.clock.simulationMs += command.deltaMs;
      state.run.clock.activeMs += command.deltaMs;
      const events = [createDomainEvent('tick', { deltaMs: command.deltaMs }, state, ports)];
      return ok(state, events);
    }
    default:
      return rejected('UNKNOWN_COMMAND', { type: command.type });
  }
}

function manualProcess(state, ruleset, command, ports) {
  const result = useManualProcess(state, ruleset, command.processId, ports, {
    rewardMultiplier: command.rewardMultiplier,
  });
  if (!result.ok) {
    return result;
  }
  return ok(state, withGoalEvaluation(state, ruleset, result.events, ports));
}

function buyProducer(state, ruleset, producerId, ports) {
  const indexes = createRulesetIndexes(ruleset);
  const producer = indexes.producers[producerId];
  if (!producer) {
    return rejected('UNKNOWN_PRODUCER', { producerId });
  }
  if (!producer.unlocksAtStart && !prerequisitesMet(state, producer)) {
    return rejected('PREREQUISITES_NOT_MET', { producerId });
  }

  const currentCount = state.run.producers[producerId]?.count || 0;
  const cost = selectProducerPrice(state, ruleset, producerId);
  const payment = payCost(state, cost, ruleset, ports);
  if (!payment.ok) {
    return payment;
  }

  state.run.producers[producerId] = { count: currentCount + 1 };
  const events = [
    ...payment.events,
    createDomainEvent('producer_bought', { producerId, newCount: currentCount + 1, cost }, state, ports),
  ];
  return ok(state, withGoalEvaluation(state, ruleset, events, ports));
}

function buyNode(state, ruleset, nodeId, ports, options = {}) {
  const indexes = createRulesetIndexes(ruleset);
  const node = indexes.nodes[nodeId];
  if (!node) {
    return rejected('UNKNOWN_NODE', { nodeId });
  }
  if (state.run.nodes.completed[nodeId]) {
    return rejected('NODE_ALREADY_COMPLETED', { nodeId });
  }
  if (!prerequisitesMet(state, node) || !branchAvailable(state, ruleset, node)) {
    return rejected('PREREQUISITES_NOT_MET', { nodeId });
  }
  if (!options.fromEvent && eventBlocksNode(state, ruleset, node)) {
    return rejected('BLOCKED_BY_EVENT', { nodeId, eventId: state.run.events.pendingId });
  }
  const populationCheck = assertPopulationRequirement(state, node);
  if (!populationCheck.ok) {
    return populationCheck;
  }

  const cost = selectNodeCost(state, ruleset, nodeId);
  const payment = payCost(state, cost, ruleset, ports);
  if (!payment.ok) {
    return payment;
  }

  state.run.nodes.completed[nodeId] = { completedAtMs: state.run.clock.simulationMs };
  if (node.branchGroup && !state.run.nodes.selectedBranchByGroup[node.branchGroup]) {
    state.run.nodes.selectedBranchByGroup[node.branchGroup] = nodeId;
  }
  applyEffects(state, node.effects, { sourceType: 'node', sourceId: nodeId });

  const eraEvents = applyEraTransition(state, node.transition, ruleset, ports);
  const events = [
    ...payment.events,
    createDomainEvent('node_completed', { nodeId, cost }, state, ports),
    ...eraEvents,
  ];
  if (nodeId === 'M06') {
    events.push(createDomainEvent('cell_reached', { nodeId }, state, ports));
  }
  events.push(...queueEventsForNode(state, ruleset, nodeId, ports));
  return ok(state, withGoalEvaluation(state, ruleset, events, ports));
}

function resolvePendingEvent(state, ruleset, command, ports) {
  const result = resolveEvent(state, ruleset, command.eventId, command.choiceId, ports, {
    applyPurchaseNode(nodeId) {
      return buyNode(state, ruleset, nodeId, ports, { fromEvent: true });
    },
  });
  if (!result.ok) return result;
  return ok(state, result.events);
}

function buyBuilding(state, ruleset, buildingId, ports) {
  const indexes = createRulesetIndexes(ruleset);
  const building = indexes.buildings[buildingId];
  if (!building) {
    return rejected('UNKNOWN_BUILDING', { buildingId });
  }
  if (!prerequisitesMet(state, building)) {
    return rejected('PREREQUISITES_NOT_MET', { buildingId });
  }

  const currentCount = state.run.buildings[buildingId]?.count || 0;
  if (building.maxCount != null && currentCount >= building.maxCount) {
    return rejected('MAX_COUNT_REACHED', { buildingId });
  }
  const cost = scaleCost(building.baseCost, building.growth, currentCount);
  const payment = payCost(state, cost, ruleset, ports);
  if (!payment.ok) {
    return payment;
  }

  state.run.buildings[buildingId] = { count: currentCount + 1 };
  // Each repeatable building is its own capacity/bonus instance. Reusing one
  // key here would make a second storage building overwrite the first.
  applyEffects(state, building.effects, { sourceType: 'building', sourceId: `${buildingId}:${currentCount + 1}` });
  const events = [
    ...payment.events,
    createDomainEvent('building_bought', { buildingId, newCount: currentCount + 1, cost }, state, ports),
  ];
  return ok(state, withGoalEvaluation(state, ruleset, events, ports));
}
