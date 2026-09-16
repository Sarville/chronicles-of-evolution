export const resources = [
  {
    id: 'rna',
    labelKey: 'resource.rna',
    initialAmount: 0,
    // The original molecular loop starts with a small RNA pool; discoveries
    // and membrane storage expand it before the larger DNA-era purchases.
    baseCap: 100,
    visibleFromEra: 'MOLECULAR',
  },
  {
    id: 'dna',
    labelKey: 'resource.dna',
    initialAmount: 0,
    baseCap: 100,
    visibleFromEra: 'DNA_SYNTHESIS',
  },
  {
    id: 'biomass',
    labelKey: 'resource.biomass',
    initialAmount: 0,
    baseCap: 80,
    visibleFromEra: 'CELLULAR',
  },
  {
    // ATP is the cell-phase metabolic currency. It deliberately does not
    // reuse the original game's later psychic Energy resource.
    id: 'atp',
    labelKey: 'resource.atp',
    initialAmount: 0,
    baseCap: 40,
    visibleFromEra: 'CELLULAR',
  },
  {
    id: 'food',
    labelKey: 'resource.food',
    initialAmount: 0,
    baseCap: 300,
    visibleFromEra: 'EARLY_CIV',
  },
  {
    id: 'materials',
    labelKey: 'resource.materials',
    initialAmount: 0,
    baseCap: 150,
    visibleFromEra: 'EARLY_CIV',
  },
  {
    id: 'knowledge',
    labelKey: 'resource.knowledge',
    initialAmount: 0,
    baseCap: 100,
    visibleFromEra: 'EARLY_CIV',
  },
  {
    id: 'power',
    labelKey: 'resource.power',
    initialAmount: 0,
    baseCap: 100,
    visibleFromEra: 'INDUSTRY',
  },
];
