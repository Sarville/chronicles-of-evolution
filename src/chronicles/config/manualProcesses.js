export const DEV_TUNING = Object.freeze({
  manualPrimordialPulseCooldownMs: 2000,
  manualPrimordialPulseStableRnaCooldownMs: 3500,
  manualPrimordialPulseSelfReplicationCooldownMs: 90000,
  manualDnaSynthesisCooldownMs: 45000,
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
      productionSeconds: 1.5,
      rewardMultiplier: 1,
    },
    usesManualGainModifiers: true,
  },
  {
    id: 'MANUAL_DNA_SYNTHESIS',
    label: 'Manual DNA Synthesis',
    description: 'Convert spare RNA into short DNA strands after synthesis chemistry is understood.',
    availableAfterNodeId: 'M03',
    cooldownMs: DEV_TUNING.manualDnaSynthesisCooldownMs,
    provisional: true,
    reward: {
      type: 'convert_resource',
      inputCost: { rna: 18 },
      resourceId: 'dna',
      baseAmount: 3,
      productionSeconds: 0,
      rewardMultiplier: 1,
    },
    usesManualGainModifiers: false,
  },
];
