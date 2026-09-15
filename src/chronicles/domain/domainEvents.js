export function createDomainEvent(type, payload, state, ports = {}) {
  return Object.freeze({
    type,
    payload: Object.freeze({ ...payload }),
    occurredAtMs: state.run.clock.simulationMs,
    wallTimeMs: ports.clock ? ports.clock.getNow() : null,
  });
}

