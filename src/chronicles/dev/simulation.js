import { ruleset } from '../config/index.js';
import { createFakeClock } from '../adapters/clock.js';
import { createSeededRng } from '../adapters/rng.js';
import { createChroniclesEngine } from '../domain/engine.js';
import {
  selectManualProcessView,
  selectBuildingPrice,
  selectBuildingStatus,
  selectNodeStatus,
  selectProducerPrice,
  selectProducerStatus,
  selectProductionRates,
} from '../domain/selectors.js';
import { calculateManualReward, manualProcessCooldownMs } from '../domain/services/manualProcesses.js';
import { producerMilestoneMultiplier, productionMultiplierForResource } from '../domain/services/production.js';
import { calculateCap } from '../domain/services/resources.js';

const MAIN_NODE_ORDER = ['M01', 'M02', 'M03', 'M05', 'M06', 'C01', 'C02A', 'C03', 'C05', 'C06'];
const FULL_T1_NODE_ORDER = [
  'M01', 'M02', 'M03', 'M05', 'M06', 'C01', 'C02A', 'C03', 'C05', 'C06',
  'B02A', 'C07', 'B03', 'B04', 'B05', 'N02A', 'N03', 'N05', 'N07',
  'T01A', 'T02', 'T03', 'T05', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12',
  'T13', 'T14', 'T15', 'T16', 'T17', 'T18', 'A01', 'A02', 'A03', 'A04',
];
const OPTIONAL_NODE_ORDER = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'C01', 'C02A', 'C03', 'C05', 'C06'];
const SYMBIOSIS_NODE_ORDER = ['M01', 'M02', 'M03', 'M05', 'M06', 'C01', 'C02B', 'C03', 'C05', 'C06'];
const BRANCH_NODE_ORDER = {
  C02A: MAIN_NODE_ORDER,
  C02B: SYMBIOSIS_NODE_ORDER,
};
const MANUAL_PROCESS_ID = 'MANUAL_PRIMORDIAL_PULSE';
const MANUAL_DNA_PROCESS_ID = 'MANUAL_DNA_SYNTHESIS';
const DEFAULT_BIOMASS_ORDER = ['PROC_BIOMASS_UPTAKE', 'PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'];
const DEFAULT_ATP_ORDER = ['PROC_RESPIRATION', 'PROC_BIOMASS_UPTAKE', 'PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'];

// Cell-era (C01..C06) producer ramps, layered on top of the frozen M06 targets.
// Order per schedule entry: C01, <branch node>, C03, C05, C06.
function cellPhaseTargets(m06Targets, branchNodeId, schedule) {
  const [c01, branch, c03, c05, c06] = schedule;
  const phase = (extra) => ({ ...m06Targets, PROC_BIOMASS_UPTAKE: extra.biomass, PROC_RESPIRATION: extra.atp });
  return {
    C01: phase(c01),
    [branchNodeId]: phase(branch),
    C03: phase(c03),
    C05: phase(c05),
    C06: phase(c06),
  };
}

const FAST_CELL_SCHEDULE = [
  { biomass: 2, atp: 0 },
  { biomass: 4, atp: 2 },
  { biomass: 6, atp: 4 },
  { biomass: 8, atp: 6 },
  { biomass: 5, atp: 2 },
];
const MEDIUM_CELL_SCHEDULE = [
  { biomass: 1, atp: 0 },
  { biomass: 3, atp: 1 },
  { biomass: 4, atp: 3 },
  { biomass: 6, atp: 5 },
  { biomass: 5, atp: 2 },
];
const SLOW_CELL_SCHEDULE = [
  { biomass: 1, atp: 0 },
  { biomass: 2, atp: 1 },
  { biomass: 3, atp: 2 },
  { biomass: 5, atp: 4 },
  { biomass: 5, atp: 2 },
];
const MAX_CELL_SCHEDULE = [
  { biomass: 10, atp: 10 },
  { biomass: 10, atp: 10 },
  { biomass: 10, atp: 10 },
  { biomass: 10, atp: 10 },
  { biomass: 10, atp: 10 },
];

