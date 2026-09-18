import { createRulesetIndexes } from '../../config/index.js';
import { addResource } from './resources.js';
import { isAutoProductionUnlocked } from './modifiers.js';
import { prerequisitesMet } from './evolution.js';
import { createDomainEvent } from '../domainEvents.js';

export function producerMilestoneMultiplier(count, milestones = []) {
  return milestones.reduce((multiplier, milestone) => {
    return count >= milestone.count ? multiplier * milestone.multiplier : multiplier;
  }, 1);
}

export function productionMultiplierForResource(state, resourceId) {
  let multiplier = 1;
  for (const modifier of Object.values(state.run.modifiers.active)) {
    if (modifier.type === 'global_production_multiplier') {
      multiplier *= modifier.value;
    }
    if (modifier.type === 'resource_production_multiplier' && modifier.resourceId === resourceId) {
      multiplier *= modifier.value;
    }
    if (modifier.type === 'recall_era_production_multiplier' && modifier.eraIds?.includes(state.run.eraId)) {
      multiplier *= modifier.value;
    }
  }
  return multiplier;
}

export function producerFlowRates(state, producer, count) {
  const milestoneMultiplier = producerMilestoneMultiplier(count, producer.milestones);
  const output = {};
  const input = {};
  for (const [resourceId, amount] of Object.entries(producer.output || {})) {
    output[resourceId] = count * amount * milestoneMultiplier * productionMultiplierForResource(state, resourceId);
  }
  for (const [resourceId, amount] of Object.entries(producer.input || {})) {
    // Source efficiency can improve output, but never creates a free input.
    input[resourceId] = count * amount;
  }
  return { input, output };
}

function activeProducerFlows(state, ruleset) {
  const autoProductionUnlocked = isAutoProductionUnlocked(state);
  const indexes = createRulesetIndexes(ruleset);
  return Object.entries(state.run.producers)
    .map(([producerId, producerState]) => ({ producer: indexes.producers[producerId], count: producerState.count || 0 }))
    .filter(({ producer, count }) => producer && count && (autoProductionUnlocked || producer.producesBeforeAutoUnlock === true))
    .map(({ producer, count }) => ({ kind: 'producer', id: producer.id, ...producerFlowRates(state, producer, count) }));
}

export function jobOutputMultiplier(state, jobId) {
  return Object.values(state.run.modifiers.active || {}).reduce((multiplier, modifier) => {
    return modifier.type === 'job_output_multiplier' && modifier.jobId === jobId
      ? multiplier * modifier.value
      : multiplier;
  }, 1);
}

function activeJobFlows(state, ruleset) {
  const indexes = createRulesetIndexes(ruleset);
  const assignments = state.run.population?.assignments || {};
  return Object.entries(assignments)
    .map(([jobId, count]) => ({ job: indexes.jobs[jobId], count }))
    .filter(({ job, count }) => job && count > 0 && prerequisitesMet(state, job))
    .map(({ job, count }) => {
      const multiplier = jobOutputMultiplier(state, job.id);
      const output = Object.fromEntries(Object.entries(job.output || {}).map(([resourceId, amount]) => [resourceId, count * amount * multiplier]));
      return { kind: 'job', id: job.id, input: {}, output };
    });
}

// T4 "Форсированное производство" perk: an era-scoped output multiplier for
// buildings specifically, since resource_production_multiplier already
// covers producers/jobs but buildings had no era-scoped hook of their own.
// Gated on the run's *current* era (like building_cost_multiplier below),
// not the building's own multi-era eraIds list, so a building spanning
// several eras can't double up two different chapters' era-tagged perks.
function buildingOutputMultiplier(state) {
  return Object.values(state.run.modifiers.active).reduce((multiplier, modifier) => {
    return modifier.type === 'building_output_multiplier' && modifier.eraId === state.run.eraId ? multiplier * modifier.value : multiplier;
  }, 1);
}

// T4 "Фоновые процессы" perk: buildings keep a minimum output floor even
// when starved of input (power) -- used only by applyProduction, which
// already computed each flow's real input-availability scale.
export function buildingOutputFloor(state) {
  return Object.values(state.run.modifiers.active).reduce((floor, modifier) => {
    return modifier.type === 'building_output_floor' && modifier.eraId === state.run.eraId ? Math.max(floor, modifier.value) : floor;
  }, 0);
}

