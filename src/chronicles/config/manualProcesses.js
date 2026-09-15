export const DEV_TUNING = Object.freeze({
  manualPrimordialPulseCooldownMs: 2000,
  manualPrimordialPulseStableBondCooldownMs: 3500,
  manualPrimordialPulseSelfReplicationCooldownMs: 90000,
});

export const manualProcesses = [
  {
    id: 'MANUAL_PRIMORDIAL_PULSE',
    label: 'Primordial pulse',
    description: 'Onboarding process for the first Energy before Stable Bond unlocks auto-production.',
    availableFromStart: true,
    cooldownMs: DEV_TUNING.manualPrimordialPulseCooldownMs,
    cooldownStages: [
      {
        afterNodeId: 'M01',
        cooldownMs: DEV_TUNING.manualPrimordialPulseStableBondCooldownMs,
      },
      {
        afterNodeId: 'M02',
        cooldownMs: DEV_TUNING.manualPrimordialPulseSelfReplicationCooldownMs,
      },
    ],
    provisional: true,
    reward: {
      type: 'manual_gain',
      resourceId: 'energy',
      baseAmount: 1,
      productionSeconds: 2,
    },
  },
];
