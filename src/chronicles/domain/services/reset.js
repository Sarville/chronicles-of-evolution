export function createResetCandidate(state, transactionId) {
  return {
    transactionId,
    closedRunId: state.run.id,
    timelineId: state.run.timelineId,
    endingId: 'ENDING_ASH',
    createdAtSimulationMs: state.run.clock.simulationMs,
  };
}

