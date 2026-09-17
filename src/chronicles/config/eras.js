export const eras = [
  { id: 'MOLECULAR', chapterId: 'CH01', activeResources: ['rna', 'dna'] },
  { id: 'CELLULAR', chapterId: 'CH02', activeResources: ['rna', 'dna', 'biomass', 'atp'] },
  { id: 'MULTICELLULAR', chapterId: 'CH03', activeResources: ['rna', 'dna', 'biomass', 'atp'] },
  {
    id: 'EARLY_CIV',
    chapterId: 'CH04',
    activeResources: ['food', 'materials', 'knowledge'],
    civilizationStart: { population: 5, populationCap: 8, resources: { food: 120, materials: 45, knowledge: 12 } },
  },
  { id: 'TRIBE', chapterId: 'CH04', activeResources: ['food', 'materials', 'knowledge'] },
  { id: 'SETTLEMENT_EARLY', chapterId: 'CH05', activeResources: ['food', 'materials', 'knowledge'] },
  { id: 'SETTLEMENT', chapterId: 'CH05', activeResources: ['food', 'materials', 'knowledge'] },
  { id: 'CITY', chapterId: 'CH06', activeResources: ['food', 'materials', 'knowledge'] },
  { id: 'INDUSTRY', chapterId: 'CH07', activeResources: ['food', 'materials', 'knowledge', 'power'] },
  { id: 'MODERN', chapterId: 'CH07', activeResources: ['food', 'materials', 'knowledge', 'power'] },
  { id: 'PRE_ATOMIC', chapterId: 'CH08', activeResources: ['materials', 'knowledge', 'power'] },
  { id: 'ATOMIC', chapterId: 'CH08', activeResources: ['materials', 'knowledge', 'power'] },
];
