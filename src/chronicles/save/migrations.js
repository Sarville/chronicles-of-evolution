export const CURRENT_SCHEMA_VERSION = 2;

// Kept data-local so a save migration remains deterministic and does not
// depend on the runtime ruleset module. New games receive these through the
// normal effect pipeline; v3 saves need the already completed discoveries
// rehydrated once.
const CAPACITY_EFFECTS_BY_NODE = {
  M02: [{ resourceId: 'rna', value: 300 }],
  M03: [{ resourceId: 'rna', value: 500 }, { resourceId: 'dna', value: 200 }],
  M05: [{ resourceId: 'rna', value: 1000 }, { resourceId: 'dna', value: 250 }],
  M06: [{ resourceId: 'dna', value: 350 }, { resourceId: 'biomass', value: 200 }],
  C01: [{ resourceId: 'atp', value: 120 }],
  C02C: [{ resourceId: 'biomass', value: 60 }],
  C05: [{ resourceId: 'biomass', value: 120 }],
  T01A: [{ resourceId: 'food', value: 300 }, { resourceId: 'materials', value: 200 }, { resourceId: 'knowledge', value: 80 }],
  T01B: [{ resourceId: 'food', value: 300 }, { resourceId: 'materials', value: 200 }, { resourceId: 'knowledge', value: 80 }],
  T01C: [{ resourceId: 'food', value: 300 }, { resourceId: 'materials', value: 200 }, { resourceId: 'knowledge', value: 80 }],
  T02: [{ resourceId: 'food', value: 500 }, { resourceId: 'materials', value: 250 }, { resourceId: 'knowledge', value: 100 }],
  T03: [{ resourceId: 'food', value: 900 }, { resourceId: 'materials', value: 400 }, { resourceId: 'knowledge', value: 150 }],
  T05: [{ resourceId: 'food', value: 1000 }, { resourceId: 'materials', value: 700 }, { resourceId: 'knowledge', value: 200 }],
};

function rehydrateCapacityEffects(run) {
  run.modifiers ||= { active: {} };
  run.modifiers.active ||= {};
  for (const [nodeId, effects] of Object.entries(CAPACITY_EFFECTS_BY_NODE)) {
    if (!run.nodes?.completed?.[nodeId]) continue;
    for (const effect of effects) {
      run.modifiers.active[`${nodeId}:capacity:${effect.resourceId}`] = { type: 'resource_capacity', ...effect };
    }
  }
}

function migrateCellularEnergyToAtp(run) {
  if (run.resources?.energy) {
    run.resources.atp ||= run.resources.energy;
    delete run.resources.energy;
  }
  if (run.stats?.totalEarned?.energy != null) {
    run.stats.totalEarned.atp = (run.stats.totalEarned.atp || 0) + run.stats.totalEarned.energy;
    delete run.stats.totalEarned.energy;
  }
  if (run.buildings?.BLD_ENERGY_STORE) {
    run.buildings.BLD_ATP_STORE ||= run.buildings.BLD_ENERGY_STORE;
    delete run.buildings.BLD_ENERGY_STORE;
  }
  const active = run.modifiers?.active;
  if (active) {
    for (const [key, effect] of Object.entries(active)) {
      const migratedKey = key.replaceAll('BLD_ENERGY_STORE', 'BLD_ATP_STORE').replace(/:energy(?=$|:)/g, ':atp');
      if (effect.resourceId === 'energy') effect.resourceId = 'atp';
      if (migratedKey !== key) {
        active[migratedKey] = effect;
        delete active[key];
      }
    }
  }
}

const BASE_RESOURCE_CAPS = {
  rna: 100,
  dna: 100,
  biomass: 80,
  atp: 40,
  food: 300,
  materials: 150,
  knowledge: 100,
  power: 100,
};

const STORAGE_CAPACITY_EFFECTS = {
  BLD_MEMBRANE_STORE: [{ resourceId: 'rna', value: 250 }],
  BLD_GENETIC_STORE: [{ resourceId: 'dna', value: 150 }],
  BLD_BIOMASS_STORE: [{ resourceId: 'biomass', value: 160 }],
  BLD_ATP_STORE: [{ resourceId: 'atp', value: 120 }],
  BLD_FOOD_STORE: [{ resourceId: 'food', value: 1500 }],
  BLD_MATERIALS_STORE: [{ resourceId: 'materials', value: 2000 }],
  BLD_KNOWLEDGE_ARCHIVE: [{ resourceId: 'knowledge', value: 1500 }],
  BLD_POWER_STORE: [{ resourceId: 'power', value: 2000 }],
};

