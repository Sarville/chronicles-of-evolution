export const DEV_TUNING = Object.freeze({
  manualPrimordialPulseCooldownMs: 2000,
  manualPrimordialPulseStableRnaCooldownMs: 3500,
  manualPrimordialPulseSelfReplicationCooldownMs: 90000,
});

export const manualProcesses = [
  {
    id: 'MANUAL_PRIMORDIAL_PULSE',
    label: 'Primordial reaction',
    description: 'Onboarding process that starts the first RNA chemistry before passive replication takes over.',
    availableFromStart: true,
    cooldownMs: DEV_TUNING.manualPrimordialPulseCooldownMs,
    cooldownStages: [
      {
        afterNodeId: 'M01',
        cooldownMs: DEV_TUNING.manualPrimordialPulseStableRnaCooldownMs,
      },
      {
        afterNodeId: 'M02',
        cooldownMs: DEV_TUNING.manualPrimordialPulseSelfReplicationCooldownMs,
      },
    ],
    provisional: true,
    reward: {
      type: 'manual_gain',
      resourceId: 'rna',
      baseAmount: 1,
      productionSeconds: 2,
    },
  },
];
