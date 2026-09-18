import { createDomainEvent } from '../domainEvents.js';
import { addResource, calculateCap } from './resources.js';
import { prerequisitesMet } from './evolution.js';

const FOOD_PER_PERSON_PER_SECOND = 0.12;
// 2026-09-18 T1-pacing rebalance: ×3.5, same factor as config/producers.js
// and config/jobs.js's Tribe-era outputs, so growth to Population 8 (T05's
// gate) compresses along with the rest of T1's economy.
const GROWTH_PER_SECOND = 0.07;

export function calculatePopulationCap(state) {
  const baseCap = state.run.population?.baseCap || 0;
  const expansion = Object.values(state.run.modifiers.active || {}).reduce((total, modifier) => {
    return modifier.type === 'population_capacity' ? total + modifier.value : total;
  }, 0);
  return baseCap + expansion;
}

export function initializePopulation(state, era) {
  const start = era?.civilizationStart;
  if (!start || state.run.population) return;
  state.run.population = {
    current: start.population,
    peak: start.population,
    baseCap: start.populationCap,
    assignments: {},
    foodStatus: 'healthy',
  };
}

// Food is the only civilization resource with a population maintenance loop.
// A shortage pauses growth; it never deletes Population or ends a T1 run.
export function applyPopulationFoodLoop(state, ruleset, deltaMs, ports) {
  const population = state.run.population;
  if (!population) return { events: [], consumed: 0, grew: 0 };

  const seconds = deltaMs / 1000;
  const required = population.current * FOOD_PER_PERSON_PER_SECOND * seconds;
  const available = state.run.resources.food?.amount || 0;
  const consumed = Math.min(required, available);
  const events = addResource(state, 'food', -consumed, ruleset, ports);
  const deficit = required > consumed + 0.000001;
  const previousStatus = population.foodStatus || 'healthy';
  population.foodStatus = deficit ? 'deficit' : 'healthy';

  if (previousStatus !== population.foodStatus) {
    events.push(createDomainEvent(
      deficit ? 'food_deficit_started' : 'food_deficit_recovered',
      { required, consumed, population: population.current },
      state,
      ports
    ));
  }

  let grew = 0;
  const cap = calculatePopulationCap(state);
  // A fully paid meal is not itself a surplus. Growth requires food left in
  // storage after maintenance, matching the original fed-and-stocked rule.
  if (!deficit && (state.run.resources.food?.amount || 0) > 0 && population.current < cap) {
    grew = Math.min(cap - population.current, GROWTH_PER_SECOND * seconds);
    population.current += grew;
    population.peak = Math.max(population.peak, population.current);
    events.push(createDomainEvent('population_grew', { amount: grew, current: population.current, cap }, state, ports));
  }
  return { events, consumed, grew };
}

export function isAutoWorkforceUnlocked(state) {
  return Object.values(state.run.modifiers.active || {}).some((modifier) => modifier.type === 'unlock_auto_workforce');
}

// T3 "Самоорганизация" perk (docs/gdd/10_META_PROGRESSION.md sec.4.2): idle
// population auto-fills the current era's jobs, and a job whose output
// resource is already at cap auto-reassigns its workers elsewhere, instead
// of producing into a wall. Runs every tick, only once the perk is
// unlocked -- outside that, assignment stays fully manual (ASSIGN_JOB).
// ponytail: the cap check runs after this tick's population upkeep already
// consumed some of it, so a food job practically never reads as "at cap"
// even when production is capped -- upkeep is continuously draining it, so
// that worker isn't actually wasted the way a capped materials/knowledge
// worker is. Not fixed: it's the correct outcome for food specifically.
export function applyAutoWorkforce(state, ruleset, ports) {
  if (!isAutoWorkforceUnlocked(state) || !state.run.population) return [];
  const jobs = ruleset.jobs.filter((job) => prerequisitesMet(state, job));
  if (!jobs.length) return [];
  const assignments = (state.run.population.assignments ||= {});
  const events = [];
  const leastAssigned = (excludeJobId) =>
    [...jobs].filter((job) => job.id !== excludeJobId).sort((a, b) => (assignments[a.id] || 0) - (assignments[b.id] || 0))[0];

  for (const job of jobs) {
    const assigned = assignments[job.id] || 0;
    const resourceId = Object.keys(job.output || {})[0];
    if (assigned <= 0 || !resourceId) continue;
    const cap = calculateCap(state, resourceId, ruleset);
    const amount = state.run.resources[resourceId]?.amount || 0;
    if (!Number.isFinite(cap) || amount < cap - 0.001) continue;
    const target = leastAssigned(job.id);
    if (!target) continue;
    assignments[target.id] = (assignments[target.id] || 0) + assigned;
    assignments[job.id] = 0;
    events.push(createDomainEvent('workforce_reassigned', { fromJobId: job.id, toJobId: target.id, amount: assigned, reason: 'capacity_full' }, state, ports));
  }

  const assignedTotal = Object.values(assignments).reduce((sum, value) => sum + value, 0);
  const idle = Math.floor((state.run.population.current || 0) - assignedTotal);
  for (let remaining = idle; remaining > 0; remaining -= 1) {
    const target = leastAssigned(null);
    if (!target) break;
    assignments[target.id] = (assignments[target.id] || 0) + 1;
  }
  if (idle > 0) {
    events.push(createDomainEvent('workforce_auto_assigned', { amount: idle }, state, ports));
  }
  return events;
}

export function assertPopulationRequirement(state, entity) {
  if (!entity.populationMin) {
    return { ok: true };
  }
  const current = state.run.population?.current || 0;
  if (current < entity.populationMin) {
    return {
      ok: false,
      reason: 'POPULATION_REQUIREMENT_NOT_MET',
      details: { required: entity.populationMin, current },
    };
  }
  return { ok: true };
}
