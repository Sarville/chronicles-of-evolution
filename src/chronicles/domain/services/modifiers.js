export function applyEffects(state, effects = [], source = {}) {
  for (const effect of effects) {
    if (effect.deferred) {
      continue;
    }
    const sourceKey = source.sourceId || 'unknown';
    if (effect.type === 'resource_production_multiplier') {
      state.run.modifiers.active[`${sourceKey}:resource:${effect.resourceId}`] = effect;
    }
    if (effect.type === 'resource_capacity') {
      state.run.modifiers.active[`${sourceKey}:capacity:${effect.resourceId}`] = effect;
    }
    if (effect.type === 'global_production_multiplier') {
      state.run.modifiers.active[`${sourceKey}:global`] = effect;
    }
    if (effect.type === 'producer_cost_multiplier') {
      state.run.modifiers.active[`${sourceKey}:producer_cost:${effect.producerTag}`] = effect;
    }
    if (effect.type === 'unlock_auto_production') {
      state.run.modifiers.active[`${sourceKey}:auto_production`] = effect;
    }
    if (effect.type === 'manual_gain_multiplier') {
      state.run.modifiers.active[`${sourceKey}:manual_gain`] = effect;
    }
    if (effect.type === 'job_output_multiplier') {
      state.run.modifiers.active[`${sourceKey}:job:${effect.jobId}`] = effect;
    }
    if (effect.type === 'population_capacity') {
      state.run.modifiers.active[`${sourceKey}:population_capacity`] = effect;
    }
    if (effect.type === 'manual_cooldown_multiplier') {
      state.run.modifiers.active[`${sourceKey}:manual_cooldown`] = effect;
    }
    if (effect.type === 'node_cost_multiplier') {
      state.run.modifiers.active[`${sourceKey}:node_cost:${effect.nodeId}`] = effect;
    }
    if (effect.type === 'resource_capacity_per_population') {
      state.run.modifiers.active[`${sourceKey}:capacity_per_population:${effect.resourceId}`] = effect;
    }
    if (effect.type === 'resource_capacity_multiplier') {
      state.run.modifiers.active[`${sourceKey}:capacity_multiplier:${effect.resourceId}`] = effect;
    }
    if (effect.type === 'building_cost_multiplier') {
      state.run.modifiers.active[`${sourceKey}:building_cost:${effect.eraId}`] = effect;
    }
    if (effect.type === 'unlock_auto_workforce') {
      state.run.modifiers.active[`${sourceKey}:auto_workforce`] = effect;
    }
    if (effect.type === 'chapter_timer_duration_multiplier') {
      state.run.modifiers.active[`${sourceKey}:chapter_timer_duration:${effect.timerId}`] = effect;
    }
    if (effect.type === 'building_output_floor') {
      state.run.modifiers.active[`${sourceKey}:building_output_floor:${effect.eraId}`] = effect;
    }
    if (effect.type === 'building_output_multiplier') {
      state.run.modifiers.active[`${sourceKey}:building_output_multiplier:${effect.eraId}`] = effect;
    }
    if (effect.type === 'grant_cognition') {
      state.run.cognition ||= { eventBonus: 0 };
      state.run.cognition.eventBonus = Math.max(0, (state.run.cognition.eventBonus || 0) + effect.amount);
    }
    if (effect.type === 'unlock_resource') {
      if (!state.run.resources[effect.resourceId]) {
        state.run.resources[effect.resourceId] = { amount: 0 };
      }
    }
    if (effect.type === 'unlock_building') {
      state.run.flags[`run.unlock.building.${effect.buildingId}`] = true;
    }
    if (effect.type === 'set_flag') {
      state.run.flags[effect.flag] = effect.value;
    }
  }
}

export function isAutoProductionUnlocked(state) {
  return Object.values(state.run.modifiers.active).some((modifier) => modifier.type === 'unlock_auto_production');
}
