export function applyEffects(state, effects = []) {
  for (const effect of effects) {
    if (effect.type === 'resource_production_multiplier') {
      state.run.modifiers[`node:${effect.resourceId}:${effect.value}`] = effect;
    }
    if (effect.type === 'global_production_multiplier') {
      state.run.modifiers[`node:global:${effect.value}`] = effect;
    }
    if (effect.type === 'unlock_resource') {
      if (!state.run.resources[effect.resourceId]) {
        state.run.resources[effect.resourceId] = { amount: 0 };
      }
    }
  }
}

