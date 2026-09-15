import { ruleset } from '../config/index.js';
import { createFakeClock } from '../adapters/clock.js';
import { createSeededRng } from '../adapters/rng.js';
import { createChroniclesEngine } from '../domain/engine.js';
import { selectNodeStatus, selectProducerPrice, selectProducerStatus, selectProductionRates } from '../domain/selectors.js';

const MAIN_NODE_ORDER = ['M01', 'M02', 'M03', 'M05', 'M06'];
const PRE_PROTO_CELL_TARGET_COUNTS = {
  GEN_CHEMICAL_GRADIENT: 14,
  GEN_CATALYTIC_FOLD: 10,
  GEN_ENERGY_POCKET: 8,
};

function canBuyProducer(engine, producerId) {
  return selectProducerStatus(engine.state, engine.ruleset, producerId) === 'available_affordable';
}

function buyBestProducer(engine) {
  const state = engine.state;
  const activeNodeId = MAIN_NODE_ORDER.find((nodeId) => !state.run.nodes.completed[nodeId]);
  const activeNode = engine.ruleset.nodes.find((node) => node.id === activeNodeId);
  const needsInformation = (activeNode?.cost.information || 0) > (state.run.resources.information?.amount || 0);
  const order = needsInformation
    ? ['GEN_CATALYTIC_FOLD', 'GEN_ENERGY_POCKET', 'GEN_CHEMICAL_GRADIENT']
    : ['GEN_ENERGY_POCKET', 'GEN_CHEMICAL_GRADIENT', 'GEN_CATALYTIC_FOLD'];
  const affordable = order.filter((producerId) => {
    const targetCount = PRE_PROTO_CELL_TARGET_COUNTS[producerId] ?? Infinity;
    const currentCount = state.run.producers[producerId]?.count || 0;
    return currentCount < targetCount && canBuyProducer(engine, producerId);
  });
  if (affordable.length === 0) {
    return null;
  }
  affordable.sort((a, b) => {
    const aCost = Object.values(selectProducerPrice(state, engine.ruleset, a)).reduce((sum, value) => sum + value, 0);
    const bCost = Object.values(selectProducerPrice(state, engine.ruleset, b)).reduce((sum, value) => sum + value, 0);
    return aCost - bCost;
  });
  const producerId = affordable[0];
  engine.dispatch({ type: 'BUY_PRODUCER', producerId });
  return producerId;
}

function tryBuyNextNode(engine, timings) {
  for (const nodeId of MAIN_NODE_ORDER) {
    if (engine.state.run.nodes.completed[nodeId]) {
      continue;
    }
    if (selectNodeStatus(engine.state, engine.ruleset, nodeId) !== 'available_affordable') {
      return false;
    }
    const result = engine.dispatch({ type: 'BUY_NODE', nodeId });
    if (!result.ok) {
      return false;
    }
    timings[nodeId] = engine.state.run.clock.simulationMs;
    return true;
  }
  return false;
}

export function runHeadlessSimulation(options = {}) {
  const clock = options.clock || createFakeClock(0);
  const rng = options.rng || createSeededRng(options.seed || 1);
  const engine = createChroniclesEngine({ ruleset, ports: { clock, rng } });
  const maxMs = options.maxMs || 10 * 60 * 1000;
  const stepMs = options.stepMs || 1000;
  const log = [];
  const timingsByNode = {};
  let automaticIncomeAtMs = null;

  while (engine.state.run.clock.simulationMs <= maxMs && !engine.state.run.nodes.completed.M06) {
    if (!engine.state.run.nodes.completed.M01) {
      const manual = engine.dispatch({ type: 'USE_MANUAL_PROCESS', processId: 'MANUAL_PRIMORDIAL_PULSE' });
      if (manual.ok) {
        log.push({ atMs: engine.state.run.clock.simulationMs, action: 'manual' });
      }
    }

    let acted = true;
    while (acted) {
      acted = tryBuyNextNode(engine, timingsByNode);
      if (!acted) {
        const producerId = buyBestProducer(engine);
        acted = Boolean(producerId);
        if (producerId) {
          log.push({ atMs: engine.state.run.clock.simulationMs, action: 'producer', producerId });
        }
      }
    }

    const rates = selectProductionRates(engine.state, ruleset);
    if (automaticIncomeAtMs == null && Object.values(rates).some((rate) => rate > 0)) {
      automaticIncomeAtMs = engine.state.run.clock.simulationMs;
    }
    engine.tick(stepMs);
  }

  return {
    ok: Boolean(engine.state.run.nodes.completed.M06),
    state: engine.state,
    log,
    timings: {
      automaticIncomeAtMs,
      selfReplicationAtMs: timingsByNode.M02 ?? null,
      protoCellAtMs: timingsByNode.M06 ?? null,
    },
  };
}
