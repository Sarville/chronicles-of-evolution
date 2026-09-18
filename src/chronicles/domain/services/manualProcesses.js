import { createRulesetIndexes } from '../../config/index.js';
import { createDomainEvent } from '../domainEvents.js';
import { canAfford, payCost } from './costs.js';
import { calculateProductionRates } from './production.js';
import { addResource } from './resources.js';

export function selectManualProcessState(state, processId) {
  return state.run.manualProcesses[processId] || null;
}

export function manualProcessAvailable(state, process) {
  if (!process) {
    return false;
  }
  if (!process.availableFromStart) {
    if (!process.availableAfterNodeId || !state.run.nodes.completed[process.availableAfterNodeId]) {
      return false;
    }
  }
  for (const nodeId of process.requiresNodes || []) {
    if (!state.run.nodes.completed[nodeId]) {
      return false;
    }
  }
  if (process.obsoleteAfterNodeId && state.run.nodes.completed[process.obsoleteAfterNodeId]) {
    return false;
  }
  return state.run.clock.simulationMs >= (selectManualProcessState(state, process.id)?.availableAtMs || 0);
}

function manualCooldownMultiplier(state) {
  return Object.values(state.run.modifiers.active).reduce((value, modifier) => {
    return modifier.type === 'manual_cooldown_multiplier' ? value * modifier.value : value;
  }, 1);
}

export function manualProcessCooldownMs(state, process) {
  const stage = (process.cooldownStages || [])
    .filter((candidate) => candidate.afterNodeId && state.run.nodes.completed[candidate.afterNodeId])
    .at(-1);
  const baseMs = stage
    ? stage.cooldownMs
    : process.cooldownAfterNodeId && state.run.nodes.completed[process.cooldownAfterNodeId]
      ? process.cooldownAfterMs ?? process.cooldownMs
      : process.cooldownMs;
  return baseMs * manualCooldownMultiplier(state);
}

export function manualProcessInputCost(process) {
  return process?.reward?.inputCost || process?.inputCost || {};
}

export function calculateManualReward(state, ruleset, process, options = {}) {
  if (!process?.reward || !['manual_gain', 'convert_resource'].includes(process.reward.type)) {
    return {};
  }
  const rates = calculateProductionRates(state, ruleset);
  const resourceId = process.reward.resourceId;
  const productionAmount = (rates[resourceId] || 0) * (process.reward.productionSeconds || 0);
  const manualGainMultiplier =
    process.usesManualGainModifiers === false
      ? 1
      : Object.values(state.run.modifiers.active).reduce((value, modifier) => {
          return modifier.type === 'manual_gain_multiplier' ? value * modifier.value : value;
        }, 1);
  const rewardMultiplier = (process.reward.rewardMultiplier ?? process.rewardMultiplier ?? 1) * (options.rewardMultiplier ?? 1);
  const multiplier = manualGainMultiplier * rewardMultiplier;
  return { [resourceId]: Math.max(process.reward.baseAmount || 0, productionAmount) * multiplier };
}

export function useManualProcess(state, ruleset, processId, ports = {}, options = {}) {
  const process = createRulesetIndexes(ruleset).manualProcesses[processId];
  if (!process) {
    return { ok: false, reason: 'UNKNOWN_MANUAL_PROCESS', processId, events: [] };
  }
  if (!manualProcessAvailable(state, process)) {
    return { ok: false, reason: 'MANUAL_PROCESS_UNAVAILABLE', processId, events: [] };
  }
  const inputCost = manualProcessInputCost(process);
  const affordability = canAfford(state, inputCost);
  if (!affordability.ok) {
    return {
      ok: false,
      reason: 'INSUFFICIENT_RESOURCES',
      details: affordability,
      processId,
      events: [],
    };
  }

  const reward = calculateManualReward(state, ruleset, process, options);
  const payment = payCost(state, inputCost, ruleset, ports);
  const events = [...payment.events];
  for (const [resourceId, amount] of Object.entries(reward)) {
    events.push(...addResource(state, resourceId, amount, ruleset, ports));
  }
  const previous = selectManualProcessState(state, processId) || { uses: 0 };
  state.run.manualProcesses[processId] = {
    uses: previous.uses + 1,
    lastUsedAtMs: state.run.clock.simulationMs,
    availableAtMs: state.run.clock.simulationMs + manualProcessCooldownMs(state, process),
  };
  events.push(createDomainEvent('manual_process_used', { processId, inputCost, reward }, state, ports));
  return { ok: true, events, inputCost, reward };
}
