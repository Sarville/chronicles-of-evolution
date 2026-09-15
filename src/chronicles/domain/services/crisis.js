export function createInitialCrisisState() {
  return {
    active: true,
    stability: 100,
    crisisClockMs: 0,
    atomicLoad: 1,
    unresolvedCrises: 0,
  };
}

