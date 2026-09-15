import { createDomainEvent } from '../domainEvents.js';

export function completeGoalForNode(state, ruleset, nodeId, ports) {
  const goal = ruleset.goals.find((candidate) => candidate.nodeId === nodeId);
  if (!goal || state.run.goals[goal.id]?.state === 'completed') {
    return [];
  }
  state.run.goals[goal.id] = {
    state: 'completed',
    completedAtMs: state.run.clock.simulationMs,
  };
  return [createDomainEvent('goal_completed', { goalId: goal.id, nodeId }, state, ports)];
}

