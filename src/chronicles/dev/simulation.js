import { ruleset } from '../config/index.js';
import { createFakeClock } from '../adapters/clock.js';
import { createSeededRng } from '../adapters/rng.js';
import { createChroniclesEngine } from '../domain/engine.js';
import { selectNodeStatus, selectProducerPrice, selectProducerStatus, selectProductionRates } from '../domain/selectors.js';
import { calculateManualReward, manualProcessCooldownMs } from '../domain/services/manualProcesses.js';

const MAIN_NODE_ORDER = ['M01', 'M02', 'M03', 'M05', 'M06'];
const OPTIONAL_NODE_ORDER = ['M01', 'M02', 'M03', 'M05', 'M04', 'M06'];
const MANUAL_PROCESS_ID = 'MANUAL_PRIMORDIAL_PULSE';

export const simulationProfiles = {
  optimized: {
    decisionIntervalMs: 1000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 12,
    phaseProducerTargets: {
      M01: { GEN_CHEMICAL_GRADIENT: 1, GEN_CATALYTIC_FOLD: 0, GEN_ENERGY_POCKET: 0 },
      M02: { GEN_CHEMICAL_GRADIENT: 7, GEN_CATALYTIC_FOLD: 3, GEN_ENERGY_POCKET: 0 },
      M03: { GEN_CHEMICAL_GRADIENT: 10, GEN_CATALYTIC_FOLD: 6, GEN_ENERGY_POCKET: 4 },
      M05: { GEN_CHEMICAL_GRADIENT: 12, GEN_CATALYTIC_FOLD: 8, GEN_ENERGY_POCKET: 6 },
      M06: { GEN_CHEMICAL_GRADIENT: 14, GEN_CATALYTIC_FOLD: 10, GEN_ENERGY_POCKET: 8 },
    },
    informationOrder: ['GEN_CATALYTIC_FOLD', 'GEN_CHEMICAL_GRADIENT', 'GEN_ENERGY_POCKET'],
    energyOrder: ['GEN_ENERGY_POCKET', 'GEN_CHEMICAL_GRADIENT', 'GEN_CATALYTIC_FOLD'],
  },
  competent: {
    decisionIntervalMs: 5000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 3,
    phaseProducerTargets: {
      M01: { GEN_CHEMICAL_GRADIENT: 1, GEN_CATALYTIC_FOLD: 0, GEN_ENERGY_POCKET: 0 },
      M02: { GEN_CHEMICAL_GRADIENT: 5, GEN_CATALYTIC_FOLD: 2, GEN_ENERGY_POCKET: 0 },
      M03: { GEN_CHEMICAL_GRADIENT: 5, GEN_CATALYTIC_FOLD: 2, GEN_ENERGY_POCKET: 0 },
      M05: { GEN_CHEMICAL_GRADIENT: 9, GEN_CATALYTIC_FOLD: 6, GEN_ENERGY_POCKET: 3 },
      M06: { GEN_CHEMICAL_GRADIENT: 13, GEN_CATALYTIC_FOLD: 10, GEN_ENERGY_POCKET: 7 },
    },
    informationOrder: ['GEN_CATALYTIC_FOLD', 'GEN_CHEMICAL_GRADIENT', 'GEN_ENERGY_POCKET'],
    energyOrder: ['GEN_CHEMICAL_GRADIENT', 'GEN_ENERGY_POCKET', 'GEN_CATALYTIC_FOLD'],
  },
  slow: {
    decisionIntervalMs: 9000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 2,
    phaseProducerTargets: {
      M01: { GEN_CHEMICAL_GRADIENT: 1, GEN_CATALYTIC_FOLD: 0, GEN_ENERGY_POCKET: 0 },
      M02: { GEN_CHEMICAL_GRADIENT: 5, GEN_CATALYTIC_FOLD: 1, GEN_ENERGY_POCKET: 0 },
      M03: { GEN_CHEMICAL_GRADIENT: 8, GEN_CATALYTIC_FOLD: 4, GEN_ENERGY_POCKET: 2 },
      M05: { GEN_CHEMICAL_GRADIENT: 10, GEN_CATALYTIC_FOLD: 6, GEN_ENERGY_POCKET: 4 },
      M06: { GEN_CHEMICAL_GRADIENT: 12, GEN_CATALYTIC_FOLD: 8, GEN_ENERGY_POCKET: 6 },
    },
    informationOrder: ['GEN_CHEMICAL_GRADIENT', 'GEN_CATALYTIC_FOLD', 'GEN_ENERGY_POCKET'],
    energyOrder: ['GEN_CHEMICAL_GRADIENT', 'GEN_ENERGY_POCKET', 'GEN_CATALYTIC_FOLD'],
  },
};

