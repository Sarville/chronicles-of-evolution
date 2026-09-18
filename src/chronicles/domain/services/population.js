import { createDomainEvent } from '../domainEvents.js';
import { addResource } from './resources.js';

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