function migrateToStorageGates(run) {
  run.modifiers ||= { active: {} };
  const active = run.modifiers.active ||= {};
  for (const [key, effect] of Object.entries(active)) {
    if (effect.type === 'resource_capacity') delete active[key];
  }

  const caps = { ...BASE_RESOURCE_CAPS };
  for (const [buildingId, effects] of Object.entries(STORAGE_CAPACITY_EFFECTS)) {
    const count = run.buildings?.[buildingId]?.count || 0;
    for (let instance = 1; instance <= count; instance += 1) {
      for (const effect of effects) {
        active[`${buildingId}:${instance}:capacity:${effect.resourceId}`] = { type: 'resource_capacity', ...effect };
        caps[effect.resourceId] = (caps[effect.resourceId] || 0) + effect.value;
      }
    }
  }
  for (const [resourceId, resource] of Object.entries(run.resources || {})) {
    if (caps[resourceId] != null) resource.amount = Math.min(resource.amount, caps[resourceId]);
  }
}

function migrateLegacyAdaptationPoints(run) {
  const adaptation = run.adaptation ||= { points: 0, earnedTotal: 0, spentTotal: 0, selectedOptionalNodes: [] };
  adaptation.selectedOptionalNodes ||= [];
  adaptation.earnedTotal ||= 0;
  adaptation.spentTotal ||= 0;
  // Early v9 saves could already contain C06 before the G007 reward was
  // introduced. Preserve their progression by restoring the one-time grant.
  if (run.nodes?.completed?.C06 && adaptation.earnedTotal === 0) {
    const spent = adaptation.selectedOptionalNodes.reduce((total, nodeId) => {
      return total + ({ B02A: 1, B02B: 1, B02C: 1, B02D: 2 }[nodeId] || 0);
    }, 0);
    adaptation.earnedTotal = 2;
    adaptation.spentTotal = Math.max(adaptation.spentTotal, spent);
    adaptation.points = Math.max(adaptation.points || 0, Math.max(0, 2 - spent));
  }
}

export function normalizeEnvelope(envelope) {
  if (!envelope || !envelope.run) return envelope;

  return {
    ...envelope,
    run: {
      ...envelope.run,
      goals: {
        currentId: envelope.run?.goals?.currentId || null,
        chapter: envelope.run?.goals?.chapter || { activeId: envelope.run?.goals?.currentId || null },
        side: envelope.run?.goals?.side || { activeIds: [] },
        states: envelope.run?.goals?.states || {},
      },
      flags: envelope.run?.flags || {},
      discovery: envelope.run?.discovery || { seenEntities: [], corruptedSeen: [] },
      manualProcesses: envelope.run?.manualProcesses || {},
      economy: {
        deficits: {},
        ...(envelope.run?.economy || {}),
      },
      adaptation: {
        points: 0,
        earnedTotal: 0,
        spentTotal: 0,
        selectedOptionalNodes: [],
        ...(envelope.run?.adaptation || {}),
      },
      cognition: {
        eventBonus: 0,
        ...(envelope.run?.cognition || {}),
      },
      stats: {
        totalEarned: {},
        ...(envelope.run?.stats || {}),
      },
      events: {
        rngState: 1,
        queue: [],
        pendingId: null,
        states: {},
        history: [],
        lastDeckDrawAtMs: {},
        ...(envelope.run?.events || {}),
      },
    },
    meta: {
      archiveFragments: 0,
      chronicle: [],
      unlocks: {},
      appliedTransactions: [],
      persistentFlags: {},
      seenEntities: {},
      ...(envelope.meta || {}),
    },
    settings: {
      locale: 'ru',
      autosave: true,
      testMode: false,
      ...(envelope.settings || {}),
    },
    transactions: {
      pendingReset: null,
      ...(envelope.transactions || {}),
    },
  };
}

