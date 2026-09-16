export const effectSupport = {
  unlock_auto_production: { status: 'supported' },
  resource_production_multiplier: { status: 'supported' },
  resource_capacity: { status: 'supported' },
  global_production_multiplier: { status: 'supported' },
  unlock_resource: { status: 'supported' },
  producer_cost_multiplier: { status: 'supported' },
  unlock_building: { status: 'supported' },
  manual_gain_multiplier: { status: 'supported' },
  set_flag: { status: 'supported' },
  job_output_multiplier: { status: 'supported' },
  population_capacity: { status: 'supported' },
};

export const allowedEffectTypes = Object.keys(effectSupport).filter(
  (effectType) => effectSupport[effectType].status === 'supported'
);
