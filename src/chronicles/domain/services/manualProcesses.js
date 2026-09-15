import { createRulesetIndexes } from '../../config/index.js';
import { createDomainEvent } from '../domainEvents.js';
import { calculateProductionRates } from './production.js';
import { addResource } from './resources.js';

export function selectManualProcessState(state, processId) {
  return state.run.manualProcesses[processId] || null;
}

export function manualProcessAvailable(state, process) {
  if (!process || !process.availableFromStart) {
    return false;
  }
  if (process.obsoleteAfterNodeId && state.run.nodes.completed[process.obsoleteAfterNodeId]) {
    return false;
  }
  return state.run.clock.simulationMs >= (selectManualProcessState(state, process.id)?.availableAtMs || 0);
}

export function calculateManualReward(state, ruleset, process) {
  if (process.reward?.type !== 'manual_gain') {
    return {};
  }
  const rates = calculateProductionRates(state, ruleset);
  const resourceId = process.reward.resourceId;
  const productionAmount = (rates[resourceId] || 0) * (process.reward.productionSeconds || 0);
  const multiplier = Object.values(state.run.modifiers.active).reduce((value, modifier) => {
    return modifier.type === 'manual_gain_multiplier' ? value * modifier.value : value;
  }, 1);
  return { [resourceId]: Math.max(process.reward.baseAmount || 0, productionAmount) * multiplier };
}

export function useManualProcess(state, ruleset, processId, ports = {}) {
  const process = createRulesetIndexes(ruleset).manualProcesses[processId];
  if (!process) {
    return { ok: false, reason: 'UNKNOWN_MANUAL_PROCESS', processId, events: [] };
  }
  if (!manualProcessAvailable(state, process)) {
    return { ok: false, reason: 'MANUAL_PROCESS_UNAVAILABLE', processId, events: [] };
  }

  const reward = calculateManualReward(state, ruleset, process);
  const events = [];
  for (const [resourceId, amount] of Object.entries(reward)) {
    events.push(...addResource(state, resourceId, amount, ruleset, ports));
  }
  const previous = selectManualProcessState(state, processId) || { uses: 0 };
  state.run.manualProcesses[processId] = {
    uses: previous.uses + 1,
    lastUsedAtMs: state.run.clock.simulationMs,
    availableAtMs: state.run.clock.simulationMs + process.cooldownMs,
  };
  events.push(createDomainEvent('manual_process_used', { processId, reward }, state, ports));
  return { ok: true, events, reward };
}