export function migrateEnvelope(envelope) {
  if (!envelope || !envelope.run) return envelope;
  if (envelope.schemaVersion !== 1 && envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) return envelope;
  const migrated = normalizeEnvelope({ ...envelope, schemaVersion: CURRENT_SCHEMA_VERSION });
  if (migrated.rulesetVersion === 'timeline1-v2-reconciled') {
    migrated.rulesetVersion = 'timeline1-v3-full';
    migrated.run.rulesetVersion = 'timeline1-v3-full';
    migrated.run.migrationNotice = 'T1-0: event engine added; progression and resources are unchanged.';
  }
  if (migrated.rulesetVersion === 'timeline1-v3-full') {
    rehydrateCapacityEffects(migrated.run);
    migrated.rulesetVersion = 'timeline1-v4-caps';
    migrated.run.rulesetVersion = 'timeline1-v4-caps';
    migrated.run.migrationNotice = 'T1-1: resource storage limits and capacity buildings restored.';
  }
  if (migrated.rulesetVersion === 'timeline1-v4-caps') {
    migrateCellularEnergyToAtp(migrated.run);
    migrated.rulesetVersion = 'timeline1-v5-atp';
    migrated.run.rulesetVersion = 'timeline1-v5-atp';
    migrated.run.migrationNotice = 'T1-2: cellular Energy renamed to ATP; stored amounts and capacity upgrades migrated.';
  }
  if (migrated.rulesetVersion === 'timeline1-v5-atp') {
    rehydrateCapacityEffects(migrated.run);
    migrated.rulesetVersion = 'timeline1-v6-cell-balance';
    migrated.run.rulesetVersion = 'timeline1-v6-cell-balance';
    migrated.run.migrationNotice = 'T1-3: Cell-era costs rebalanced; Organelles expands Biomass storage for C06.';
  }
  if (migrated.rulesetVersion === 'timeline1-v6-cell-balance') {
    migrateToStorageGates(migrated.run);
    migrated.rulesetVersion = 'timeline1-v7-storage-gates';
    migrated.run.rulesetVersion = 'timeline1-v7-storage-gates';
    migrated.run.migrationNotice = 'T1-4: storage gates restored; only storage buildings expand resource caps.';
  }
  if (migrated.rulesetVersion === 'timeline1-v7-storage-gates') {
    migrated.run.economy ||= { deficits: {} };
    migrated.run.economy.deficits ||= {};
    migrated.rulesetVersion = 'timeline1-v8-civilization-chains';
    migrated.run.rulesetVersion = 'timeline1-v8-civilization-chains';
    migrated.run.migrationNotice = 'T1-5: civilization jobs, Food maintenance and industrial Power deficits restored.';
  }
  if (migrated.rulesetVersion === 'timeline1-v8-civilization-chains') {
    migrated.run.crisis ??= null;
    migrated.rulesetVersion = 'timeline1-v9-full-t1-route';
    migrated.run.rulesetVersion = 'timeline1-v9-full-t1-route';
    migrated.run.migrationNotice = 'T1-6: full Tribe → Atomic route, crisis phases and Ash ending added.';
  }
  if (migrated.rulesetVersion === 'timeline1-v9-full-t1-route') {
    migrateLegacyAdaptationPoints(migrated.run);
    migrated.rulesetVersion = 'timeline1-v10-adaptation-repair';
    migrated.run.rulesetVersion = 'timeline1-v10-adaptation-repair';
    migrated.run.migrationNotice = 'T1-7: Adaptation Points restored for completed Cell Coordination.';
  }
  if (migrated.rulesetVersion === 'timeline1-v10-adaptation-repair') {
    migrated.rulesetVersion = 'timeline1-v11-branch-cost-fix';
    migrated.run.rulesetVersion = 'timeline1-v11-branch-cost-fix';
    migrated.run.migrationNotice = 'T1-1 fix: B02A-D and N02A-C no longer cost less than the core node that unlocks them.';
  }
  if (migrated.rulesetVersion === 'timeline1-v11-branch-cost-fix') {
    migrated.rulesetVersion = 'timeline1-v12-multicellularity-cost-fix';
    migrated.run.rulesetVersion = 'timeline1-v12-multicellularity-cost-fix';
    migrated.run.migrationNotice = 'T1-1 fix: C07 Multicellularity repriced to the canonical 24-28min window instead of resolving in ~19-21min.';
  }
  if (migrated.rulesetVersion === 'timeline1-v12-multicellularity-cost-fix') {
    migrated.rulesetVersion = 'timeline1-v13-t1-blight-collapse';
    migrated.run.rulesetVersion = 'timeline1-v13-t1-blight-collapse';
    migrated.run.migrationNotice = 'Act 1 redesign: T1 now ends at Tribe with the Мор collapse (ENDING_BLIGHT) instead of continuing into Settlement/City/.../Ash.';
  }
  return migrated;
}
