// Jobs are the civilization-side sources of the aggregate economy. They are
// deliberately separate from producers: every assigned person occupies one
// unit of Population and phase changes can remap that assignment safely.
// Act 1 pacing uses the same ×3.5 time scale throughout the civilization
// economy. T1 originally applied it only through Tribe; the first full
// T1→T5 pass showed that the untouched Settlement+ rates stretched later
// chapters to 34/54/60/101 minutes instead of the 25/30/35/40-minute map.
export const jobs = [
  { id: 'JOB_TRIBE_FORAGER', entityType: 'job', labelKey: 'job.tribe_forager', eraIds: ['EARLY_CIV', 'TRIBE'], output: { food: 2.8 }, lineage: 'food' },
  { id: 'JOB_TRIBE_GATHERER', entityType: 'job', labelKey: 'job.tribe_gatherer', eraIds: ['EARLY_CIV', 'TRIBE'], output: { materials: 1.68 }, lineage: 'materials' },
  { id: 'JOB_TRIBE_THINKER', entityType: 'job', labelKey: 'job.tribe_thinker', eraIds: ['EARLY_CIV', 'TRIBE'], output: { knowledge: 0.7 }, lineage: 'knowledge' },
  { id: 'JOB_SETTLEMENT_FARMER', entityType: 'job', labelKey: 'job.settlement_farmer', eraIds: ['SETTLEMENT_EARLY', 'SETTLEMENT'], output: { food: 3.325 }, lineage: 'food' },
  { id: 'JOB_SETTLEMENT_BUILDER', entityType: 'job', labelKey: 'job.settlement_builder', eraIds: ['SETTLEMENT_EARLY', 'SETTLEMENT'], output: { materials: 2.275 }, lineage: 'materials' },
  { id: 'JOB_SETTLEMENT_SCHOLAR', entityType: 'job', labelKey: 'job.settlement_scholar', eraIds: ['SETTLEMENT_EARLY', 'SETTLEMENT'], output: { knowledge: 1.12 }, lineage: 'knowledge' },
  { id: 'JOB_CITY_FARMER', entityType: 'job', labelKey: 'job.city_farmer', eraIds: ['CITY'], output: { food: 4.2 }, lineage: 'food' },
  { id: 'JOB_CITY_WORKER', entityType: 'job', labelKey: 'job.city_worker', eraIds: ['CITY'], output: { materials: 2.975 }, lineage: 'materials' },
  { id: 'JOB_CITY_RESEARCHER', entityType: 'job', labelKey: 'job.city_researcher', eraIds: ['CITY'], output: { knowledge: 1.82 }, lineage: 'knowledge' },
  { id: 'JOB_INDUSTRY_FARMER', entityType: 'job', labelKey: 'job.industry_farmer', eraIds: ['INDUSTRY', 'MODERN', 'PRE_ATOMIC', 'ATOMIC'], output: { food: 5.075 }, lineage: 'food' },
  { id: 'JOB_INDUSTRY_WORKER', entityType: 'job', labelKey: 'job.industry_worker', eraIds: ['INDUSTRY', 'MODERN', 'PRE_ATOMIC', 'ATOMIC'], output: { materials: 3.675 }, lineage: 'materials' },
  { id: 'JOB_INDUSTRY_SCIENTIST', entityType: 'job', labelKey: 'job.industry_scientist', eraIds: ['INDUSTRY', 'MODERN', 'PRE_ATOMIC', 'ATOMIC'], output: { knowledge: 2.52 }, lineage: 'knowledge' },
];
