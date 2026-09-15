import { createRulesetIndexes } from '../../config/index.js';
import { createDomainEvent } from '../domainEvents.js';
import { addResource } from './resources.js';

const TERMINAL_STATUSES = new Set(['archived', 'skipped_by_archive', 'failed_soft']);

export function getGoalState(state, goalId) {
  return state.run.goals.states[goalId] || { status: 'hidden' };
}

export function conditionMet(state, condition) {
  switch (condition.type) {
    case 'resource_amount':
      return (state.run.resources[condition.resourceId]?.amount || 0) >= condition.amount;
    case 'producer_count':
      return (state.run.producers[condition.producerId]?.count || 0) >= condition.count;
    case 'node_completed':
      return Boolean(state.run.nodes.completed[condition.nodeId]);
    case 'manual_process_completed':
      return (state.run.manualProcesses[condition.processId]?.uses || 0) >= (condition.count || 1);
    case 'era_reached':
      return state.run.eraId === condition.eraId;
    case 'flag_set':
      return state.run.flags[condition.flag] === condition.value;
    default:
      return false;
  }
}

export function goalPrerequisitesMet(state, goal) {
  return (goal.prerequisites || []).every((condition) => conditionMet(state, condition));
}

export function goalConditionsMet(state, goal) {
  return (goal.conditions || []).every((condition) => conditionMet(state, condition));
}

function writeGoalState(state, goal, status, fields = {}) {
  const current = getGoalState(state, goal.id);
  state.run.goals.states[goal.id] = { ...current, status, ...fields };
  return state.run.goals.states[goal.id];
}

function activateGoal(state, goal, ports) {
  const current = getGoalState(state, goal.id);
  writeGoalState(state, goal, 'active', {
    revealedAtMs: current.revealedAtMs ?? state.run.clock.simulationMs,
    startedAtMs: current.startedAtMs ?? state.run.clock.simulationMs,
    lastProgressAtMs: current.lastProgressAtMs ?? state.run.clock.simulationMs,
  });
  if (goal.optional || goal.slot === 'side') {
    if (!state.run.goals.side.activeIds.includes(goal.id)) {
      state.run.goals.side.activeIds.push(goal.id);
    }
  } else {
    state.run.goals.currentId = goal.id;
    state.run.goals.chapter.activeId = goal.id;
  }
  return current.status === 'active'
    ? []
    : [createDomainEvent('goal_started', { goalId: goal.id, slot: goal.slot || 'chapter' }, state, ports)];
}

function applyGoalRewards(state, ruleset, goal, ports) {
  const goalState = getGoalState(state, goal.id);
  if (goalState.rewardAppliedAtMs != null) {
    return [];
  }

  const events = [];
  for (const reward of goal.rewards || []) {
    if (reward.type === 'grant_resource') {
      events.push(...addResource(state, reward.resourceId, reward.amount, ruleset, ports));
    }
    if (reward.type === 'reveal_entity') {
      if (!state.run.discovery) {
        state.run.discovery = { seenEntities: [], corruptedSeen: [] };
      }
      if (!state.run.discovery.seenEntities.includes(reward.entityId)) {
        state.run.discovery.seenEntities.push(reward.entityId);
      }
      events.push(createDomainEvent('entity_revealed', reward, state, ports));
    }
    if (reward.type === 'set_flag') {
      state.run.flags[reward.flag] = reward.value;
      events.push(createDomainEvent('flag_set', { flag: reward.flag, value: reward.value, sourceGoalId: goal.id }, state, ports));
    }
  }

  writeGoalState(state, goal, 'archived', {
    rewardAppliedAtMs: state.run.clock.simulationMs,
    archivedAtMs: state.run.clock.simulationMs,
  });
  if (goal.optional || goal.slot === 'side') {
    state.run.goals.side.activeIds = state.run.goals.side.activeIds.filter((goalId) => goalId !== goal.id);
  }
  return events;
}

function completeGoal(state, ruleset, goal, ports) {
  const current = getGoalState(state, goal.id);
  if (current.completedAtMs != null) {
    return [];
  }
  writeGoalState(state, goal, 'completed', { completedAtMs: state.run.clock.simulationMs });
  writeGoalState(state, goal, 'reward_pending');
  return [
    createDomainEvent('goal_completed', { goalId: goal.id, nodeId: goal.nodeId || null }, state, ports),
    ...applyGoalRewards(state, ruleset, goal, ports),
  ];
}

function maybeShowHint(state, goal, ports) {
  const goalState = getGoalState(state, goal.id);
  if (goalState.status !== 'active' || !goal.hintTimeoutMs || goalState.hintShownAtMs != null) {
    return [];
  }
  if (state.run.clock.simulationMs - goalState.startedAtMs < goal.hintTimeoutMs) {
    return [];
  }
  writeGoalState(state, goal, 'stalled', { hintShownAtMs: state.run.clock.simulationMs });
  return [createDomainEvent('goal_hint_shown', { goalId: goal.id, hint: goal.hint || null }, state, ports)];
}

function canActivateMainGoal(state, goal) {
  if (goal.optional || goal.slot === 'side') {
    return false;
  }
  if (!state.run.goals.currentId || state.run.goals.currentId === goal.id) {
    return true;
  }
  return TERMINAL_STATUSES.has(getGoalState(state, state.run.goals.currentId).status);
}

export function evaluateGoals(state, ruleset, ports = {}) {
  const events = [];
  const indexes = createRulesetIndexes(ruleset);

  for (const goal of ruleset.goals || []) {
    const goalState = getGoalState(state, goal.id);
    if (!TERMINAL_STATUSES.has(goalState.status) && goalPrerequisitesMet(state, goal) && goalState.status === 'hidden') {
      writeGoalState(state, goal, 'revealed', { revealedAtMs: state.run.clock.simulationMs });
    }
  }

  for (const goal of ruleset.goals || []) {
    const goalState = getGoalState(state, goal.id);
    if (TERMINAL_STATUSES.has(goalState.status)) {
      continue;
    }
    const canActivate =
      goalPrerequisitesMet(state, goal) && (goal.optional || goal.slot === 'side' || canActivateMainGoal(state, goal));
    if (canActivate && ['hidden', 'revealed', 'stalled'].includes(goalState.status)) {
      events.push(...activateGoal(state, goal, ports));
    }
  }

  for (const goal of ruleset.goals || []) {
    const goalState = getGoalState(state, goal.id);
    if (TERMINAL_STATUSES.has(goalState.status)) {
      continue;
    }
    if (goalConditionsMet(state, goal)) {
      events.push(...completeGoal(state, ruleset, goal, ports));
    } else {
      events.push(...maybeShowHint(state, goal, ports));
    }
  }

  const currentGoal = indexes.goals[state.run.goals.currentId];
  const nextGoal = indexes.goals[currentGoal?.sequence?.nextGoalId];
  if (nextGoal && TERMINAL_STATUSES.has(getGoalState(state, currentGoal.id).status) && goalPrerequisitesMet(state, nextGoal)) {
    events.push(...activateGoal(state, nextGoal, ports));
  }

  return events;
}
