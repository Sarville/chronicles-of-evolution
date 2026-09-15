import { createDomainEvent } from '../domainEvents.js';

export function queueEventsForGoal(state, ruleset, goalId, ports) {
  const events = [];
  for (const eventConfig of ruleset.events) {
    if (eventConfig.trigger?.type !== 'goal_completed' || eventConfig.trigger.goalId !== goalId) {
      continue;
    }
    if (state.run.events.states[eventConfig.id]?.status) {
      continue;
    }
    state.run.events.states[eventConfig.id] = { status: 'queued', queuedAtMs: state.run.clock.simulationMs };
    state.run.events.queue.push(eventConfig.id);
    events.push(createDomainEvent('event_queued', { eventId: eventConfig.id }, state, ports));
  }
  return events;
}