function activeBuildingFlows(state, ruleset) {
  const indexes = createRulesetIndexes(ruleset);
  return Object.entries(state.run.buildings)
    .map(([buildingId, buildingState]) => ({ building: indexes.buildings[buildingId], count: buildingState.count || 0 }))
    .filter(({ building, count }) => building && count > 0 && prerequisitesMet(state, building))
    .map(({ building, count }) => ({
      kind: 'building',
      id: building.id,
      input: Object.fromEntries(Object.entries(building.input || {}).map(([resourceId, amount]) => [resourceId, count * amount])),
      output: Object.fromEntries(Object.entries(building.output || {}).map(([resourceId, amount]) => [resourceId, count * amount * productionMultiplierForResource(state, resourceId) * buildingOutputMultiplier(state)])),
    }));
}

function activeFlows(state, ruleset) {
  return [...activeProducerFlows(state, ruleset), ...activeJobFlows(state, ruleset), ...activeBuildingFlows(state, ruleset)];
}

export function calculateProductionRates(state, ruleset) {
  const rates = {};
  for (const flow of activeFlows(state, ruleset)) {
    for (const [resourceId, amount] of Object.entries(flow.output)) rates[resourceId] = (rates[resourceId] || 0) + amount;
    for (const [resourceId, amount] of Object.entries(flow.input)) rates[resourceId] = (rates[resourceId] || 0) - amount;
  }

  return rates;
}

export function applyProduction(state, ruleset, deltaMs, ports) {
  if (state.run.lifecycle !== 'active') {
    return { rates: {}, events: [] };
  }
  const seconds = deltaMs / 1000;
  const flows = activeFlows(state, ruleset);
  const available = Object.fromEntries(Object.entries(state.run.resources).map(([resourceId, resource]) => [resourceId, resource.amount]));
  const actualRates = {};
  const appliedFlows = flows.map((flow) => {
    let scale = 1;
    for (const [resourceId, rate] of Object.entries(flow.input)) {
      const needed = rate * seconds;
      if (needed > 0) scale = Math.min(scale, Math.max(0, (available[resourceId] || 0) / needed));
    }
    for (const [resourceId, rate] of Object.entries(flow.input)) available[resourceId] = Math.max(0, (available[resourceId] || 0) - rate * seconds * scale);
    return { ...flow, scale };
  });
  // Inputs are applied for every flow before any output: a resource that is
  // both produced and consumed within the same tick (RNA -> DNA Synthesis,
  // Biomass -> Respiration) must still land on its cap at the end of the
  // tick. Interleaving input/output per flow let a later flow's consumption
  // permanently shave off whatever an earlier flow had just topped up to
  // the cap, so the stock could never visibly reach it.
  const events = [];
  for (const flow of appliedFlows) {
    for (const [resourceId, rate] of Object.entries(flow.input)) {
      const appliedRate = rate * flow.scale;
      actualRates[resourceId] = (actualRates[resourceId] || 0) - appliedRate;
      events.push(...addResource(state, resourceId, -appliedRate * seconds, ruleset, ports));
    }
  }
  for (const flow of appliedFlows) {
    // Output-only floor: a building that can't fully pay its own input still
    // keeps a small guaranteed trickle. Input consumption above stays keyed
    // to the real (unfloored) scale, so this floor is never paid for.
    const outputScale = flow.kind === 'building' ? Math.max(flow.scale, buildingOutputFloor(state)) : flow.scale;
    for (const [resourceId, rate] of Object.entries(flow.output)) {
      const appliedRate = rate * outputScale;
      actualRates[resourceId] = (actualRates[resourceId] || 0) + appliedRate;
      events.push(...addResource(state, resourceId, appliedRate * seconds, ruleset, ports));
    }
  }
  const powerDemand = appliedFlows
    .filter((flow) => flow.kind === 'building' && flow.input.power)
    .reduce((total, flow) => total + flow.input.power * seconds, 0);
  const suppliedPower = appliedFlows
    .filter((flow) => flow.kind === 'building' && flow.input.power)
    .reduce((total, flow) => total + flow.input.power * seconds * flow.scale, 0);
  const hadPowerDeficit = state.run.economy?.deficits?.power === true;
  const hasPowerDeficit = powerDemand > suppliedPower + 0.000001;
  state.run.economy ||= { deficits: {} };
  state.run.economy.deficits ||= {};
  state.run.economy.deficits.power = hasPowerDeficit;
  if (hasPowerDeficit !== hadPowerDeficit) {
    events.push(createDomainEvent(
      hasPowerDeficit ? 'power_deficit_started' : 'power_deficit_recovered',
      { demand: powerDemand / seconds, supplied: suppliedPower / seconds },
      state,
      ports
    ));
  }
  return { rates: actualRates, events };
}
