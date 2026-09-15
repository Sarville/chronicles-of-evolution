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

