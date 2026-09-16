export const producers = [
  {
    id: 'PROC_PRIMORDIAL_REACTION',
    entityType: 'producer',
    labelKey: 'producer.primordial_reaction',
    unlocksAtStart: true,
    tags: ['rna', 'process'],
    baseCost: { rna: 5 },
    growth: 1.35,
    output: { rna: 0.22 },
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
    baseCost: { rna: 34 },
    growth: 1.35,
    output: { rna: 0.58 },
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
    output: { dna: 0.24 },
    milestones: [
      {
        count: 10,
        multiplier: 1.15,
        label: 'Genetic assembly chain',
        description: 'Synthesis stabilizes into a reusable genetic assembly chain.',
      },
    ],
  },
];
