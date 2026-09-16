import { ruleset } from '../config/index.js';
import { createFakeClock } from '../adapters/clock.js';
import { createSeededRng } from '../adapters/rng.js';
import { createChroniclesEngine } from '../domain/engine.js';
import {
  selectManualProcessView,
  selectNodeStatus,
  selectProducerPrice,
  selectProducerStatus,
  selectProductionRates,
} from '../domain/selectors.js';
import { calculateManualReward, manualProcessCooldownMs } from '../domain/services/manualProcesses.js';
import { producerMilestoneMultiplier, productionMultiplierForResource } from '../domain/services/production.js';

const MAIN_NODE_ORDER = ['M01', 'M02', 'M03', 'M05', 'M06'];
const OPTIONAL_NODE_ORDER = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06'];
const MANUAL_PROCESS_ID = 'MANUAL_PRIMORDIAL_PULSE';
const MANUAL_DNA_PROCESS_ID = 'MANUAL_DNA_SYNTHESIS';

export const simulationProfiles = {
  baseline_optimized: {
    decisionIntervalMs: 1000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 12,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 5, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 6, PROC_RNA_REPLICATION: 3, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 4 },
      M06: { PROC_PRIMORDIAL_REACTION: 8, PROC_RNA_REPLICATION: 6, PROC_DNA_SYNTHESIS: 6 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'],
    rnaOrder: ['PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION', 'PROC_DNA_SYNTHESIS'],
  },
  baseline_competent: {
    decisionIntervalMs: 5000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 3,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 4, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 5, PROC_RNA_REPLICATION: 2, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 6, PROC_RNA_REPLICATION: 4, PROC_DNA_SYNTHESIS: 3 },
      M06: { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'],
    rnaOrder: ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS'],
  },
  baseline_slow: {
    decisionIntervalMs: 9000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 2,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 3, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 4, PROC_RNA_REPLICATION: 1, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 6, PROC_RNA_REPLICATION: 4, PROC_DNA_SYNTHESIS: 3 },
      M06: { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION'],
    rnaOrder: ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS'],
  },
  optimized: {
    decisionIntervalMs: 2500,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 12,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 5, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 6, PROC_RNA_REPLICATION: 3, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 4 },
      M06: { PROC_PRIMORDIAL_REACTION: 8, PROC_RNA_REPLICATION: 6, PROC_DNA_SYNTHESIS: 6 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'],
    rnaOrder: ['PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION', 'PROC_DNA_SYNTHESIS'],
  },
  competent: {
    decisionIntervalMs: 5000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 3,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 4, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 5, PROC_RNA_REPLICATION: 2, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 6, PROC_RNA_REPLICATION: 4, PROC_DNA_SYNTHESIS: 3 },
      M06: { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'],
    rnaOrder: ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS'],
  },
  manual_assisted: {
    decisionIntervalMs: 5000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    manualProcessIds: ['MANUAL_PRIMORDIAL_PULSE', 'MANUAL_DNA_SYNTHESIS'],
    maxActionsPerDecision: 3,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 4, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 5, PROC_RNA_REPLICATION: 2, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 6, PROC_RNA_REPLICATION: 4, PROC_DNA_SYNTHESIS: 3 },
      M06: { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'],
    rnaOrder: ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS'],
  },
  slow: {
    decisionIntervalMs: 5000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 2,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 3, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 4, PROC_RNA_REPLICATION: 1, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 8, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 4 },
      M06: { PROC_PRIMORDIAL_REACTION: 9, PROC_RNA_REPLICATION: 6, PROC_DNA_SYNTHESIS: 6 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION'],
    rnaOrder: ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS'],
  },
  milestone_seeker: {
    decisionIntervalMs: 2000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 6,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 10, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 10, PROC_RNA_REPLICATION: 10, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 10, PROC_RNA_REPLICATION: 10, PROC_DNA_SYNTHESIS: 10 },
      M06: { PROC_PRIMORDIAL_REACTION: 10, PROC_RNA_REPLICATION: 10, PROC_DNA_SYNTHESIS: 10 },
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'],
    rnaOrder: ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS'],
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

export function estimateProducerPurchasePayback(state, sourceRuleset, producerId) {
  const producer = sourceRuleset.producers.find((candidate) => candidate.id === producerId);
  if (!producer) {
    return null;
  }
  const count = state.run.producers[producerId]?.count || 0;
  const cost = selectProducerPrice(state, sourceRuleset, producerId);
  const beforeMilestone = producerMilestoneMultiplier(count, producer.milestones);
  const afterMilestone = producerMilestoneMultiplier(count + 1, producer.milestones);
  const outputDelta = {};
  for (const [resourceId, output] of Object.entries(producer.output || {})) {
    const multiplier = productionMultiplierForResource(state, resourceId);
    const before = count * output * beforeMilestone * multiplier;
    const after = (count + 1) * output * afterMilestone * multiplier;
    outputDelta[resourceId] = after - before;
  }
  const paybackSecondsByResource = {};
  for (const [resourceId, amount] of Object.entries(cost)) {
    if (outputDelta[resourceId] > 0) {
      paybackSecondsByResource[resourceId] = amount / outputDelta[resourceId];
    }
  }
  return {
    producerId,
    currentCount: count,
    nextCount: count + 1,
    cost,
    beforeMilestone,
    afterMilestone,
    outputDelta,
    paybackSecondsByResource,
  };
}

function nextProducerId(engine, nodeOrder, profile) {
  const activeNodeId = nodeOrder.find((nodeId) => !engine.state.run.nodes.completed[nodeId]);
  const activeNode = engine.ruleset.nodes.find((node) => node.id === activeNodeId);
  const producerTargets = profile.phaseProducerTargets?.[activeNodeId] || profile.phaseProducerTargets?.M06 || {};
  const needsDna = (activeNode?.cost.dna || 0) > (engine.state.run.resources.dna?.amount || 0);
  const order = needsDna ? profile.dnaOrder : profile.rnaOrder;
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

function manualProcessIdsForProfile(profile) {
  return profile.manualProcessIds || [MANUAL_PROCESS_ID];
}

function shouldUseManual(engine, sourceRuleset, profile, now, processId = MANUAL_PROCESS_ID) {
  if (now > (profile.manualSafetyUntilMs ?? Infinity)) {
    return false;
  }
  const view = selectManualProcessView(engine.state, sourceRuleset, processId);
  if (!view?.available || !view.affordable) {
    return false;
  }
  if (processId === MANUAL_DNA_PROCESS_ID) {
    return Boolean(engine.state.run.nodes.completed.M03) && !engine.state.run.nodes.completed.M06;
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
  const manual = { uses: 0, rna: 0, dna: 0, rnaAfterThreeMinutes: 0, byProcess: {} };
  let automaticIncomeAtMs = null;
  let nextDecisionAtMs = 0;
  const nextManualAtMs = Object.fromEntries(manualProcessIdsForProfile(profile).map((processId) => [processId, 0]));
  let manualEconomicsAtThreeMinutes = null;

  while (engine.state.run.clock.simulationMs <= maxMs && !engine.state.run.nodes.completed.M06) {
    const now = engine.state.run.clock.simulationMs;

    for (const processId of manualProcessIdsForProfile(profile)) {
      if (now < (nextManualAtMs[processId] || 0) || !shouldUseManual(engine, sourceRuleset, profile, now, processId)) {
        continue;
      }
      const manualResult = engine.dispatch({ type: 'USE_MANUAL_PROCESS', processId });
      if (manualResult.ok) {
        const reward = manualResult.events.find((event) => event.type === 'manual_process_used')?.payload.reward || {};
        const rna = reward.rna || 0;
        const dna = reward.dna || 0;
        manual.uses += 1;
        manual.rna += rna;
        manual.dna += dna;
        manual.byProcess[processId] ||= { uses: 0, reward: {} };
        manual.byProcess[processId].uses += 1;
        addCost(manual.byProcess[processId].reward, reward);
        if (now >= 180000) {
          manual.rnaAfterThreeMinutes += rna;
        }
        log.push({ atMs: now, action: 'manual', processId, reward });
        nextManualAtMs[processId] = engine.state.run.manualProcesses[processId].availableAtMs;
      } else {
        nextManualAtMs[processId] = now + stepMs;
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
      stableRnaAtMs: timingsByNode.M01 ?? null,
      selfReplicationAtMs: timingsByNode.M02 ?? null,
      dnaSynthesisAtMs: timingsByNode.M03 ?? null,
      errorCorrectionAtMs: timingsByNode.M04 ?? null,
      membraneAtMs: timingsByNode.M05 ?? null,
      cellAtMs: timingsByNode.M06 ?? null,
    },
    producerCounts: producerCounts(engine.state, profile),
    finalRates: selectProductionRates(engine.state, sourceRuleset),
    manual: { ...manual, economicsAtThreeMinutes: manualEconomicsAtThreeMinutes },
    spends,
    snapshots,
  };
}
