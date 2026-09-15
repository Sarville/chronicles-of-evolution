import { createDomainEvent } from '../domainEvents.js';

export function completeGoalForNode(state, ruleset, nodeId, ports) {
  const goal = ruleset.goals.find((candidate) => candidate.nodeId === nodeId);
  if (!goal || state.run.goals.states[goal.id]?.status === 'completed') {
    return [];
  }
  state.run.goals.states[goal.id] = {
    status: 'completed',
    completedAtMs: state.run.clock.simulationMs,
  };
  state.run.goals.currentId = goal.id;
  return [createDomainEvent('goal_completed', { goalId: goal.id, nodeId }, state, ports)];
}
