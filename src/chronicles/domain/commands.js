import { createRulesetIndexes } from '../config/index.js';
import { createDomainEvent } from './domainEvents.js';
import { payCost, scaleCost } from './services/costs.js';
import { applyEraTransition } from './services/eras.js';
import { branchAvailable, prerequisitesMet } from './services/evolution.js';
import { queueEventsForGoal } from './services/events.js';
import { completeGoalForNode } from './services/goals.js';
import { applyEffects } from './services/modifiers.js';
import { assertPopulationRequirement } from './services/population.js';
import { addResource } from './services/resources.js';

function ok(state, events) {
  state.session.dirty = true;
  state.session.lastEvents = events;
  return { ok: true, events };
}

function rejected(reason, details = {}) {
  return { ok: false, reason, details, events: [] };
}

export function dispatchCommand(state, ruleset, command, ports = {}) {
  if (state.run.lifecycle !== 'active' && command.type !== 'TICK') {
    return rejected('RUN_NOT_ACTIVE');
  }

  switch (command.type) {
    case 'ADD_RESOURCE': {
      const events = addResource(state, command.resourceId, command.amount, ruleset, ports);
      return ok(state, events);
    }
    case 'BUY_PRODUCER':
      return buyProducer(state, ruleset, command.producerId, ports);
    case 'BUY_NODE':
      return buyNode(state, ruleset, command.nodeId, ports);
    case 'BUY_BUILDING':
      return buyBuilding(state, ruleset, command.buildingId, ports);
    case 'TICK': {
      state.run.clock.simulationMs += command.deltaMs;
      state.run.clock.activeMs += command.deltaMs;
      return ok(state, [createDomainEvent('tick', { deltaMs: command.deltaMs }, state, ports)]);
    }
    default:
      return rejected('UNKNOWN_COMMAND', { type: command.type });
  }
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
  const cost = scaleCost(producer.baseCost, producer.growth, currentCount);
  const payment = payCost(state, cost, ruleset, ports);
  if (!payment.ok) {
    return payment;
  }

  state.run.producers[producerId] = { count: currentCount + 1 };
  return ok(state, [
    ...payment.events,
    createDomainEvent('producer_bought', { producerId, newCount: currentCount + 1, cost }, state, ports),
  ]);
}

function buyNode(state, ruleset, nodeId, ports) {
  const indexes = createRulesetIndexes(ruleset);
  const node = indexes.nodes[nodeId];
  if (!node) {
    return rejected('UNKNOWN_NODE', { nodeId });
  }
  if (state.run.nodes.completed[nodeId]) {
    return rejected('NODE_ALREADY_COMPLETED', { nodeId });
  }
  if (!prerequisitesMet(state, node) || !branchAvailable(state, node)) {
    return rejected('PREREQUISITES_NOT_MET', { nodeId });
  }
  const populationCheck = assertPopulationRequirement(state, node);
  if (!populationCheck.ok) {
    return populationCheck;
  }

  const payment = payCost(state, node.cost, ruleset, ports);
  if (!payment.ok) {
    return payment;
  }

  state.run.nodes.completed[nodeId] = { completedAtMs: state.run.clock.simulationMs };
  if (node.branchGroup) {
    state.run.nodes.selectedBranchByGroup[node.branchGroup] = nodeId;
  }
  applyEffects(state, node.effects);

  const goalEvents = completeGoalForNode(state, ruleset, nodeId, ports);
  const queuedEvents = goalEvents.flatMap((event) => {
    if (event.type === 'goal_completed') {
      return queueEventsForGoal(state, ruleset, event.payload.goalId, ports);
    }
    return [];
  });
  const eraEvents = applyEraTransition(state, node.transition, ruleset, ports);
  return ok(state, [
    ...payment.events,
    createDomainEvent('node_completed', { nodeId }, state, ports),
    ...goalEvents,
    ...queuedEvents,
    ...eraEvents,
  ]);
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
  return ok(state, [
    ...payment.events,
    createDomainEvent('building_bought', { buildingId, newCount: currentCount + 1, cost }, state, ports),
  ]);
}