function canBuyProducer(engine, producerId) {
  return selectProducerStatus(engine.state, engine.ruleset, producerId) === 'available_affordable';
}

function resourceSum(cost) {
  return Object.values(cost || {}).reduce((sum, amount) => sum + amount, 0);
}

function producerCounts(state, profile) {
  const targets = profile.phaseProducerTargets?.M06 || {};
  return Object.fromEntries(
    Object.keys(targets).map((producerId) => [producerId, state.run.producers[producerId]?.count || 0])
  );
}

function addCost(target, cost) {
  for (const [resourceId, amount] of Object.entries(cost || {})) {
    target[resourceId] = (target[resourceId] || 0) + amount;
  }
}

function createSnapshot(engine, profile) {
  return {
    atMs: engine.state.run.clock.simulationMs,
    producerCounts: producerCounts(engine.state, profile),
    rates: selectProductionRates(engine.state, engine.ruleset),
    resources: Object.fromEntries(Object.entries(engine.state.run.resources).map(([id, value]) => [id, value.amount])),
    totalEarned: { ...engine.state.run.stats.totalEarned },
  };
}

function nextProducerId(engine, nodeOrder, profile) {
  const activeNodeId = nodeOrder.find((nodeId) => !engine.state.run.nodes.completed[nodeId]);
  const activeNode = engine.ruleset.nodes.find((node) => node.id === activeNodeId);
  const producerTargets = profile.phaseProducerTargets?.[activeNodeId] || profile.phaseProducerTargets?.M06 || {};
  const needsInformation = (activeNode?.cost.information || 0) > (engine.state.run.resources.information?.amount || 0);
  const order = needsInformation ? profile.informationOrder : profile.energyOrder;
  const affordable = order.filter((producerId) => {
    const targetCount = producerTargets[producerId] ?? 0;
    const currentCount = engine.state.run.producers[producerId]?.count || 0;
    return currentCount < targetCount && canBuyProducer(engine, producerId);
  });
  affordable.sort((a, b) => {
    return resourceSum(selectProducerPrice(engine.state, engine.ruleset, a)) - resourceSum(selectProducerPrice(engine.state, engine.ruleset, b));
  });
  return affordable[0] || null;
}

function tryBuyNextNode(engine, nodeOrder, timings, snapshots, profile, spends) {
  for (const nodeId of nodeOrder) {
    if (engine.state.run.nodes.completed[nodeId]) {
      continue;
    }
    if (selectNodeStatus(engine.state, engine.ruleset, nodeId) !== 'available_affordable') {
      return false;
    }
    const node = engine.ruleset.nodes.find((candidate) => candidate.id === nodeId);
    const result = engine.dispatch({ type: 'BUY_NODE', nodeId });
    if (!result.ok) {
      return false;
    }
    addCost(spends.nodes, node.cost);
    timings[nodeId] = engine.state.run.clock.simulationMs;
    snapshots[`after_${nodeId}`] = createSnapshot(engine, profile);
    return true;
  }
  return false;
}

function tryBuyProducer(engine, nodeOrder, profile, spends, log) {
  const producerId = nextProducerId(engine, nodeOrder, profile);
  if (!producerId) {
    return false;
  }
  const cost = selectProducerPrice(engine.state, engine.ruleset, producerId);
  const result = engine.dispatch({ type: 'BUY_PRODUCER', producerId });
  if (!result.ok) {
    return false;
  }
  addCost(spends.producers, cost);
  log.push({ atMs: engine.state.run.clock.simulationMs, action: 'producer', producerId });
  return true;
}

export function calculateManualEconomics(state, sourceRuleset, processId = MANUAL_PROCESS_ID) {
  const process = sourceRuleset.manualProcesses.find((candidate) => candidate.id === processId);
  if (!process) {
    return null;
  }
  const reward = calculateManualReward(state, sourceRuleset, process);
  const cooldownMs = manualProcessCooldownMs(state, process);
  const rates = selectProductionRates(state, sourceRuleset);
  const resourceId = process.reward?.resourceId;
  const manualPerSecond = cooldownMs > 0 ? (reward[resourceId] || 0) / (cooldownMs / 1000) : 0;
  const automaticPerSecond = rates[resourceId] || 0;
  return {
    processId,
    resourceId,
    reward,
    cooldownMs,
    manualPerSecond,
    automaticPerSecond,
    contributionRatio: automaticPerSecond > 0 ? manualPerSecond / automaticPerSecond : Infinity,
  };
}

