export const DEV_TUNING = Object.freeze({
  manualPrimordialPulseCooldownMs: 1000,
});

export const manualProcesses = [
  {
    id: 'MANUAL_PRIMORDIAL_PULSE',
    label: 'Primordial pulse',
    description: 'Onboarding process for the first Energy before Stable Bond unlocks auto-production.',
    availableFromStart: true,
    cooldownMs: DEV_TUNING.manualPrimordialPulseCooldownMs,
    provisional: true,
    reward: {
      type: 'manual_gain',
      resourceId: 'energy',
      baseAmount: 1,
      productionSeconds: 2,
    },
  },
];
