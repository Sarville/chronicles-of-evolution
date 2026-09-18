// 2026-09-18 T1-pacing rebalance: every output/input rate below is the prior
// value ×3.5, so the whole M01-T05 economy compresses onto a ~20min T1
// chapter budget instead of the old ~180min single-run framing, while
// keeping every previously-tuned relative proportion between phases intact
// (costs, growth curves and milestone thresholds are untouched). See
// docs/TODO.md "T1 pacing retune" and PROJECT_STATE.yaml
// balance.t1_pacing_rebalance for the measured result.
export const producers = [
  {
    id: 'PROC_PRIMORDIAL_REACTION',
    entityType: 'producer',
    labelKey: 'producer.primordial_reaction',
    unlocksAtStart: true,
    tags: ['rna', 'process'],
    source: 'primordial_chemistry',
    baseCost: { rna: 5 },
    growth: 1.35,
    output: { rna: 0.77 },
    producesBeforeAutoUnlock: true,
    milestones: [
      {
        count: 10,
        multiplier: 1.15,
        label: 'Reaction network',
        description: 'Isolated reactions link into a cooperative RNA reaction network.',
      },
    ],
  },
  {
    id: 'PROC_RNA_REPLICATION',
    entityType: 'producer',
    labelKey: 'producer.rna_replication',
    requiresNodes: ['M02'],
    tags: ['rna', 'process', 'replication'],
    source: 'replication_template',
    baseCost: { rna: 34 },
    growth: 1.35,
    // Raised from the earlier standalone-economy value so the original
    // RNA→DNA conversion remains fast enough for the first Timeline.
    output: { rna: 2.87 },
    milestones: [
      {
        count: 10,
        multiplier: 1.15,
        label: 'Shared template pool',
        description: 'Copies reinforce the replication loop as a shared template pool.',
      },
    ],
  },
  {
    id: 'PROC_DNA_SYNTHESIS',
    entityType: 'producer',
    labelKey: 'producer.dna_synthesis',
    requiresNodes: ['M03'],
    tags: ['dna', 'process'],
    baseCost: { rna: 78 },
    growth: 1.35,
    // Legacy evolution consumes two RNA for every DNA formed. The output is
    // intentionally faster than the legacy tick loop, but keeps its ratio.
    input: { rna: 1.82 },
    output: { dna: 0.91 },
    milestones: [
      {
        count: 10,
        multiplier: 1.15,
        label: 'Genetic assembly chain',
        description: 'Synthesis stabilizes into a reusable genetic assembly chain.',
      },
    ],
  },
  {
    id: 'PROC_BIOMASS_UPTAKE',
    entityType: 'producer',
    labelKey: 'producer.biomass_uptake',
    requiresNodes: ['M06'],
    tags: ['biomass', 'process'],
    source: 'environmental_uptake',
    // Cell-only resources are a T1 bridge (they do not exist in the legacy
    // molecular loop), so their ramp is deliberately faster after M06.
    baseCost: { dna: 55 },
    growth: 1.35,
    output: { biomass: 1.47 },
    milestones: [
      {
        count: 8,
        multiplier: 1.15,
        label: 'Membrane transport network',
        description: 'Uptake sites link into a coordinated membrane transport network.',
      },
    ],
  },
  {
    id: 'PROC_RESPIRATION',
    entityType: 'producer',
    labelKey: 'producer.respiration',
    requiresNodes: ['C01'],
    tags: ['atp', 'process'],
    baseCost: { biomass: 25 },
    growth: 1.35,
    // Metabolic capacity is a conversion, not a second free income stream.
    input: { biomass: 1.05 },
    output: { atp: 1.225 },
    milestones: [
      {
        count: 8,
        multiplier: 1.15,
        label: 'Shared electron transport chain',
        description: 'Respiration pathways consolidate into a shared, more efficient transport chain.',
      },
    ],
  },
];