function shouldUseManual(engine, sourceRuleset, profile, now) {
  if (now > (profile.manualSafetyUntilMs ?? Infinity)) {
    return false;
  }
  if (!engine.state.run.nodes.completed.M02) {
    return true;
  }
  const economics = calculateManualEconomics(engine.state, sourceRuleset);
  return economics && economics.contributionRatio >= (profile.manualEfficiencyThreshold ?? 0.05);
}

export function runHeadlessSimulation(options = {}) {
  const sourceRuleset = options.ruleset || ruleset;
  const profileName = options.profile || 'competent';
  const profile = options.profileConfig || simulationProfiles[profileName] || simulationProfiles.competent;
  const nodeOrder = options.includeOptionalM04 ? OPTIONAL_NODE_ORDER : MAIN_NODE_ORDER;
  const clock = options.clock || createFakeClock(0);
  const rng = options.rng || createSeededRng(options.seed || 1);
  const engine = createChroniclesEngine({ ruleset: sourceRuleset, ports: { clock, rng } });
  const maxMs = options.maxMs || 13 * 60 * 1000;
  const stepMs = options.stepMs || 1000;
  const log = [];
  const timingsByNode = {};
  const snapshots = {};
  const spends = { producers: {}, nodes: {} };
  const manual = { uses: 0, energy: 0, energyAfterThreeMinutes: 0 };
  let automaticIncomeAtMs = null;
  let nextDecisionAtMs = 0;
  let nextManualAtMs = 0;
  let manualEconomicsAtThreeMinutes = null;

  while (engine.state.run.clock.simulationMs <= maxMs && !engine.state.run.nodes.completed.M06) {
    const now = engine.state.run.clock.simulationMs;

    if (now >= nextManualAtMs && shouldUseManual(engine, sourceRuleset, profile, now)) {
      const manualResult = engine.dispatch({ type: 'USE_MANUAL_PROCESS', processId: MANUAL_PROCESS_ID });
      if (manualResult.ok) {
        const reward = manualResult.events.find((event) => event.type === 'manual_process_used')?.payload.reward || {};
        const energy = reward.energy || 0;
        manual.uses += 1;
        manual.energy += energy;
        if (now >= 180000) {
          manual.energyAfterThreeMinutes += energy;
        }
        log.push({ atMs: now, action: 'manual', reward });
        nextManualAtMs = engine.state.run.manualProcesses.MANUAL_PRIMORDIAL_PULSE.availableAtMs;
      } else {
        nextManualAtMs = now + stepMs;
      }
    }

    if (now >= nextDecisionAtMs) {
      let acted = true;
      let actions = 0;
      while (acted && actions < profile.maxActionsPerDecision) {
        acted =
          tryBuyNextNode(engine, nodeOrder, timingsByNode, snapshots, profile, spends) ||
          tryBuyProducer(engine, nodeOrder, profile, spends, log);
        actions += acted ? 1 : 0;
      }
      nextDecisionAtMs = now + profile.decisionIntervalMs;
    }

    const rates = selectProductionRates(engine.state, sourceRuleset);
    if (!manualEconomicsAtThreeMinutes && now >= 180000) {
      manualEconomicsAtThreeMinutes = calculateManualEconomics(engine.state, sourceRuleset);
    }
    if (automaticIncomeAtMs == null && Object.values(rates).some((rate) => rate > 0)) {
      automaticIncomeAtMs = now;
    }
    engine.tick(stepMs);
  }

  return {
    ok: Boolean(engine.state.run.nodes.completed.M06),
    profile: profileName,
    includeOptionalM04: options.includeOptionalM04 === true,
    state: engine.state,
    log,
    timings: {
      automaticIncomeAtMs,
      stableBondAtMs: timingsByNode.M01 ?? null,
      selfReplicationAtMs: timingsByNode.M02 ?? null,
      catalyticRnaAtMs: timingsByNode.M03 ?? null,
      errorCorrectionAtMs: timingsByNode.M04 ?? null,
      lipidShellAtMs: timingsByNode.M05 ?? null,
      protoCellAtMs: timingsByNode.M06 ?? null,
    },
    producerCounts: producerCounts(engine.state, profile),
    finalRates: selectProductionRates(engine.state, sourceRuleset),
    manual: { ...manual, economicsAtThreeMinutes: manualEconomicsAtThreeMinutes },
    spends,
    snapshots,
  };
}
