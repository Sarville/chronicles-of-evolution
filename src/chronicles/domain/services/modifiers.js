export function applyEffects(state, effects = [], source = {}) {
  for (const effect of effects) {
    if (effect.deferred) {
      continue;
    }
    const sourceKey = source.sourceId || 'unknown';
    if (effect.type === 'resource_production_multiplier') {
      state.run.modifiers.active[`${sourceKey}:resource:${effect.resourceId}`] = effect;
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
    if (effect.type === 'unlock_resource') {
      if (!state.run.resources[effect.resourceId]) {
        state.run.resources[effect.resourceId] = { amount: 0 };
      }
    }
    if (effect.type === 'unlock_building') {
      state.run.flags[`run.unlock.building.${effect.buildingId}`] = true;
    }
  }
}

export function isAutoProductionUnlocked(state) {
  return Object.values(state.run.modifiers.active).some((modifier) => modifier.type === 'unlock_auto_production');
}
