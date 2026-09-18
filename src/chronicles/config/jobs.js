// Jobs are the civilization-side sources of the aggregate economy. They are
// deliberately separate from producers: every assigned person occupies one
// unit of Population and phase changes can remap that assignment safely.
// 2026-09-18 T1-pacing rebalance: Tribe-era job outputs are ×3.5 (same
// factor as config/producers.js) so Tribe lands inside T1's ~20min chapter
// budget; later-era jobs are untouched, not yet part of any timed chapter.
export const jobs = [
  { id: 'JOB_TRIBE_FORAGER', entityType: 'job', labelKey: 'job.tribe_forager', eraIds: ['EARLY_CIV', 'TRIBE'], output: { food: 2.8 }, lineage: 'food' },
  { id: 'JOB_TRIBE_GATHERER', entityType: 'job', labelKey: 'job.tribe_gatherer', eraIds: ['EARLY_CIV', 'TRIBE'], output: { materials: 1.68 }, lineage: 'materials' },
  { id: 'JOB_TRIBE_THINKER', entityType: 'job', labelKey: 'job.tribe_thinker', eraIds: ['EARLY_CIV', 'TRIBE'], output: { knowledge: 0.7 }, lineage: 'knowledge' },
  { id: 'JOB_SETTLEMENT_FARMER', entityType: 'job', labelKey: 'job.settlement_farmer', eraIds: ['SETTLEMENT_EARLY', 'SETTLEMENT'], output: { food: 0.95 }, lineage: 'food' },
  { id: 'JOB_SETTLEMENT_BUILDER', entityType: 'job', labelKey: 'job.settlement_builder', eraIds: ['SETTLEMENT_EARLY', 'SETTLEMENT'], output: { materials: 0.65 }, lineage: 'materials' },
  { id: 'JOB_SETTLEMENT_SCHOLAR', entityType: 'job', labelKey: 'job.settlement_scholar', eraIds: ['SETTLEMENT_EARLY', 'SETTLEMENT'], output: { knowledge: 0.32 }, lineage: 'knowledge' },
  { id: 'JOB_CITY_FARMER', entityType: 'job', labelKey: 'job.city_farmer', eraIds: ['CITY'], output: { food: 1.2 }, lineage: 'food' },
  { id: 'JOB_CITY_WORKER', entityType: 'job', labelKey: 'job.city_worker', eraIds: ['CITY'], output: { materials: 0.85 }, lineage: 'materials' },
  { id: 'JOB_CITY_RESEARCHER', entityType: 'job', labelKey: 'job.city_researcher', eraIds: ['CITY'], output: { knowledge: 0.52 }, lineage: 'knowledge' },
  { id: 'JOB_INDUSTRY_FARMER', entityType: 'job', labelKey: 'job.industry_farmer', eraIds: ['INDUSTRY', 'MODERN', 'PRE_ATOMIC', 'ATOMIC'], output: { food: 1.45 }, lineage: 'food' },
  { id: 'JOB_INDUSTRY_WORKER', entityType: 'job', labelKey: 'job.industry_worker', eraIds: ['INDUSTRY', 'MODERN', 'PRE_ATOMIC', 'ATOMIC'], output: { materials: 1.05 }, lineage: 'materials' },
  { id: 'JOB_INDUSTRY_SCIENTIST', entityType: 'job', labelKey: 'job.industry_scientist', eraIds: ['INDUSTRY', 'MODERN', 'PRE_ATOMIC', 'ATOMIC'], output: { knowledge: 0.72 }, lineage: 'knowledge' },
];