const BASELINE_OPTIMIZED_M06 = { PROC_PRIMORDIAL_REACTION: 8, PROC_RNA_REPLICATION: 6, PROC_DNA_SYNTHESIS: 6 };
const BASELINE_COMPETENT_M06 = { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 };
const BASELINE_SLOW_M06 = { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 };
const OPTIMIZED_M06 = { PROC_PRIMORDIAL_REACTION: 8, PROC_RNA_REPLICATION: 6, PROC_DNA_SYNTHESIS: 6 };
const COMPETENT_M06 = { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 };
const MANUAL_ASSISTED_M06 = { PROC_PRIMORDIAL_REACTION: 7, PROC_RNA_REPLICATION: 5, PROC_DNA_SYNTHESIS: 5 };
const SLOW_M06 = { PROC_PRIMORDIAL_REACTION: 9, PROC_RNA_REPLICATION: 6, PROC_DNA_SYNTHESIS: 6 };
const MILESTONE_SEEKER_M06 = { PROC_PRIMORDIAL_REACTION: 10, PROC_RNA_REPLICATION: 10, PROC_DNA_SYNTHESIS: 10 };

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
      M06: BASELINE_OPTIMIZED_M06,
      ...cellPhaseTargets(BASELINE_OPTIMIZED_M06, 'C02A', FAST_CELL_SCHEDULE),
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
      M06: BASELINE_COMPETENT_M06,
      ...cellPhaseTargets(BASELINE_COMPETENT_M06, 'C02A', MEDIUM_CELL_SCHEDULE),
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
      M06: BASELINE_SLOW_M06,
      ...cellPhaseTargets(BASELINE_SLOW_M06, 'C02A', SLOW_CELL_SCHEDULE),
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
      M06: OPTIMIZED_M06,
      ...cellPhaseTargets(OPTIMIZED_M06, 'C02A', FAST_CELL_SCHEDULE),
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
      M06: COMPETENT_M06,
      ...cellPhaseTargets(COMPETENT_M06, 'C02A', MEDIUM_CELL_SCHEDULE),
    },
    dnaOrder: ['PROC_DNA_SYNTHESIS', 'PROC_RNA_REPLICATION', 'PROC_PRIMORDIAL_REACTION'],
    rnaOrder: ['PROC_PRIMORDIAL_REACTION', 'PROC_RNA_REPLICATION', 'PROC_DNA_SYNTHESIS'],
  },
  competent_symbiosis: {
    decisionIntervalMs: 5000,
    manualEfficiencyThreshold: 0.05,
    manualSafetyUntilMs: 12 * 60 * 1000,
    maxActionsPerDecision: 3,
    phaseProducerTargets: {
      M01: { PROC_PRIMORDIAL_REACTION: 1, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M02: { PROC_PRIMORDIAL_REACTION: 4, PROC_RNA_REPLICATION: 0, PROC_DNA_SYNTHESIS: 0 },
      M03: { PROC_PRIMORDIAL_REACTION: 5, PROC_RNA_REPLICATION: 2, PROC_DNA_SYNTHESIS: 0 },
      M05: { PROC_PRIMORDIAL_REACTION: 6, PROC_RNA_REPLICATION: 4, PROC_DNA_SYNTHESIS: 3 },
      M06: COMPETENT_M06,
      ...cellPhaseTargets(COMPETENT_M06, 'C02B', MEDIUM_CELL_SCHEDULE),
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
      M06: MANUAL_ASSISTED_M06,
      ...cellPhaseTargets(MANUAL_ASSISTED_M06, 'C02A', MEDIUM_CELL_SCHEDULE),
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
      M06: SLOW_M06,
      ...cellPhaseTargets(SLOW_M06, 'C02A', SLOW_CELL_SCHEDULE),
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
      M06: MILESTONE_SEEKER_M06,
      ...cellPhaseTargets(MILESTONE_SEEKER_M06, 'C02A', MAX_CELL_SCHEDULE),
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

function producerCounts(state, profile, finalNodeId) {
  const targets = profile.phaseProducerTargets?.[finalNodeId] || {};
  return Object.fromEntries(
    Object.keys(targets).map((producerId) => [producerId, state.run.producers[producerId]?.count || 0])
  );
}

function addCost(target, cost) {
  for (const [resourceId, amount] of Object.entries(cost || {})) {
    target[resourceId] = (target[resourceId] || 0) + amount;
  }
}

function createSnapshot(engine, profile, finalNodeId) {
  return {
    atMs: engine.state.run.clock.simulationMs,
    producerCounts: producerCounts(engine.state, profile, finalNodeId),
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

// Picks which resource-specific purchase order to use for the currently blocked node: the
// resource in its cost with the largest shortfall, checked in this fixed priority (matches the
// pre-Iteration-4 dna-vs-rna heuristic exactly when a node's cost only contains rna/dna).
function shortfallResource(engine, activeNode) {
  const cost = activeNode?.cost || {};
  for (const resourceId of ['dna', 'biomass', 'atp']) {
    const amount = cost[resourceId];
    if (amount && amount > (engine.state.run.resources[resourceId]?.amount || 0)) {
      return resourceId;
    }
  }
  return 'rna';
}

function orderForResource(profile, resourceId) {
  if (resourceId === 'dna') return profile.dnaOrder;
  if (resourceId === 'biomass') return profile.biomassOrder || DEFAULT_BIOMASS_ORDER;
  if (resourceId === 'atp') return profile.atpOrder || DEFAULT_ATP_ORDER;
  return profile.rnaOrder;
}

function nextProducerId(engine, nodeOrder, profile, finalNodeId) {
  const activeNodeId = nodeOrder.find((nodeId) => !engine.state.run.nodes.completed[nodeId]);
  const activeNode = engine.ruleset.nodes.find((node) => node.id === activeNodeId);
  const producerTargets = profile.phaseProducerTargets?.[activeNodeId] || profile.phaseProducerTargets?.[finalNodeId] || {};
  const order = orderForResource(profile, shortfallResource(engine, activeNode));
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

function tryBuyNextNode(engine, nodeOrder, timings, snapshots, profile, spends, finalNodeId) {
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
    snapshots[`after_${nodeId}`] = createSnapshot(engine, profile, finalNodeId);
    return true;
  }
  return false;
}

// Storage is a progression gate, not a cosmetic purchase: when the next
// discovery costs more than the current cap, acquire the corresponding
// capacity structure before spending on more production.
function tryBuyRequiredStorage(engine, nodeOrder, spends, log) {
  const nodeId = nodeOrder.find((candidate) => !engine.state.run.nodes.completed[candidate]);
  const node = engine.ruleset.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) return false;

  for (const [resourceId, requiredAmount] of Object.entries(node.cost || {})) {
    // A conversion can leave a source resource just below an exact cap at the
    // end of every tick. Buying one more store at equality keeps the simulator
    // from treating an unreachable exact-cost purchase as affordable.
    if (requiredAmount < calculateCap(engine.state, resourceId, engine.ruleset)) continue;
    const building = engine.ruleset.buildings.find((candidate) =>
      (candidate.effects || []).some((effect) => effect.type === 'resource_capacity' && effect.resourceId === resourceId)
    );
    if (!building) return false;
    const status = selectBuildingStatus(engine.state, engine.ruleset, building.id);
    if (status !== 'available_affordable') return false;
    const cost = selectBuildingPrice(engine.state, engine.ruleset, building.id);
    const result = engine.dispatch({ type: 'BUY_BUILDING', buildingId: building.id });
    if (!result.ok) return false;
    addCost(spends.buildings, cost);
    log.push({ atMs: engine.state.run.clock.simulationMs, action: 'building', buildingId: building.id });
    return true;
  }
  return false;
}

function tryBuyProducer(engine, nodeOrder, profile, spends, log, finalNodeId) {
  const producerId = nextProducerId(engine, nodeOrder, profile, finalNodeId);
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

function currentIncompleteNode(engine, nodeOrder) {
  return nodeOrder.find((nodeId) => !engine.state.run.nodes.completed[nodeId]) || null;
}

function buyBuildingForSimulation(engine, buildingId, spends, log) {
  if (selectBuildingStatus(engine.state, engine.ruleset, buildingId) !== 'available_affordable') return false;
  const cost = selectBuildingPrice(engine.state, engine.ruleset, buildingId);
  const result = engine.dispatch({ type: 'BUY_BUILDING', buildingId });
  if (!result.ok) return false;
  addCost(spends.buildings, cost);
  log.push({ atMs: engine.state.run.clock.simulationMs, action: 'building', buildingId });
  return true;
}

function setCivilizationJobs(engine, log) {
  const population = engine.state.run.population;
  if (!population) return false;
  const jobs = engine.ruleset.jobs.filter((job) => job.eraIds.includes(engine.state.run.eraId));
  if (!jobs.length) return false;
  const workerCount = Math.floor(population.current);
  const foodJob = jobs.find((job) => job.lineage === 'food');
  const materialJob = jobs.find((job) => job.lineage === 'materials');
  const knowledgeJob = jobs.find((job) => job.lineage === 'knowledge');
  if (!foodJob || !materialJob || !knowledgeJob) return false;

  const foodRate = foodJob.output.food || 0.01;
  const foodWorkers = Math.min(workerCount, Math.max(1, Math.ceil((population.current * 0.12) / foodRate) + 1, Math.floor(workerCount * 0.28)));
  const remaining = Math.max(0, workerCount - foodWorkers);
  const materialWorkers = Math.floor(remaining * 0.62);
  const target = {
    [foodJob.id]: foodWorkers,
    [materialJob.id]: materialWorkers,
    [knowledgeJob.id]: remaining - materialWorkers,
  };
  const assignments = population.assignments || {};
  if (jobs.every((job) => (assignments[job.id] || 0) === target[job.id])) return false;

  for (const job of jobs) {
    if ((assignments[job.id] || 0) > 0) engine.dispatch({ type: 'ASSIGN_JOB', jobId: job.id, amount: 0 });
  }
  for (const [jobId, amount] of Object.entries(target)) {
    engine.dispatch({ type: 'ASSIGN_JOB', jobId, amount });
  }
  log.push({ atMs: engine.state.run.clock.simulationMs, action: 'jobs', assignments: target });
  return true;
}

function tryBuyFullTimelineInfrastructure(engine, nodeOrder, spends, log) {
  const completed = engine.state.run.nodes.completed;
  const currentNodeId = currentIncompleteNode(engine, nodeOrder);
  const currentNode = engine.ruleset.nodes.find((node) => node.id === currentNodeId);
  const planned = [];

  // Goal-only onboarding requirements precede the first Tribe breakthrough.
  if (['EARLY_CIV', 'TRIBE'].includes(engine.state.run.eraId)) planned.push('BLD_HEARTH', 'BLD_SHELTER', 'BLD_TOOL_BENCH');
  if (completed.T08) planned.push('BLD_FIELD', 'BLD_WORKSHOP');
  if (completed.T09) planned.push('BLD_SCHOOL');
  if (completed.T10) planned.push('BLD_MARKET');
  if (completed.T13) planned.push('BLD_FACTORY');
  if (completed.T14) planned.push('BLD_STEAM_PLANT', 'BLD_RAIL_HUB');
  if (completed.T15) planned.push('BLD_GRID');
  if (completed.T16) planned.push('BLD_LABORATORY');
  if (completed.A02) planned.push('BLD_REACTOR_LAB');
  for (const requirement of currentNode?.requiresBuildings || []) planned.unshift(requirement.buildingId);

  const houseTarget = completed.T12 ? 6 : completed.T09 ? 4 : completed.T08 ? 2 : 0;
  const houseCount = engine.state.run.buildings.BLD_HOUSE?.count || 0;
  if (houseCount < houseTarget) planned.unshift('BLD_HOUSE');

  for (const buildingId of [...new Set(planned)]) {
    const building = engine.ruleset.buildings.find((candidate) => candidate.id === buildingId);
    if (!building) continue;
    if (building.maxCount != null && (engine.state.run.buildings[buildingId]?.count || 0) >= building.maxCount) continue;
    const nodeRequirement = (currentNode?.requiresBuildings || []).find((requirement) => requirement.buildingId === buildingId);
    if (nodeRequirement && (engine.state.run.buildings[buildingId]?.count || 0) >= nodeRequirement.count) continue;
    // Required infrastructure is a tangible gate, not an unbounded auto-buy
    // sink. Storage and houses are handled by their dedicated policies.
    if (buildingId === 'BLD_HOUSE' && (engine.state.run.buildings[buildingId]?.count || 0) >= houseTarget) continue;
    if (buildingId !== 'BLD_HOUSE' && (engine.state.run.buildings[buildingId]?.count || 0) >= 1) continue;
    if (buyBuildingForSimulation(engine, buildingId, spends, log)) return true;
  }

  const steamPlants = engine.state.run.buildings.BLD_STEAM_PLANT?.count || 0;
  // Electricity is a stockpile gate for all four late discoveries. A player
  // who understands the loop expands generation immediately after the Grid,
  // instead of waiting through several low-output power caps in Pre-Atomic.
  if (completed.T15 && steamPlants < 3) {
    return buyBuildingForSimulation(engine, 'BLD_STEAM_PLANT', spends, log);
  }
  return false;
}

function fullTimelineStall(engine, nodeOrder) {
  const nodeId = currentIncompleteNode(engine, nodeOrder);
  if (!nodeId) return null;
  const node = engine.ruleset.nodes.find((candidate) => candidate.id === nodeId);
  const resources = Object.entries(node?.cost || {}).map(([resourceId, required]) => {
    const amount = engine.state.run.resources[resourceId]?.amount || 0;
    const cap = calculateCap(engine.state, resourceId, engine.ruleset);
    return {
      resourceId,
      required,
      amount,
      cap,
      missing: Math.max(0, required - amount),
      capBlocked: required >= cap,
    };
  });
  return {
    nodeId,
    status: selectNodeStatus(engine.state, engine.ruleset, nodeId),
    elapsedMs: engine.state.run.clock.simulationMs,
    eraId: engine.state.run.eraId,
    resources,
    population: engine.state.run.population
      ? { current: engine.state.run.population.current, cap: engine.state.run.population.baseCap }
      : null,
    pendingEventId: engine.state.run.events?.pendingId || null,
  };
}

function resolvePendingEventForProfile(engine, branchId, log, timings, snapshots, profile, spends, finalNodeId) {
  const eventId = engine.state.run.events.pendingId;
  if (!eventId) return false;
  const event = engine.ruleset.events.find((candidate) => candidate.id === eventId);
  const choice = event?.choices?.find((candidate) => candidate.purchaseNodeId === branchId) || event?.choices?.[0];
  if (!choice) return false;
  const result = engine.dispatch({ type: 'RESOLVE_EVENT', eventId, choiceId: choice.id });
  if (result.ok) {
    log.push({ atMs: engine.state.run.clock.simulationMs, action: 'event', eventId, choiceId: choice.id });
    if (choice.purchaseNodeId) {
      const node = engine.ruleset.nodes.find((candidate) => candidate.id === choice.purchaseNodeId);
      timings[choice.purchaseNodeId] = engine.state.run.clock.simulationMs;
      snapshots[`after_${choice.purchaseNodeId}`] = createSnapshot(engine, profile, finalNodeId);
      addCost(spends.nodes, node.cost);
    }
  }
  return result.ok;
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
  const branchId = options.branch || 'C02A';
  const fullTimeline = options.fullTimeline === true;
  const nodeOrder = fullTimeline
    ? FULL_T1_NODE_ORDER
    : (options.includeOptionalM04 ? OPTIONAL_NODE_ORDER : (BRANCH_NODE_ORDER[branchId] || MAIN_NODE_ORDER));
  const finalNodeId = nodeOrder[nodeOrder.length - 1];
  const branchNodeId = nodeOrder.find((nodeId) => nodeId.startsWith('C02'));
  const clock = options.clock || createFakeClock(0);
  const rng = options.rng || createSeededRng(options.seed || 1);
  const engine = createChroniclesEngine({ ruleset: sourceRuleset, ports: { clock, rng } });
  const maxMs = options.maxMs || (fullTimeline ? 240 * 60 * 1000 : 22 * 60 * 1000);
  const stepMs = options.stepMs || 1000;
  const log = [];
  const timingsByNode = {};
  const snapshots = {};
  const spends = { producers: {}, buildings: {}, nodes: {} };
  const manual = { uses: 0, rna: 0, dna: 0, rnaAfterThreeMinutes: 0, byProcess: {} };
  let automaticIncomeAtMs = null;
  let nextDecisionAtMs = 0;
  const nextManualAtMs = Object.fromEntries(manualProcessIdsForProfile(profile).map((processId) => [processId, 0]));
  let manualEconomicsAtThreeMinutes = null;

  while (
    engine.state.run.clock.simulationMs <= maxMs &&
    !(fullTimeline ? engine.state.run.lifecycle === 'ended' : engine.state.run.nodes.completed[finalNodeId])
  ) {
    const now = engine.state.run.clock.simulationMs;

    resolvePendingEventForProfile(engine, branchId, log, timingsByNode, snapshots, profile, spends, finalNodeId);

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
        if (fullTimeline) setCivilizationJobs(engine, log);
        acted =
          tryBuyNextNode(engine, nodeOrder, timingsByNode, snapshots, profile, spends, finalNodeId) ||
          tryBuyRequiredStorage(engine, nodeOrder, spends, log) ||
          (fullTimeline && tryBuyFullTimelineInfrastructure(engine, nodeOrder, spends, log)) ||
          tryBuyProducer(engine, nodeOrder, profile, spends, log, finalNodeId);
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

  const ending = engine.state.run.ending ? { ...engine.state.run.ending } : null;
  let archiveReset = null;
  if (fullTimeline && ending?.id === 'ENDING_ASH') {
    archiveReset = engine.dispatch({ type: 'ARCHIVE_RESET' });
    if (archiveReset.ok) log.push({ atMs: engine.state.run.clock.simulationMs, action: 'archive_reset', endingId: ending.id });
  }
  const stall = fullTimeline && !archiveReset?.ok ? fullTimelineStall(engine, nodeOrder) : null;

  return {
    ok: fullTimeline ? Boolean(archiveReset?.ok) : Boolean(engine.state.run.nodes.completed[finalNodeId]),
    profile: profileName,
    branch: branchId,
    fullTimeline,
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
      metabolismAtMs: timingsByNode.C01 ?? null,
      branchAtMs: timingsByNode[branchNodeId] ?? null,
      proteinSynthesisAtMs: timingsByNode.C03 ?? null,
      organellesAtMs: timingsByNode.C05 ?? null,
      cellCoordinationAtMs: timingsByNode.C06 ?? null,
      multicellularityAtMs: timingsByNode.C07 ?? null,
      sapienceAtMs: timingsByNode.N07 ?? null,
      tribeAtMs: timingsByNode.T05 ?? null,
      settlementAtMs: timingsByNode.T09 ?? null,
      cityAtMs: timingsByNode.T12 ?? null,
      industryAtMs: timingsByNode.T15 ?? null,
      modernAtMs: timingsByNode.T18 ?? null,
      atomicAtMs: timingsByNode.A04 ?? null,
      ashAtMs: ending?.completedAtMs ?? null,
    },
    producerCounts: producerCounts(engine.state, profile, finalNodeId),
    finalRates: selectProductionRates(engine.state, sourceRuleset),
    manual: { ...manual, economicsAtThreeMinutes: manualEconomicsAtThreeMinutes },
    spends,
    snapshots,
    ending,
    archiveReset: archiveReset ? { ok: archiveReset.ok, reason: archiveReset.reason || null } : null,
    stall,
  };
}

export function runFullTimelineSimulation(options = {}) {
  return runHeadlessSimulation({ ...options, fullTimeline: true });
}
