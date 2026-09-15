export const buildings = [
  {
    id: 'BLD_FIELD',
    entityType: 'building',
    labelKey: 'building.field',
    requiresNodes: ['T08'],
    baseCost: { materials: 260, food: 180 },
    growth: 1.18,
    maxCount: null,
    effects: [{ type: 'job_output_multiplier', jobId: 'JOB_SETTLEMENT_FARMER', value: 1.1 }],
  },
];

