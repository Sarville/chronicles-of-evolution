import { createRulesetIndexes } from '../config/index.js';
import { selectBuildingPrice, selectNodeCost, selectProducerPrice } from './selectors.js';
import { createDomainEvent } from './domainEvents.js';
import { payCost } from './services/costs.js';
import { applyEraTransition } from './services/eras.js';
import { branchAvailable, prerequisitesMet } from './services/evolution.js';
import { eventBlocksNode, queueEventsForGoal, queueEventsForNode, resolveEvent } from './services/events.js';
import { evaluateGoals } from './services/goals.js';
import { useManualProcess } from './services/manualProcesses.js';
import { applyEffects } from './services/modifiers.js';
import { assertPopulationRequirement } from './services/population.js';
import { addResource } from './services/resources.js';
import { prepareResetTransaction, applyPreparedResetTransaction } from '../save/resetTransaction.js';
import { grantArchiveRecallPerkChoice } from './services/archiveRecall.js';

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
  if (!state.run || (state.run.lifecycle !== 'active' && command.type !== 'ARCHIVE_RESET')) {
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
    case 'ASSIGN_JOB':
      return assignJob(state, ruleset, command.jobId, command.amount, ports);
    case 'ARCHIVE_RESET':
      return archiveReset(state, ruleset, command, ports);
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

function assignJob(state, ruleset, jobId, amount, ports) {
  const job = createRulesetIndexes(ruleset).jobs[jobId];
  if (!job) return rejected('UNKNOWN_JOB', { jobId });
  if (!prerequisitesMet(state, job)) return rejected('JOB_UNAVAILABLE', { jobId, eraId: state.run.eraId });
  if (!state.run.population) return rejected('POPULATION_UNAVAILABLE');
  if (!Number.isInteger(amount) || amount < 0) return rejected('INVALID_ASSIGNMENT', { jobId, amount });
  const assignments = state.run.population.assignments || (state.run.population.assignments = {});
  const current = assignments[jobId] || 0;
  const assignedElsewhere = Object.values(assignments).reduce((sum, value) => sum + value, 0) - current;
  if (assignedElsewhere + amount > state.run.population.current + 0.000001) {
    return rejected('POPULATION_ASSIGNMENT_EXCEEDED', {
      jobId,
      available: Math.floor(state.run.population.current - assignedElsewhere),
    });
  }
  assignments[jobId] = amount;
  return ok(state, [createDomainEvent('job_assigned', { jobId, previous: current, amount }, state, ports)]);
}

// Every T1-T5 chapter ends with its own reset (Ash is only mandatory on T5);
// see docs/gdd/13_ACT_ONE_CHAPTERS.md. ENDING_ASH still stands in for the
// eventual T5/endgame ending and keeps the Archive Fragment reward it always
// had. ENDING_BLIGHT is T1's Мор collapse: per docs/gdd/10_META_PROGRESSION.md
// §1/§3, no currency exists anywhere in Act 1-2 -- its reward is an Archive
// Recall perk choice instead (§4).
const ENDING_RESET_PROFILES = {
  ENDING_ASH: {
    reward(state) {
      const nodeCount = Object.keys(state.run.nodes.completed || {}).length;
      const peakPopulation = state.run.population?.peak || 0;
      const stabilityBonus = Math.max(0, Math.min(3, Math.floor((state.run.crisis?.minStability || 0) / 30)));
      return Math.max(14, Math.min(18, 14 + Math.floor(nodeCount / 15) + (peakPopulation >= 60 ? 1 : 0) + stabilityBonus));
    },
    chronicleSummary: 'Timeline #1 завершён: Пепел сохранён в Архиве.',
  },
  ENDING_BLIGHT: {
    archiveRecallChapterKey: 'T1',
    chronicleSummary: 'Цивилизация №1 завершена: Мор сохранён в Архиве.',
  },
  ENDING_CATACLYSM: {
    archiveRecallChapterKey: 'T2',
    chronicleSummary: 'Цивилизация №2 завершена: Катаклизм сохранён в Архиве.',
  },
};

function archiveReset(state, ruleset, command, ports) {
  const endingId = state.run.ending?.id;
  const profile = ENDING_RESET_PROFILES[endingId];
  if (state.run.lifecycle !== 'ended' || !profile) {
    return rejected('ENDING_NOT_READY_FOR_ARCHIVE');
  }

  let reward;
  if (profile.archiveRecallChapterKey) {
    const grant = grantArchiveRecallPerkChoice(profile.archiveRecallChapterKey, command.perkChoiceId);
    if (!grant.ok) return rejected(grant.reason, grant.details);
    reward = { archiveRecallPerk: grant.grant };
  } else {
    reward = { archiveFragments: profile.reward(state) };
  }

  const transaction = prepareResetTransaction(state, {
    transactionId: command.transactionId,
    endingId,
    reward,
    chronicleRecord: {
      id: `${state.run.id}:ending`,
      kind: 'ending',
      endingId,
      subtype: state.run.ending.subtype,
      durationMs: state.run.clock.activeMs,
      peakPopulation: state.run.population?.peak || 0,
      minimumStability: state.run.crisis?.minStability ?? 100,
      summary: profile.chronicleSummary,
    },
  });
  const applied = applyPreparedResetTransaction(state, transaction, { ruleset, nextRunId: command.nextRunId });
  if (!applied.ok) return applied;
  Object.assign(state, applied.state);
  return ok(state, [createDomainEvent('archive_reset_completed', { transactionId: transaction.id, reward, alreadyApplied: applied.alreadyApplied }, state, ports)]);
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
  const apCost = node.adaptationPointCost || 0;
  if (apCost > (state.run.adaptation?.points || 0)) {
    return rejected('INSUFFICIENT_ADAPTATION_POINTS', { nodeId, required: apCost, available: state.run.adaptation?.points || 0 });
  }

  const cost = selectNodeCost(state, ruleset, nodeId);
  const payment = payCost(state, cost, ruleset, ports);
  if (!payment.ok) {
    return payment;
  }

  state.run.nodes.completed[nodeId] = { completedAtMs: state.run.clock.simulationMs };
  if (apCost) {
    state.run.adaptation.points -= apCost;
    state.run.adaptation.spentTotal += apCost;
    state.run.adaptation.selectedOptionalNodes.push(nodeId);
  }
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
  const cost = selectBuildingPrice(state, ruleset, buildingId);
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
