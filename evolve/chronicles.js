(() => {
  // src/chronicles/adapters/storageAdapter.js
  function createBrowserStorage(storage2 = globalThis.localStorage) {
    return {
      get(key) {
        return storage2.getItem(key);
      },
      set(key, value) {
        storage2.setItem(key, value);
      },
      remove(key) {
        storage2.removeItem(key);
      }
    };
  }

  // src/chronicles/config/resources.js
  var resources = [
    {
      id: "rna",
      labelKey: "resource.rna",
      initialAmount: 0,
      // The original molecular loop starts with a small RNA pool; discoveries
      // and membrane storage expand it before the larger DNA-era purchases.
      baseCap: 100,
      visibleFromEra: "MOLECULAR"
    },
    {
      id: "dna",
      labelKey: "resource.dna",
      initialAmount: 0,
      baseCap: 100,
      visibleFromEra: "DNA_SYNTHESIS"
    },
    {
      id: "biomass",
      labelKey: "resource.biomass",
      initialAmount: 0,
      baseCap: 80,
      visibleFromEra: "CELLULAR"
    },
    {
      // ATP is the cell-phase metabolic currency. It deliberately does not
      // reuse the original game's later psychic Energy resource.
      id: "atp",
      labelKey: "resource.atp",
      initialAmount: 0,
      baseCap: 40,
      visibleFromEra: "CELLULAR"
    },
    {
      id: "food",
      labelKey: "resource.food",
      initialAmount: 0,
      baseCap: 300,
      visibleFromEra: "EARLY_CIV"
    },
    {
      id: "materials",
      labelKey: "resource.materials",
      initialAmount: 0,
      baseCap: 150,
      visibleFromEra: "EARLY_CIV"
    },
    {
      id: "knowledge",
      labelKey: "resource.knowledge",
      initialAmount: 0,
      baseCap: 100,
      visibleFromEra: "EARLY_CIV"
    },
    {
      id: "power",
      labelKey: "resource.power",
      initialAmount: 0,
      baseCap: 100,
      visibleFromEra: "INDUSTRY"
    }
  ];

  // src/chronicles/config/eras.js
  var eras = [
    { id: "MOLECULAR", chapterId: "CH01", activeResources: ["rna", "dna"] },
    { id: "CELLULAR", chapterId: "CH02", activeResources: ["rna", "dna", "biomass", "atp"] },
    { id: "MULTICELLULAR", chapterId: "CH03", activeResources: ["rna", "dna", "biomass", "atp"] },
    {
      id: "EARLY_CIV",
      chapterId: "CH04",
      activeResources: ["food", "materials", "knowledge"],
      civilizationStart: { population: 5, populationCap: 8, resources: { food: 120, materials: 45, knowledge: 12 } }
    },
    { id: "TRIBE", chapterId: "CH04", activeResources: ["food", "materials", "knowledge"] },
    { id: "SETTLEMENT_EARLY", chapterId: "CH05", activeResources: ["food", "materials", "knowledge"] },
    { id: "SETTLEMENT", chapterId: "CH05", activeResources: ["food", "materials", "knowledge"] },
    { id: "CITY", chapterId: "CH06", activeResources: ["food", "materials", "knowledge"] },
    { id: "INDUSTRY", chapterId: "CH07", activeResources: ["food", "materials", "knowledge", "power"] },
    { id: "MODERN", chapterId: "CH07", activeResources: ["food", "materials", "knowledge", "power"] },
    { id: "PRE_ATOMIC", chapterId: "CH08", activeResources: ["materials", "knowledge", "power"] },
    { id: "ATOMIC", chapterId: "CH08", activeResources: ["materials", "knowledge", "power"] }
  ];

  // src/chronicles/config/producers.js
  var producers = [
    {
      id: "PROC_PRIMORDIAL_REACTION",
      entityType: "producer",
      labelKey: "producer.primordial_reaction",
      unlocksAtStart: true,
      tags: ["rna", "process"],
      source: "primordial_chemistry",
      baseCost: { rna: 5 },
      growth: 1.35,
      output: { rna: 0.22 },
      producesBeforeAutoUnlock: true,
      milestones: [
        {
          count: 10,
          multiplier: 1.15,
          label: "Reaction network",
          description: "Isolated reactions link into a cooperative RNA reaction network."
        }
      ]
    },
    {
      id: "PROC_RNA_REPLICATION",
      entityType: "producer",
      labelKey: "producer.rna_replication",
      requiresNodes: ["M02"],
      tags: ["rna", "process", "replication"],
      source: "replication_template",
      baseCost: { rna: 34 },
      growth: 1.35,
      // Raised from the earlier standalone-economy value so the original
      // RNA→DNA conversion remains fast enough for the first Timeline.
      output: { rna: 0.82 },
      milestones: [
        {
          count: 10,
          multiplier: 1.15,
          label: "Shared template pool",
          description: "Copies reinforce the replication loop as a shared template pool."
        }
      ]
    },
    {
      id: "PROC_DNA_SYNTHESIS",
      entityType: "producer",
      labelKey: "producer.dna_synthesis",
      requiresNodes: ["M03"],
      tags: ["dna", "process"],
      baseCost: { rna: 78 },
      growth: 1.35,
      // Legacy evolution consumes two RNA for every DNA formed. The output is
      // intentionally faster than the legacy tick loop, but keeps its ratio.
      input: { rna: 0.52 },
      output: { dna: 0.26 },
      milestones: [
        {
          count: 10,
          multiplier: 1.15,
          label: "Genetic assembly chain",
          description: "Synthesis stabilizes into a reusable genetic assembly chain."
        }
      ]
    },
    {
      id: "PROC_BIOMASS_UPTAKE",
      entityType: "producer",
      labelKey: "producer.biomass_uptake",
      requiresNodes: ["M06"],
      tags: ["biomass", "process"],
      source: "environmental_uptake",
      // Cell-only resources are a T1 bridge (they do not exist in the legacy
      // molecular loop), so their ramp is deliberately faster after M06.
      baseCost: { dna: 55 },
      growth: 1.35,
      output: { biomass: 0.42 },
      milestones: [
        {
          count: 8,
          multiplier: 1.15,
          label: "Membrane transport network",
          description: "Uptake sites link into a coordinated membrane transport network."
        }
      ]
    },
    {
      id: "PROC_RESPIRATION",
      entityType: "producer",
      labelKey: "producer.respiration",
      requiresNodes: ["C01"],
      tags: ["atp", "process"],
      baseCost: { biomass: 25 },
      growth: 1.35,
      // Metabolic capacity is a conversion, not a second free income stream.
      input: { biomass: 0.3 },
      output: { atp: 0.35 },
      milestones: [
        {
          count: 8,
          multiplier: 1.15,
          label: "Shared electron transport chain",
          description: "Respiration pathways consolidate into a shared, more efficient transport chain."
        }
      ]
    }
  ];

  // src/chronicles/config/nodes.js
  var branchGroups = {
    cell_identity_1: ["C02A", "C02B", "C02C"],
    behavior_1: ["N02A", "N02B", "N02C"],
    culture_1: ["T01A", "T01B", "T01C"],
    body_adaptation_1: ["B02A", "B02B", "B02C", "B02D"]
  };
  var branchCostRules = {
    cell_identity_1: {
      allowAdditionalBranches: false
    },
    body_adaptation_1: {
      allowAdditionalBranches: true
    }
  };
  var nodes = [
    {
      id: "M01",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.M01",
      cost: { rna: 9 },
      requiresNodes: [],
      effects: [
        { type: "manual_gain_multiplier", value: 2 },
        { type: "unlock_auto_production" }
      ],
      goalId: "G001"
    },
    {
      id: "M02",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.M02",
      cost: { rna: 130 },
      requiresNodes: ["M01"],
      effects: [
        { type: "resource_production_multiplier", resourceId: "rna", value: 1.75 }
      ],
      goalId: "G002"
    },
    {
      id: "M03",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.M03",
      cost: { rna: 350 },
      requiresNodes: ["M02"],
      effects: [
        { type: "unlock_resource", resourceId: "dna" },
        { type: "resource_production_multiplier", resourceId: "rna", value: 1.15 }
      ],
      goalId: "G003"
    },
    {
      id: "M04",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "upgrade",
      labelKey: "node.M04",
      cost: { rna: 450, dna: 120 },
      requiresNodes: ["M03"],
      effects: [{ type: "resource_production_multiplier", resourceId: "dna", value: 1.45 }]
    },
    {
      id: "M05",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.M05",
      cost: { rna: 520, dna: 90 },
      requiresNodes: ["M03"],
      effects: [
        { type: "global_production_multiplier", value: 1.12 }
      ],
      goalId: "G004"
    },
    {
      id: "M06",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.M06",
      cost: { rna: 930, dna: 205 },
      requiresNodes: ["M05"],
      effects: [{ type: "unlock_resource", resourceId: "biomass" }],
      transition: "CELLULAR",
      goalId: "G005"
    },
    {
      id: "C01",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.C01",
      cost: { biomass: 10 },
      requiresNodes: ["M06"],
      effects: [{ type: "unlock_resource", resourceId: "atp" }]
    },
    {
      id: "C02A",
      entityType: "node",
      type: "BRANCH",
      semanticRole: "branch",
      branchGroup: "cell_identity_1",
      labelKey: "node.C02A",
      cost: { biomass: 30, atp: 15 },
      requiresNodes: ["C01"],
      effects: [
        { type: "resource_production_multiplier", resourceId: "biomass", value: 1.18 },
        { type: "set_flag", flag: "run.bio.primary_trait", value: "absorption" },
        { type: "set_flag", flag: "run.bio.absorption", value: true }
      ]
    },
    {
      id: "C02B",
      entityType: "node",
      type: "BRANCH",
      semanticRole: "branch",
      branchGroup: "cell_identity_1",
      labelKey: "node.C02B",
      cost: { biomass: 30, atp: 15 },
      requiresNodes: ["C01"],
      effects: [
        { type: "global_production_multiplier", value: 1.12 },
        { type: "set_flag", flag: "run.bio.primary_trait", value: "symbiosis" },
        { type: "set_flag", flag: "run.bio.symbiosis", value: true }
      ]
    },
    {
      id: "C02C",
      entityType: "node",
      type: "BRANCH",
      semanticRole: "branch",
      branchGroup: "cell_identity_1",
      labelKey: "node.C02C",
      cost: { biomass: 30, atp: 15 },
      requiresNodes: ["C01"],
      effects: [
        { type: "producer_cost_multiplier", producerTag: "biomass", value: 0.9 },
        { type: "set_flag", flag: "run.bio.primary_trait", value: "shell" },
        { type: "set_flag", flag: "run.bio.shell", value: true }
      ]
    },
    {
      id: "C03",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.C03",
      cost: { biomass: 110, atp: 50 },
      requiresAnyBranchGroup: "cell_identity_1",
      effects: [{ type: "resource_production_multiplier", resourceId: "atp", value: 1.25 }]
    },
    {
      id: "C04A",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "upgrade",
      labelKey: "node.C04A",
      cost: { atp: 40 },
      requiresNodes: ["C01"],
      effects: [
        { type: "resource_production_multiplier", resourceId: "atp", value: 1.15 },
        { type: "set_flag", flag: "run.bio.metabolism.photosynthesis", value: true }
      ]
    },
    {
      id: "C04B",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "upgrade",
      labelKey: "node.C04B",
      cost: { biomass: 45 },
      requiresNodes: ["C01"],
      effects: [
        { type: "resource_production_multiplier", resourceId: "atp", value: 1.15 },
        { type: "set_flag", flag: "run.bio.metabolism.chemosynthesis", value: true }
      ]
    },
    {
      id: "C04C",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "upgrade",
      labelKey: "node.C04C",
      cost: { biomass: 35, dna: 15 },
      requiresNodes: ["C01"],
      effects: [{ type: "resource_production_multiplier", resourceId: "biomass", value: 1.15 }]
    },
    {
      id: "C05",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.C05",
      cost: { biomass: 160, atp: 70 },
      requiresNodes: ["C03"],
      effects: [{ type: "global_production_multiplier", value: 1.15 }]
    },
    {
      id: "C06",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.C06",
      cost: { biomass: 170, atp: 100, dna: 160 },
      requiresNodes: ["C05"],
      effects: [{ type: "global_production_multiplier", value: 1.1 }],
      goalId: "G007"
    },
    {
      id: "B02A",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "adaptation",
      branchGroup: "body_adaptation_1",
      labelKey: "node.B02A",
      adaptationPointCost: 1,
      cost: { biomass: 185, atp: 115 },
      requiresNodes: ["C06"],
      effects: [{ type: "resource_production_multiplier", resourceId: "biomass", value: 1.12 }]
    },
    {
      id: "B02B",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "adaptation",
      branchGroup: "body_adaptation_1",
      labelKey: "node.B02B",
      adaptationPointCost: 1,
      cost: { biomass: 175, atp: 125 },
      requiresNodes: ["C06"],
      effects: [{ type: "resource_production_multiplier", resourceId: "atp", value: 1.12 }]
    },
    {
      id: "B02C",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "adaptation",
      branchGroup: "body_adaptation_1",
      labelKey: "node.B02C",
      adaptationPointCost: 1,
      cost: { biomass: 195, atp: 105 },
      requiresNodes: ["C06"],
      effects: [{ type: "global_production_multiplier", value: 1.06 }]
    },
    {
      id: "B02D",
      entityType: "node",
      type: "OPTIONAL",
      semanticRole: "adaptation",
      branchGroup: "body_adaptation_1",
      labelKey: "node.B02D",
      adaptationPointCost: 2,
      cost: { biomass: 225, atp: 135, dna: 175 },
      requiresNodes: ["C06"],
      effects: [{ type: "resource_production_multiplier", resourceId: "biomass", value: 1.1 }]
    },
    {
      id: "C07",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.C07",
      cost: { biomass: 250, atp: 140, dna: 210 },
      requiresNodes: ["C06"],
      effects: [],
      transition: "MULTICELLULAR",
      goalId: "G009"
    },
    { id: "B03", entityType: "node", type: "CORE", semanticRole: "core_tech", labelKey: "node.B03", cost: { biomass: 320, atp: 180, dna: 260 }, requiresNodes: ["C07"], effects: [] },
    { id: "B04", entityType: "node", type: "CORE", semanticRole: "core_tech", labelKey: "node.B04", cost: { biomass: 390, atp: 220, dna: 310 }, requiresNodes: ["B03"], effects: [], cognitionContribution: 20 },
    { id: "B05", entityType: "node", type: "CONVERGENCE", semanticRole: "breakthrough", labelKey: "node.B05", cost: { biomass: 460, atp: 270, dna: 380 }, requiresNodes: ["B04"], effects: [], cognitionContribution: 25 },
    { id: "N02A", entityType: "node", type: "BRANCH", semanticRole: "branch", branchGroup: "behavior_1", labelKey: "node.N02A", cost: { biomass: 480, atp: 285 }, requiresNodes: ["B05"], effects: [{ type: "set_flag", flag: "run.bio.behavior", value: "solitary" }] },
    { id: "N02B", entityType: "node", type: "BRANCH", semanticRole: "branch", branchGroup: "behavior_1", labelKey: "node.N02B", cost: { biomass: 480, atp: 285 }, requiresNodes: ["B05"], effects: [{ type: "set_flag", flag: "run.bio.behavior", value: "social" }] },
    { id: "N02C", entityType: "node", type: "BRANCH", semanticRole: "branch", branchGroup: "behavior_1", labelKey: "node.N02C", cost: { biomass: 480, atp: 285 }, requiresNodes: ["B05"], effects: [{ type: "set_flag", flag: "run.bio.behavior", value: "tool_use" }] },
    { id: "N03", entityType: "node", type: "CORE", semanticRole: "core_tech", labelKey: "node.N03", cost: { biomass: 500, atp: 300, dna: 440 }, requiresNodes: ["B05"], requiresAnyBranchGroup: "behavior_1", effects: [], cognitionContribution: 30 },
    { id: "N05", entityType: "node", type: "CORE", semanticRole: "core_tech", labelKey: "node.N05", cost: { biomass: 560, atp: 340, dna: 500 }, requiresNodes: ["N03"], effects: [], cognitionContribution: 25 },
    { id: "N07", entityType: "node", type: "CONVERGENCE", semanticRole: "breakthrough", labelKey: "node.N07", cost: {}, requiresNodes: ["N05"], cognitionMin: 100, cognitionContributions: [{ nodeId: "B04", value: 20 }, { nodeId: "B05", value: 25 }, { nodeId: "N03", value: 30 }, { nodeId: "N05", value: 25 }], effects: [], transition: "EARLY_CIV", goalId: "G013" },
    {
      id: "T01A",
      entityType: "node",
      type: "BRANCH",
      semanticRole: "branch",
      branchGroup: "culture_1",
      labelKey: "node.T01A",
      cost: { food: 250, materials: 120, knowledge: 35 },
      requiresNodes: [],
      effects: [
        { type: "job_output_multiplier", jobId: "JOB_TRIBE_FORAGER", value: 1.35 }
      ]
    },
    {
      id: "T01B",
      entityType: "node",
      type: "BRANCH",
      semanticRole: "branch",
      branchGroup: "culture_1",
      labelKey: "node.T01B",
      cost: { food: 220, materials: 100, knowledge: 40 },
      requiresNodes: [],
      effects: [
        { type: "resource_production_multiplier", resourceId: "food", value: 1.15 },
        { type: "resource_production_multiplier", resourceId: "materials", value: 1.15 }
      ]
    },
    {
      id: "T01C",
      entityType: "node",
      type: "BRANCH",
      semanticRole: "branch",
      branchGroup: "culture_1",
      labelKey: "node.T01C",
      cost: { food: 230, materials: 110, knowledge: 45 },
      requiresNodes: [],
      effects: [
        { type: "resource_production_multiplier", resourceId: "knowledge", value: 1.25 }
      ]
    },
    {
      id: "T02",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T02",
      cost: { food: 420, materials: 240, knowledge: 60 },
      requiresAnyBranchGroup: "culture_1",
      effects: [
        { type: "resource_production_multiplier", resourceId: "food", value: 1.2 }
      ],
      goalId: "G014"
    },
    {
      id: "T03",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T03",
      cost: { food: 610, materials: 330, knowledge: 95 },
      requiresNodes: ["T02"],
      effects: [
        { type: "job_output_multiplier", jobId: "JOB_TRIBE_FORAGER", value: 1.25 }
      ],
      goalId: "G014"
    },
    {
      id: "T05",
      entityType: "node",
      type: "CORE",
      semanticRole: "breakthrough",
      labelKey: "node.T05",
      cost: { food: 900, materials: 520, knowledge: 145 },
      requiresNodes: ["T03"],
      populationMin: 8,
      effects: [],
      transition: "TRIBE",
      goalId: "G015"
    },
    {
      id: "T07",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T07",
      cost: { food: 1150, materials: 620, knowledge: 210 },
      requiresNodes: ["T05"],
      effects: []
    },
    {
      id: "T08",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.T08",
      cost: { food: 1650, materials: 900, knowledge: 300 },
      requiresNodes: ["T07"],
      populationMin: 14,
      effects: [{ type: "unlock_building", buildingId: "BLD_FIELD" }],
      transition: "SETTLEMENT_EARLY",
      goalId: "G016"
    },
    {
      id: "T09",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.T09",
      cost: { food: 2100, materials: 1150, knowledge: 390 },
      requiresNodes: ["T08"],
      populationMin: 14,
      requiresBuildings: [{ buildingId: "BLD_FIELD", count: 1 }, { buildingId: "BLD_HOUSE", count: 1 }, { buildingId: "BLD_WORKSHOP", count: 1 }],
      effects: [{ type: "unlock_building", buildingId: "BLD_SCHOOL" }],
      transition: "SETTLEMENT",
      goalId: "G017"
    },
    {
      id: "T10",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T10",
      cost: { food: 2700, materials: 1450, knowledge: 520 },
      requiresNodes: ["T09"],
      effects: [{ type: "unlock_building", buildingId: "BLD_MARKET" }],
      goalId: "G018"
    },
    {
      id: "T11",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T11",
      cost: { food: 3300, materials: 1800, knowledge: 690 },
      requiresNodes: ["T10"],
      effects: []
    },
    {
      id: "T12",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.T12",
      cost: { food: 4100, materials: 2300, knowledge: 880 },
      requiresNodes: ["T11"],
      populationMin: 28,
      requiresBuildings: [{ buildingId: "BLD_SCHOOL", count: 1 }, { buildingId: "BLD_MARKET", count: 1 }],
      effects: [],
      transition: "CITY",
      goalId: "G019"
    },
    {
      id: "T13",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T13",
      cost: { food: 4600, materials: 2900, knowledge: 1120 },
      requiresNodes: ["T12"],
      effects: [{ type: "unlock_building", buildingId: "BLD_FACTORY" }],
      goalId: "G020"
    },
    {
      id: "T14",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T14",
      cost: { food: 5100, materials: 3500, knowledge: 1380 },
      requiresNodes: ["T13"],
      effects: [{ type: "unlock_building", buildingId: "BLD_RAIL_HUB" }]
    },
    {
      id: "T15",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.T15",
      cost: { materials: 4400, knowledge: 1720 },
      requiresNodes: ["T14"],
      populationMin: 46,
      requiresBuildings: [{ buildingId: "BLD_FACTORY", count: 1 }, { buildingId: "BLD_STEAM_PLANT", count: 1 }],
      effects: [{ type: "unlock_building", buildingId: "BLD_GRID" }],
      transition: "INDUSTRY",
      goalId: "G021"
    },
    {
      id: "T16",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T16",
      cost: { materials: 7290, knowledge: 2970, power: 702 },
      requiresNodes: ["T15"],
      requiresBuildings: [{ buildingId: "BLD_GRID", count: 1 }],
      effects: []
    },
    {
      id: "T17",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.T17",
      cost: { materials: 7965, knowledge: 3780, power: 918 },
      requiresNodes: ["T16"],
      requiresBuildings: [{ buildingId: "BLD_LABORATORY", count: 1 }],
      effects: []
    },
    {
      id: "T18",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.T18",
      cost: { materials: 8775, knowledge: 4590, power: 1161 },
      requiresNodes: ["T17"],
      populationMin: 62,
      requiresBuildings: [{ buildingId: "BLD_RAIL_HUB", count: 1 }],
      effects: [],
      transition: "MODERN",
      goalId: "G022"
    },
    {
      id: "A01",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.A01",
      cost: { materials: 9585, knowledge: 5535, power: 1485 },
      requiresNodes: ["T18"],
      effects: [],
      transition: "PRE_ATOMIC"
    },
    {
      id: "A02",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.A02",
      cost: { materials: 10530, knowledge: 6615, power: 1823 },
      requiresNodes: ["A01"],
      effects: [{ type: "unlock_building", buildingId: "BLD_REACTOR_LAB" }]
    },
    {
      id: "A03",
      entityType: "node",
      type: "CORE",
      semanticRole: "core_tech",
      labelKey: "node.A03",
      cost: { materials: 11610, knowledge: 7830, power: 2160 },
      requiresNodes: ["A02"],
      requiresBuildings: [{ buildingId: "BLD_REACTOR_LAB", count: 1 }],
      effects: []
    },
    {
      id: "A04",
      entityType: "node",
      type: "CONVERGENCE",
      semanticRole: "breakthrough",
      labelKey: "node.A04",
      cost: { materials: 12420, knowledge: 8640, power: 2430 },
      requiresNodes: ["A03"],
      populationMin: 74,
      effects: [],
      transition: "ATOMIC",
      goalId: "G023"
    }
  ];

  // src/chronicles/config/buildings.js
  var buildings = [
    {
      id: "BLD_MEMBRANE_STORE",
      entityType: "building",
      labelKey: "building.membrane_store",
      eraIds: ["MOLECULAR", "CELLULAR", "MULTICELLULAR"],
      requiresNodes: ["M01"],
      baseCost: { rna: 8 },
      growth: 1.25,
      maxCount: null,
      effects: [{ type: "resource_capacity", resourceId: "rna", value: 250 }]
    },
    {
      id: "BLD_GENETIC_STORE",
      entityType: "building",
      labelKey: "building.genetic_store",
      eraIds: ["MOLECULAR", "CELLULAR", "MULTICELLULAR"],
      requiresNodes: ["M03"],
      baseCost: { rna: 30, dna: 12 },
      growth: 1.25,
      maxCount: null,
      effects: [
        { type: "resource_capacity", resourceId: "dna", value: 150 }
      ]
    },
    {
      id: "BLD_BIOMASS_STORE",
      entityType: "building",
      labelKey: "building.biomass_store",
      eraIds: ["CELLULAR", "MULTICELLULAR"],
      requiresNodes: ["M06"],
      baseCost: { dna: 25 },
      growth: 1.25,
      maxCount: null,
      effects: [{ type: "resource_capacity", resourceId: "biomass", value: 160 }]
    },
    {
      id: "BLD_ATP_STORE",
      entityType: "building",
      labelKey: "building.atp_store",
      eraIds: ["CELLULAR", "MULTICELLULAR"],
      requiresNodes: ["C01"],
      baseCost: { biomass: 15 },
      growth: 1.25,
      maxCount: null,
      effects: [{ type: "resource_capacity", resourceId: "atp", value: 120 }]
    },
    {
      id: "BLD_FOOD_STORE",
      entityType: "building",
      labelKey: "building.food_store",
      // T02 already exceeds the initial Food cap, so this must be available
      // immediately after a culture branch rather than after T05.
      requiresAnyBranchGroup: "culture_1",
      baseCost: { food: 80, materials: 40 },
      growth: 1.25,
      maxCount: null,
      effects: [{ type: "resource_capacity", resourceId: "food", value: 1500 }]
    },
    {
      id: "BLD_MATERIALS_STORE",
      entityType: "building",
      labelKey: "building.materials_store",
      requiresAnyBranchGroup: "culture_1",
      baseCost: { food: 50, materials: 45 },
      growth: 1.25,
      maxCount: null,
      effects: [{ type: "resource_capacity", resourceId: "materials", value: 2e3 }]
    },
    {
      id: "BLD_KNOWLEDGE_ARCHIVE",
      entityType: "building",
      labelKey: "building.knowledge_archive",
      // T05 is the first discovery above the base Knowledge cap.
      requiresNodes: ["T02"],
      baseCost: { food: 100, materials: 60, knowledge: 25 },
      growth: 1.25,
      maxCount: null,
      effects: [{ type: "resource_capacity", resourceId: "knowledge", value: 1500 }]
    },
    {
      id: "BLD_POWER_STORE",
      entityType: "building",
      labelKey: "building.power_store",
      requiresNodes: ["T08"],
      eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      baseCost: { materials: 360, knowledge: 160 },
      growth: 1.28,
      maxCount: null,
      effects: [{ type: "resource_capacity", resourceId: "power", value: 2e3 }]
    },
    {
      id: "BLD_FIELD",
      entityType: "building",
      labelKey: "building.field",
      requiresNodes: ["T08"],
      requiresFlags: ["run.unlock.building.BLD_FIELD"],
      baseCost: { materials: 260, food: 180 },
      growth: 1.18,
      maxCount: null,
      effects: [{ type: "job_output_multiplier", jobId: "JOB_SETTLEMENT_FARMER", value: 1.1 }]
    },
    {
      id: "BLD_HOUSE",
      entityType: "building",
      labelKey: "building.house",
      eraIds: ["SETTLEMENT_EARLY", "SETTLEMENT", "CITY"],
      requiresNodes: ["T08"],
      baseCost: { materials: 190, food: 100 },
      growth: 1.2,
      maxCount: null,
      effects: [{ type: "population_capacity", value: 12 }]
    },
    {
      id: "BLD_WORKSHOP",
      entityType: "building",
      labelKey: "building.workshop",
      eraIds: ["SETTLEMENT_EARLY", "SETTLEMENT", "CITY"],
      requiresNodes: ["T08"],
      baseCost: { materials: 230, food: 80, knowledge: 30 },
      growth: 1.22,
      maxCount: null,
      output: { materials: 0.42 }
    },
    {
      id: "BLD_SCHOOL",
      entityType: "building",
      labelKey: "building.school",
      eraIds: ["SETTLEMENT", "CITY"],
      requiresFlags: ["run.unlock.building.BLD_SCHOOL"],
      baseCost: { materials: 380, food: 140, knowledge: 80 },
      growth: 1.24,
      maxCount: null,
      output: { knowledge: 0.34 }
    },
    {
      id: "BLD_MARKET",
      entityType: "building",
      labelKey: "building.market",
      eraIds: ["SETTLEMENT", "CITY"],
      requiresFlags: ["run.unlock.building.BLD_MARKET"],
      baseCost: { materials: 440, food: 180, knowledge: 95 },
      growth: 1.24,
      maxCount: null,
      output: { food: 0.3, materials: 0.2 }
    },
    {
      id: "BLD_HEARTH",
      entityType: "building",
      labelKey: "building.hearth",
      eraIds: ["EARLY_CIV", "TRIBE"],
      baseCost: { materials: 20, food: 15 },
      growth: 1,
      maxCount: 1,
      output: { knowledge: 0.08 }
    },
    {
      id: "BLD_SHELTER",
      entityType: "building",
      labelKey: "building.shelter",
      eraIds: ["EARLY_CIV", "TRIBE"],
      baseCost: { materials: 35, food: 20 },
      growth: 1.22,
      maxCount: null,
      effects: [{ type: "population_capacity", value: 8 }]
    },
    {
      id: "BLD_TOOL_BENCH",
      entityType: "building",
      labelKey: "building.tool_bench",
      eraIds: ["EARLY_CIV", "TRIBE", "SETTLEMENT_EARLY", "SETTLEMENT"],
      baseCost: { materials: 40, food: 20 },
      growth: 1.25,
      maxCount: null,
      effects: [{ type: "job_output_multiplier", jobId: "JOB_TRIBE_GATHERER", value: 1.12 }]
    },
    {
      id: "BLD_MINE",
      entityType: "building",
      labelKey: "building.mine",
      eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      baseCost: { materials: 180, knowledge: 45 },
      growth: 1.22,
      maxCount: null,
      output: { materials: 0.75 }
    },
    {
      id: "BLD_STEAM_PLANT",
      entityType: "building",
      labelKey: "building.steam_plant",
      eraIds: ["CITY", "INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      requiresNodes: ["T14"],
      baseCost: { materials: 260, knowledge: 80 },
      growth: 1.25,
      maxCount: null,
      // Aggregate Materials includes the early industrial fuel/feedstock cost.
      input: { materials: 0.14 },
      output: { power: 1.25 }
    },
    {
      id: "BLD_FOUNDRY",
      entityType: "building",
      labelKey: "building.foundry",
      eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      baseCost: { materials: 240, knowledge: 65 },
      growth: 1.24,
      maxCount: null,
      input: { power: 0.55 },
      output: { materials: 1.05 }
    },
    {
      id: "BLD_LABORATORY",
      entityType: "building",
      labelKey: "building.laboratory",
      eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      baseCost: { materials: 220, knowledge: 100 },
      growth: 1.25,
      maxCount: null,
      input: { power: 0.4 },
      output: { knowledge: 0.8 }
    },
    {
      id: "BLD_FACTORY",
      entityType: "building",
      labelKey: "building.factory",
      eraIds: ["CITY", "INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      requiresFlags: ["run.unlock.building.BLD_FACTORY"],
      baseCost: { materials: 720, knowledge: 180 },
      growth: 1.25,
      maxCount: null,
      output: { materials: 0.95 }
    },
    {
      id: "BLD_RAIL_HUB",
      entityType: "building",
      labelKey: "building.rail_hub",
      eraIds: ["CITY", "INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      requiresFlags: ["run.unlock.building.BLD_RAIL_HUB"],
      baseCost: { materials: 950, knowledge: 260 },
      growth: 1.25,
      maxCount: null,
      output: { food: 0.45, materials: 0.35 }
    },
    {
      id: "BLD_GRID",
      entityType: "building",
      labelKey: "building.grid",
      eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"],
      requiresFlags: ["run.unlock.building.BLD_GRID"],
      baseCost: { materials: 1050, knowledge: 360, power: 180 },
      growth: 1.25,
      maxCount: null,
      input: { power: 0.3 },
      output: { knowledge: 0.45 }
    },
    {
      id: "BLD_REACTOR_LAB",
      entityType: "building",
      labelKey: "building.reactor_lab",
      eraIds: ["PRE_ATOMIC", "ATOMIC"],
      requiresFlags: ["run.unlock.building.BLD_REACTOR_LAB"],
      baseCost: { materials: 1800, knowledge: 920, power: 420 },
      growth: 1,
      maxCount: 1,
      input: { power: 0.85 },
      output: { knowledge: 0.65 }
    }
  ];

  // src/chronicles/config/jobs.js
  var jobs = [
    { id: "JOB_TRIBE_FORAGER", entityType: "job", labelKey: "job.tribe_forager", eraIds: ["EARLY_CIV", "TRIBE"], output: { food: 0.8 }, lineage: "food" },
    { id: "JOB_TRIBE_GATHERER", entityType: "job", labelKey: "job.tribe_gatherer", eraIds: ["EARLY_CIV", "TRIBE"], output: { materials: 0.48 }, lineage: "materials" },
    { id: "JOB_TRIBE_THINKER", entityType: "job", labelKey: "job.tribe_thinker", eraIds: ["EARLY_CIV", "TRIBE"], output: { knowledge: 0.2 }, lineage: "knowledge" },
    { id: "JOB_SETTLEMENT_FARMER", entityType: "job", labelKey: "job.settlement_farmer", eraIds: ["SETTLEMENT_EARLY", "SETTLEMENT"], output: { food: 0.95 }, lineage: "food" },
    { id: "JOB_SETTLEMENT_BUILDER", entityType: "job", labelKey: "job.settlement_builder", eraIds: ["SETTLEMENT_EARLY", "SETTLEMENT"], output: { materials: 0.65 }, lineage: "materials" },
    { id: "JOB_SETTLEMENT_SCHOLAR", entityType: "job", labelKey: "job.settlement_scholar", eraIds: ["SETTLEMENT_EARLY", "SETTLEMENT"], output: { knowledge: 0.32 }, lineage: "knowledge" },
    { id: "JOB_CITY_FARMER", entityType: "job", labelKey: "job.city_farmer", eraIds: ["CITY"], output: { food: 1.2 }, lineage: "food" },
    { id: "JOB_CITY_WORKER", entityType: "job", labelKey: "job.city_worker", eraIds: ["CITY"], output: { materials: 0.85 }, lineage: "materials" },
    { id: "JOB_CITY_RESEARCHER", entityType: "job", labelKey: "job.city_researcher", eraIds: ["CITY"], output: { knowledge: 0.52 }, lineage: "knowledge" },
    { id: "JOB_INDUSTRY_FARMER", entityType: "job", labelKey: "job.industry_farmer", eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"], output: { food: 1.45 }, lineage: "food" },
    { id: "JOB_INDUSTRY_WORKER", entityType: "job", labelKey: "job.industry_worker", eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"], output: { materials: 1.05 }, lineage: "materials" },
    { id: "JOB_INDUSTRY_SCIENTIST", entityType: "job", labelKey: "job.industry_scientist", eraIds: ["INDUSTRY", "MODERN", "PRE_ATOMIC", "ATOMIC"], output: { knowledge: 0.72 }, lineage: "knowledge" }
  ];

  // src/chronicles/config/goals.js
  var goals = [
    {
      id: "G001",
      title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u0443\u044E \u0420\u041D\u041A",
      description: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0438\u0447\u043D\u0443\u044E \u0440\u0435\u0430\u043A\u0446\u0438\u044E, \u043D\u0430\u043A\u043E\u043F\u0438\u0442\u0435 RNA \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 M01 Stable RNA.",
      targetTimeMs: 45e3,
      nodeId: "M01",
      chapterId: "CH01",
      slot: "chapter",
      sequence: { nextGoalId: "G002" },
      prerequisites: [],
      conditions: [{ type: "node_completed", nodeId: "M01" }],
      rewards: [],
      cta: { type: "node", targetId: "M01", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Stable RNA" },
      highlight: { type: "manual_process_or_node", targetId: "MANUAL_PRIMORDIAL_PULSE" },
      hintTimeoutMs: 2e4,
      hint: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u0438\u0447\u043D\u0443\u044E \u0440\u0435\u0430\u043A\u0446\u0438\u044E, \u0437\u0430\u0442\u0435\u043C \u0437\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u0435 Stable RNA \u0437\u0430 9 RNA."
    },
    {
      id: "G002",
      title: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u0441\u0430\u043C\u043E\u0440\u0435\u043F\u043B\u0438\u043A\u0430\u0446\u0438\u044E",
      description: "\u041D\u0430\u043A\u043E\u043F\u0438\u0442\u0435 RNA \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 M02 Self Replication, \u0447\u0442\u043E\u0431\u044B \u0440\u0435\u0430\u043A\u0446\u0438\u044F \u0441\u0442\u0430\u043B\u0430 \u0441\u0430\u043C\u043E\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0449\u0435\u0439\u0441\u044F.",
      targetTimeMs: 12e4,
      nodeId: "M02",
      chapterId: "CH01",
      slot: "chapter",
      sequence: { previousGoalId: "G001", nextGoalId: "G003" },
      prerequisites: [{ type: "node_completed", nodeId: "M01" }],
      conditions: [{ type: "node_completed", nodeId: "M02" }],
      rewards: [],
      cta: { type: "node", targetId: "M02", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Self Replication" },
      highlight: { type: "producer", targetId: "PROC_RNA_REPLICATION" },
      hintTimeoutMs: 45e3,
      hint: "Primordial Reaction \u0434\u0430\u0451\u0442 \u0440\u0430\u043D\u043D\u044E\u044E RNA; \u043F\u043E\u0441\u043B\u0435 \u0441\u0430\u043C\u043E\u0440\u0435\u043F\u043B\u0438\u043A\u0430\u0446\u0438\u0438 \u0441\u0442\u0430\u043D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0431\u043E\u043B\u0435\u0435 \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F."
    },
    {
      id: "G003",
      title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0414\u041D\u041A",
      description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 M03 DNA Synthesis, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C DNA \u0438 optional-\u0443\u0437\u0435\u043B Error Correction.",
      targetTimeMs: 24e4,
      nodeId: "M03",
      chapterId: "CH01",
      slot: "chapter",
      sequence: { previousGoalId: "G002", nextGoalId: "G004" },
      prerequisites: [{ type: "node_completed", nodeId: "M02" }],
      conditions: [{ type: "node_completed", nodeId: "M03" }],
      rewards: [{ type: "reveal_entity", entityType: "node", entityId: "M04" }],
      cta: { type: "node", targetId: "M03", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C DNA Synthesis" },
      highlight: { type: "node", targetId: "M03" },
      hintTimeoutMs: 6e4,
      hint: "RNA \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043E\u0441\u043D\u043E\u0432\u043E\u0439 \u0440\u043E\u0441\u0442\u0430; DNA \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 M03 \u0438 \u043E\u0442\u043A\u0440\u043E\u0435\u0442 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0431\u0438\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0441\u043B\u043E\u0439."
    },
    {
      id: "G003_M04_OPTIONAL",
      title: "Optional: \u0438\u0441\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u043E\u0448\u0438\u0431\u043A\u0438 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F",
      description: "M04 Error Correction \u0443\u0441\u0438\u043B\u0438\u0432\u0430\u0435\u0442 DNA-\u043F\u0440\u043E\u0446\u0435\u0441\u0441, \u043D\u043E \u043D\u0435 \u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 \u043F\u0443\u0442\u044C \u043A Membrane \u0438 Cell.",
      targetTimeMs: 3e5,
      nodeId: "M04",
      chapterId: "CH01",
      slot: "side",
      optional: true,
      prerequisites: [{ type: "node_completed", nodeId: "M03" }],
      conditions: [{ type: "node_completed", nodeId: "M04" }],
      rewards: [],
      cta: { type: "node", targetId: "M04", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Error Correction" },
      highlight: { type: "node", targetId: "M04" },
      hintTimeoutMs: 9e4,
      hint: "\u042D\u0442\u043E optional-\u0432\u0435\u0442\u043A\u0430: \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0432\u044B\u0441\u0438\u0442\u044C \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u044C \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u0435\u0439\u0447\u0430\u0441 \u0438\u043B\u0438 \u0434\u0432\u0438\u0433\u0430\u0442\u044C\u0441\u044F \u043A Membrane."
    },
    {
      id: "G004",
      title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043C\u0435\u043C\u0431\u0440\u0430\u043D\u0443",
      description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 M05 Membrane, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u0434\u0435\u043B\u0438\u0442\u044C \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044E\u044E \u0441\u0440\u0435\u0434\u0443 \u0431\u0443\u0434\u0443\u0449\u0435\u0439 \u043A\u043B\u0435\u0442\u043A\u0438.",
      targetTimeMs: 42e4,
      nodeId: "M05",
      chapterId: "CH01",
      slot: "chapter",
      sequence: { previousGoalId: "G003", nextGoalId: "G005" },
      prerequisites: [{ type: "node_completed", nodeId: "M03" }],
      conditions: [{ type: "node_completed", nodeId: "M05" }],
      rewards: [],
      cta: { type: "node", targetId: "M05", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Membrane" },
      highlight: { type: "node", targetId: "M05" },
      hintTimeoutMs: 9e4,
      hint: "M04 \u043F\u043E\u043B\u0435\u0437\u0435\u043D, \u043D\u043E Membrane \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u043C \u043F\u0443\u0442\u0451\u043C \u043A \u043A\u043B\u0435\u0442\u043A\u0435."
    },
    {
      id: "G005",
      title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043A\u043B\u0435\u0442\u043A\u0443",
      description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 M06 Cell, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C Biomass \u0438 \u043A\u043B\u0435\u0442\u043E\u0447\u043D\u0443\u044E \u044D\u0440\u0443.",
      targetTimeMs: 6e5,
      nodeId: "M06",
      chapterId: "CH01",
      slot: "chapter",
      sequence: { previousGoalId: "G004", nextGoalId: "G006" },
      prerequisites: [{ type: "node_completed", nodeId: "M05" }],
      conditions: [{ type: "node_completed", nodeId: "M06" }],
      rewards: [{ type: "set_flag", flag: "milestone.cell_reached", value: true }],
      cta: { type: "node", targetId: "M06", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Cell" },
      highlight: { type: "node", targetId: "M06" },
      hintTimeoutMs: 12e4,
      hint: "\u0414\u043B\u044F Cell \u043D\u0443\u0436\u043D\u044B RNA \u0438 DNA: \u0441\u0438\u043D\u0442\u0435\u0437\u0438\u0440\u0443\u0439\u0442\u0435 DNA, \u043D\u043E \u043D\u0435 \u043E\u0431\u043D\u0443\u043B\u044F\u0439\u0442\u0435 RNA-\u043E\u0441\u043D\u043E\u0432\u0443 \u0440\u043E\u0441\u0442\u0430."
    },
    {
      id: "G006",
      title: "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0438\u0440\u0443\u0439\u0442\u0435 \u043C\u0435\u0442\u0430\u0431\u043E\u043B\u0438\u0437\u043C",
      description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 C01 Metabolism, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C ATP, \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0434\u0438\u043D primary trait \u2014 Absorption, Symbiosis \u0438\u043B\u0438 Shell.",
      targetTimeMs: 78e4,
      nodeId: "C01",
      chapterId: "CH02",
      slot: "chapter",
      sequence: { previousGoalId: "G005", nextGoalId: "G007" },
      prerequisites: [{ type: "node_completed", nodeId: "M06" }],
      conditions: [
        { type: "node_completed", nodeId: "C01" },
        { type: "branch_selected", branchGroup: "cell_identity_1" }
      ],
      rewards: [],
      cta: { type: "node", targetId: "C01", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Metabolism" },
      highlight: { type: "node", targetId: "C01" },
      hintTimeoutMs: 9e4,
      hint: "Biomass \u0443\u0436\u0435 \u043D\u0430\u043A\u0430\u043F\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 Cell; \u043F\u043E\u0442\u0440\u0430\u0442\u044C\u0442\u0435 \u0435\u0433\u043E \u043D\u0430 Metabolism, \u0437\u0430\u0442\u0435\u043C \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0434\u0438\u043D primary trait: Absorption \u0443\u0441\u043A\u043E\u0440\u044F\u0435\u0442 Biomass, Symbiosis \u0434\u0430\u0451\u0442 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u0440\u043E\u0441\u0442, Shell \u0441\u043D\u0438\u0436\u0430\u0435\u0442 \u043F\u043E\u0442\u0435\u0440\u0438. \u0412\u044B\u0431\u043E\u0440 \u043D\u0435\u043E\u0431\u0440\u0430\u0442\u0438\u043C \u0434\u043B\u044F Timeline #1."
    },
    {
      id: "G007",
      title: "\u0420\u0430\u0437\u0432\u0435\u0439\u0442\u0435 \u043A\u043B\u0435\u0442\u043E\u0447\u043D\u044B\u0435 \u0441\u0438\u0441\u0442\u0435\u043C\u044B",
      description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 Protein Synthesis / Ribosome, Organelles \u0438 Cell Coordination (C03 -> C05 -> C06).",
      targetTimeMs: 105e4,
      nodeId: "C06",
      chapterId: "CH02",
      slot: "chapter",
      sequence: { previousGoalId: "G006" },
      prerequisites: [
        { type: "node_completed", nodeId: "C01" },
        { type: "branch_selected", branchGroup: "cell_identity_1" }
      ],
      conditions: [{ type: "node_completed", nodeId: "C06" }],
      rewards: [{ type: "grant_adaptation_points", amount: 2 }],
      cta: { type: "node", targetId: "C03", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Protein Synthesis" },
      highlight: { type: "node", targetId: "C03" },
      hintTimeoutMs: 15e4,
      hint: "Protein Synthesis -> Organelles -> Cell Coordination \u0433\u043E\u0442\u043E\u0432\u044F\u0442 \u043A\u043B\u0435\u0442\u043A\u0443 \u043A Multicellularity. Photosynthesis/Chemosynthesis/Efficient Digestion \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u043C\u0438."
    },
    {
      id: "G008",
      title: "\u041E\u0441\u0432\u043E\u0439\u0442\u0435 \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u0438",
      description: "\u0412 \u043E\u0442\u043A\u0440\u044B\u0432\u0448\u0435\u043C\u0441\u044F \u043E\u043A\u043D\u0435 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0434\u043D\u0443 body adaptation \u2014 Mobility, Sensory Cells, Digestion \u0438\u043B\u0438 Structural Tissue.",
      targetTimeMs: 132e4,
      chapterId: "CH03",
      slot: "chapter",
      sequence: { previousGoalId: "G007", nextGoalId: "G009" },
      prerequisites: [{ type: "node_completed", nodeId: "C06" }],
      conditions: [{ type: "adaptation_selected", count: 1 }],
      rewards: [],
      cta: { type: "event", targetId: "EV-BIO-02", label: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044E" },
      highlight: { type: "event", targetId: "EV-BIO-02" },
      hintTimeoutMs: 12e4,
      hint: "Adaptation Points \u043D\u0435 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u044F\u0442\u0441\u044F \u0441\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C; \u043E\u043A\u043D\u043E \u0432\u044B\u0431\u043E\u0440\u0430 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 Cell Coordination, \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u0438 \u043C\u043E\u0436\u043D\u043E \u0434\u043E\u043A\u0443\u043F\u0438\u0442\u044C \u043F\u043E\u0437\u0436\u0435 \u0447\u0435\u0440\u0435\u0437 \u0434\u0435\u0440\u0435\u0432\u043E \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0439."
    },
    {
      id: "G009",
      title: "\u0421\u0442\u0430\u043D\u044C\u0442\u0435 \u043C\u043D\u043E\u0433\u043E\u043A\u043B\u0435\u0442\u043E\u0447\u043D\u044B\u043C",
      description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 C07 Multicellularity.",
      targetTimeMs: 156e4,
      nodeId: "C07",
      chapterId: "CH03",
      slot: "chapter",
      sequence: { previousGoalId: "G008", nextGoalId: "G010" },
      prerequisites: [{ type: "node_completed", nodeId: "C06" }, { type: "adaptation_selected", count: 1 }],
      conditions: [{ type: "node_completed", nodeId: "C07" }],
      rewards: [],
      cta: { type: "node", targetId: "C07", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Multicellularity" },
      highlight: { type: "node", targetId: "C07" },
      hintTimeoutMs: 18e4,
      hint: "\u0421\u043E\u0433\u043B\u0430\u0441\u0443\u0439\u0442\u0435 \u043A\u043B\u0435\u0442\u043A\u0438 \u0432 \u0435\u0434\u0438\u043D\u044B\u0439 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043C, \u043A\u043E\u0433\u0434\u0430 \u043D\u0430\u043A\u043E\u043F\u0438\u0442\u0435 Biomass, ATP \u0438 DNA."
    },
    { id: "G010", title: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439\u0442\u0435 \u0442\u0435\u043B\u043E", description: "\u0420\u0430\u0437\u0432\u0435\u0439\u0442\u0435 B03 Tissue Specialization.", targetTimeMs: 186e4, nodeId: "B03", chapterId: "CH03", slot: "chapter", sequence: { previousGoalId: "G009", nextGoalId: "G011" }, prerequisites: [{ type: "node_completed", nodeId: "C07" }], conditions: [{ type: "node_completed", nodeId: "B03" }], rewards: [], cta: { type: "node", targetId: "B03" }, highlight: { type: "node", targetId: "B03" } },
    { id: "G011", title: "\u0420\u0430\u0437\u0432\u0435\u0439\u0442\u0435 \u043E\u0440\u0433\u0430\u043D\u044B \u0447\u0443\u0432\u0441\u0442\u0432", description: "\u0420\u0430\u0437\u0432\u0435\u0439\u0442\u0435 B04 Nervous Tissue.", targetTimeMs: 198e4, nodeId: "B04", chapterId: "CH03", slot: "chapter", sequence: { previousGoalId: "G010", nextGoalId: "G012" }, prerequisites: [{ type: "node_completed", nodeId: "B03" }], conditions: [{ type: "node_completed", nodeId: "B04" }], rewards: [], cta: { type: "node", targetId: "B04" }, highlight: { type: "node", targetId: "B04" } },
    { id: "G012", title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043D\u0435\u0440\u0432\u043D\u0443\u044E \u0441\u0438\u0441\u0442\u0435\u043C\u0443", description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 B05 Nervous System.", targetTimeMs: 21e5, nodeId: "B05", chapterId: "CH03", slot: "chapter", sequence: { previousGoalId: "G011", nextGoalId: "G013" }, prerequisites: [{ type: "node_completed", nodeId: "B04" }], conditions: [{ type: "node_completed", nodeId: "B05" }], rewards: [], cta: { type: "node", targetId: "B05" }, highlight: { type: "node", targetId: "B05" } },
    {
      id: "G011_COGNITION_TRACK",
      title: "Cognition \u0440\u0430\u0441\u0442\u0451\u0442",
      description: "Nervous Tissue, Nervous System, Neural Complexity \u0438 Proto-language \u0434\u0430\u044E\u0442 Cognition. \u041D\u0443\u0436\u043D\u043E 100, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0431\u0443\u0434\u0438\u0442\u044C \u0440\u0430\u0437\u0443\u043C.",
      chapterId: "CH03",
      slot: "progressive",
      prerequisites: [{ type: "node_completed", nodeId: "B04" }],
      conditions: [{ type: "cognition_at_least", value: 100, contributions: [{ nodeId: "B04", value: 20 }, { nodeId: "B05", value: 25 }, { nodeId: "N03", value: 30 }, { nodeId: "N05", value: 25 }] }],
      rewards: [],
      cta: { type: "node", targetId: "N07", label: "Cognition" },
      highlight: { type: "node", targetId: "N07" }
    },
    { id: "G013", title: "\u041F\u0440\u043E\u0431\u0443\u0434\u0438\u0442\u0435 \u0440\u0430\u0437\u0443\u043C", description: "\u0414\u043E\u0432\u0435\u0434\u0438\u0442\u0435 Cognition \u0434\u043E 100 \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 Sapience.", targetTimeMs: 24e5, nodeId: "N07", chapterId: "CH03", slot: "chapter", sequence: { previousGoalId: "G012" }, prerequisites: [{ type: "node_completed", nodeId: "B05" }], conditions: [{ type: "node_completed", nodeId: "N07" }], rewards: [], cta: { type: "node", targetId: "N03" }, highlight: { type: "node", targetId: "N03" } },
    { id: "G014", title: "\u041E\u0431\u0435\u0441\u043F\u0435\u0447\u044C\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0433\u0440\u0443\u043F\u043F\u0443", description: "\u041D\u0430\u0437\u043D\u0430\u0447\u044C\u0442\u0435 \u0440\u0430\u0431\u043E\u0442\u044B, \u043D\u0430\u043A\u043E\u043F\u0438\u0442\u0435 Food \u0438 \u043F\u043E\u0441\u0442\u0440\u043E\u0439\u0442\u0435 Hearth.", targetTimeMs: 27e5, chapterId: "CH04", slot: "chapter", sequence: { previousGoalId: "G013", nextGoalId: "G015" }, prerequisites: [{ type: "era_reached", eraId: "EARLY_CIV" }], conditions: [{ type: "resource_amount", resourceId: "food", amount: 100 }, { type: "building_count", buildingId: "BLD_HEARTH", count: 1 }], rewards: [], cta: { type: "building", targetId: "BLD_HEARTH" }, highlight: { type: "building", targetId: "BLD_HEARTH" } },
    { id: "G015", title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043F\u043B\u0435\u043C\u044F", description: "\u041F\u043E\u0441\u0442\u0440\u043E\u0439\u0442\u0435 Shelter, \u0434\u043E\u0432\u0435\u0434\u0438\u0442\u0435 Population \u0434\u043E 8 \u0438 \u0437\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u0435 Shared Survival.", targetTimeMs: 33e5, nodeId: "T05", chapterId: "CH04", slot: "chapter", sequence: { previousGoalId: "G014", nextGoalId: "G016" }, prerequisites: [{ type: "building_count", buildingId: "BLD_HEARTH", count: 1 }], conditions: [{ type: "node_completed", nodeId: "T05" }, { type: "building_count", buildingId: "BLD_SHELTER", count: 1 }, { type: "population_at_least", value: 8 }], rewards: [], cta: { type: "node", targetId: "T05", label: "\u0417\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u044C \u043F\u043B\u0435\u043C\u044F" }, highlight: { type: "node", targetId: "T05" } },
    {
      id: "G006_C04A_OPTIONAL",
      title: "Optional: \u0440\u0430\u0437\u043E\u0432\u0435\u0439\u0442\u0435 \u0444\u043E\u0442\u043E\u0441\u0438\u043D\u0442\u0435\u0437",
      description: "C04A Photosynthesis \u0434\u0430\u0451\u0442 \u043F\u0430\u0441\u0441\u0438\u0432\u043D\u044B\u0439 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A ATP, \u043D\u043E \u043D\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D \u0434\u043B\u044F \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0433\u043E \u043F\u0443\u0442\u0438.",
      targetTimeMs: 9e5,
      nodeId: "C04A",
      chapterId: "CH02",
      slot: "side",
      optional: true,
      prerequisites: [{ type: "node_completed", nodeId: "C01" }],
      conditions: [{ type: "node_completed", nodeId: "C04A" }],
      rewards: [],
      cta: { type: "node", targetId: "C04A", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Photosynthesis" },
      highlight: { type: "node", targetId: "C04A" },
      hintTimeoutMs: 15e4,
      hint: "\u042D\u0442\u043E optional-\u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F: \u0443\u0441\u0438\u043B\u0438\u0432\u0430\u0435\u0442 ATP, \u043D\u043E \u043D\u0435 \u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 Protein Synthesis."
    },
    {
      id: "G006_C04B_OPTIONAL",
      title: "Optional: \u0440\u0430\u0437\u043E\u0432\u0435\u0439\u0442\u0435 \u0445\u0435\u043C\u043E\u0441\u0438\u043D\u0442\u0435\u0437",
      description: "C04B Chemosynthesis \u0434\u0430\u0451\u0442 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A ATP, \u043D\u0435 \u0437\u0430\u0432\u0438\u0441\u044F\u0449\u0438\u0439 \u043E\u0442 \u0432\u043D\u0435\u0448\u043D\u0435\u0439 \u0441\u0440\u0435\u0434\u044B.",
      targetTimeMs: 9e5,
      nodeId: "C04B",
      chapterId: "CH02",
      slot: "side",
      optional: true,
      prerequisites: [{ type: "node_completed", nodeId: "C01" }],
      conditions: [{ type: "node_completed", nodeId: "C04B" }],
      rewards: [],
      cta: { type: "node", targetId: "C04B", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Chemosynthesis" },
      highlight: { type: "node", targetId: "C04B" },
      hintTimeoutMs: 15e4,
      hint: "\u042D\u0442\u043E optional-\u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F: \u0443\u0441\u0438\u043B\u0438\u0432\u0430\u0435\u0442 ATP, \u043D\u043E \u043D\u0435 \u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 Protein Synthesis."
    },
    {
      id: "G006_C04C_OPTIONAL",
      title: "Optional: \u0440\u0430\u0437\u043E\u0432\u0435\u0439\u0442\u0435 \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u0438\u0449\u0435\u0432\u0430\u0440\u0435\u043D\u0438\u0435",
      description: "C04C Efficient Digestion \u043F\u043E\u0432\u044B\u0448\u0430\u0435\u0442 \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u043A\u043E\u043D\u0432\u0435\u0440\u0441\u0438\u0438 Biomass.",
      targetTimeMs: 9e5,
      nodeId: "C04C",
      chapterId: "CH02",
      slot: "side",
      optional: true,
      prerequisites: [{ type: "node_completed", nodeId: "C01" }],
      conditions: [{ type: "node_completed", nodeId: "C04C" }],
      rewards: [],
      cta: { type: "node", targetId: "C04C", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C Efficient Digestion" },
      highlight: { type: "node", targetId: "C04C" },
      hintTimeoutMs: 15e4,
      hint: "\u042D\u0442\u043E optional-\u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F: \u0443\u0441\u0438\u043B\u0438\u0432\u0430\u0435\u0442 Biomass, \u043D\u043E \u043D\u0435 \u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 Protein Synthesis."
    },
    { id: "G016", title: "\u041E\u0441\u0432\u043E\u0439\u0442\u0435 \u0437\u0435\u043C\u043B\u0435\u0434\u0435\u043B\u0438\u0435", description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 Agriculture \u0438 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u043E\u0435 \u043F\u043E\u043B\u0435.", targetTimeMs: 408e4, nodeId: "T08", chapterId: "CH05", slot: "chapter", sequence: { previousGoalId: "G015", nextGoalId: "G017" }, prerequisites: [{ type: "node_completed", nodeId: "T07" }], conditions: [{ type: "node_completed", nodeId: "T08" }, { type: "building_count", buildingId: "BLD_FIELD", count: 1 }], rewards: [], cta: { type: "building", targetId: "BLD_FIELD", label: "\u041F\u043E\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u043F\u043E\u043B\u0435" }, highlight: { type: "building", targetId: "BLD_FIELD" } },
    { id: "G017", title: "\u041F\u043E\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E\u0435 \u043F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u0435", description: "\u041F\u043E\u043B\u044F, \u0434\u043E\u043C \u0438 \u043C\u0430\u0441\u0442\u0435\u0440\u0441\u043A\u0430\u044F \u0434\u043E\u043B\u0436\u043D\u044B \u043F\u0435\u0440\u0435\u0436\u0438\u0442\u044C \u0441\u0435\u0437\u043E\u043D.", targetTimeMs: 492e4, nodeId: "T09", chapterId: "CH05", slot: "chapter", sequence: { previousGoalId: "G016", nextGoalId: "G018" }, prerequisites: [{ type: "node_completed", nodeId: "T08" }], conditions: [{ type: "node_completed", nodeId: "T09" }, { type: "building_count", buildingId: "BLD_FIELD", count: 1 }, { type: "building_count", buildingId: "BLD_HOUSE", count: 1 }, { type: "building_count", buildingId: "BLD_WORKSHOP", count: 1 }, { type: "population_at_least", value: 14 }], rewards: [], cta: { type: "node", targetId: "T09", label: "\u041E\u0441\u043D\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u0435" }, highlight: { type: "node", targetId: "T09" } },
    { id: "G018", title: "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043F\u0438\u0441\u044C\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u044C", description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 Writing \u0438 \u0437\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u0435 \u0437\u043D\u0430\u043D\u0438\u0435 \u0432 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E\u043C \u0432\u0438\u0434\u0435.", targetTimeMs: 558e4, nodeId: "T10", chapterId: "CH06", slot: "chapter", sequence: { previousGoalId: "G017", nextGoalId: "G019" }, prerequisites: [{ type: "node_completed", nodeId: "T09" }], conditions: [{ type: "node_completed", nodeId: "T10" }], rewards: [], cta: { type: "node", targetId: "T10", label: "\u0420\u0430\u0437\u0432\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u044C" }, highlight: { type: "node", targetId: "T10" } },
    { id: "G019", title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0433\u043E\u0440\u043E\u0434", description: "\u041E\u0431\u044A\u0435\u0434\u0438\u043D\u0438\u0442\u0435 \u043F\u0438\u0441\u044C\u043C\u043E, \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0442\u0440\u0443\u0434, \u0448\u043A\u043E\u043B\u0443 \u0438 \u0440\u044B\u043D\u043E\u043A.", targetTimeMs: 654e4, nodeId: "T12", chapterId: "CH06", slot: "chapter", sequence: { previousGoalId: "G018", nextGoalId: "G020" }, prerequisites: [{ type: "node_completed", nodeId: "T10" }], conditions: [{ type: "node_completed", nodeId: "T12" }, { type: "building_count", buildingId: "BLD_SCHOOL", count: 1 }, { type: "building_count", buildingId: "BLD_MARKET", count: 1 }, { type: "population_at_least", value: 28 }], rewards: [], cta: { type: "node", targetId: "T12", label: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u043E\u0440\u043E\u0434" }, highlight: { type: "node", targetId: "T12" } },
    { id: "G020", title: "\u041C\u0435\u0445\u0430\u043D\u0438\u0437\u0438\u0440\u0443\u0439\u0442\u0435 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E", description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 Mechanization \u0438 \u043D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0444\u0430\u0431\u0440\u0438\u0447\u043D\u0443\u044E \u0438\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443.", targetTimeMs: 69e5, nodeId: "T13", chapterId: "CH07", slot: "chapter", sequence: { previousGoalId: "G019", nextGoalId: "G021" }, prerequisites: [{ type: "node_completed", nodeId: "T12" }], conditions: [{ type: "node_completed", nodeId: "T13" }, { type: "building_count", buildingId: "BLD_FACTORY", count: 1 }], rewards: [], cta: { type: "building", targetId: "BLD_FACTORY", label: "\u041F\u043E\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0444\u0430\u0431\u0440\u0438\u043A\u0443" }, highlight: { type: "building", targetId: "BLD_FACTORY" } },
    { id: "G021", title: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 \u044D\u043F\u043E\u0445\u0443 \u043C\u0430\u0448\u0438\u043D", description: "\u042D\u043B\u0435\u043A\u0442\u0440\u0438\u0444\u0438\u0446\u0438\u0440\u0443\u0439\u0442\u0435 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E Power-\u0438\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443.", targetTimeMs: 744e4, nodeId: "T15", chapterId: "CH07", slot: "chapter", sequence: { previousGoalId: "G020", nextGoalId: "G022" }, prerequisites: [{ type: "node_completed", nodeId: "T13" }], conditions: [{ type: "node_completed", nodeId: "T15" }, { type: "building_count", buildingId: "BLD_STEAM_PLANT", count: 1 }], rewards: [], cta: { type: "node", targetId: "T15", label: "\u042D\u043B\u0435\u043A\u0442\u0440\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E" }, highlight: { type: "node", targetId: "T15" } },
    { id: "G022", title: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u0443\u044E \u0446\u0438\u0432\u0438\u043B\u0438\u0437\u0430\u0446\u0438\u044E", description: "\u0421\u0432\u044F\u0436\u0438\u0442\u0435 grid, \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0438\u043D\u0441\u0442\u0438\u0442\u0443\u0442\u044B \u0438 \u043B\u043E\u0433\u0438\u0441\u0442\u0438\u043A\u0443 \u0432 \u043E\u0434\u043D\u0443 \u0441\u0438\u0441\u0442\u0435\u043C\u0443.", targetTimeMs: 81e5, nodeId: "T18", chapterId: "CH07", slot: "chapter", sequence: { previousGoalId: "G021", nextGoalId: "G023" }, prerequisites: [{ type: "node_completed", nodeId: "T15" }], conditions: [{ type: "node_completed", nodeId: "T18" }, { type: "building_count", buildingId: "BLD_GRID", count: 1 }, { type: "building_count", buildingId: "BLD_LABORATORY", count: 1 }, { type: "building_count", buildingId: "BLD_RAIL_HUB", count: 1 }], rewards: [], cta: { type: "node", targetId: "T18", label: "\u0421\u043E\u0435\u0434\u0438\u043D\u0438\u0442\u044C \u043C\u0438\u0440" }, highlight: { type: "node", targetId: "T18" } },
    { id: "G023", title: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 \u0430\u0442\u043E\u043C\u043D\u044B\u0439 \u0432\u0435\u043A", description: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u043D\u0430\u0443\u0447\u043D\u0443\u044E \u0446\u0435\u043F\u043E\u0447\u043A\u0443 \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 Reactor/Lab Program.", targetTimeMs: 1008e4, nodeId: "A04", chapterId: "CH08", slot: "chapter", sequence: { previousGoalId: "G022", nextGoalId: "G024" }, prerequisites: [{ type: "node_completed", nodeId: "T18" }], conditions: [{ type: "node_completed", nodeId: "A04" }, { type: "building_count", buildingId: "BLD_REACTOR_LAB", count: 1 }], rewards: [], cta: { type: "node", targetId: "A04", label: "\u0412\u043E\u0439\u0442\u0438 \u0432 \u0430\u0442\u043E\u043C\u043D\u044B\u0439 \u0432\u0435\u043A" }, highlight: { type: "node", targetId: "A04" } },
    { id: "G024", title: "\u041F\u0440\u043E\u0439\u0434\u0438\u0442\u0435 \u0412\u0435\u043B\u0438\u043A\u0438\u0439 \u0444\u0438\u043B\u044C\u0442\u0440", description: "\u041F\u0440\u043E\u0439\u0434\u0438\u0442\u0435 \u043A\u0440\u0438\u0437\u0438\u0441, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 Last Protocol \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u043C\u0438\u0440\u0430.", targetTimeMs: 108e5, chapterId: "CH08", slot: "chapter", sequence: { previousGoalId: "G023" }, prerequisites: [{ type: "era_reached", eraId: "ATOMIC" }], conditions: [{ type: "flag_set", flag: "run.ending.id", value: "ENDING_ASH" }], rewards: [], cta: { type: "event", targetId: "EV-CR-01", label: "\u0421\u043B\u0435\u0434\u0438\u0442\u044C \u0437\u0430 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435\u043C \u043C\u0438\u0440\u0430" }, highlight: { type: "event", targetId: "EV-CR-01" }, hintTimeoutMs: 12e4, hint: "\u041D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u043C\u0438\u0440\u0430 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0432 \u043F\u0435\u0440\u0432\u043E\u043C Timeline. \u0420\u0435\u0448\u0435\u043D\u0438\u044F \u043C\u0435\u043D\u044F\u044E\u0442 \u043F\u0430\u043C\u044F\u0442\u044C \u043E\u0431 \u0438\u0441\u0445\u043E\u0434\u0435, \u043D\u043E \u043D\u0435 \u0441\u0430\u043C \u043F\u0435\u0440\u0432\u044B\u0439 Ash." }
  ];

  // src/chronicles/config/manualProcesses.js
  var DEV_TUNING = Object.freeze({
    manualPrimordialPulseCooldownMs: 2e3,
    manualPrimordialPulseStableRnaCooldownMs: 3500,
    manualPrimordialPulseSelfReplicationCooldownMs: 9e4,
    manualDnaSynthesisCooldownMs: 45e3
  });
  var manualProcesses = [
    {
      id: "MANUAL_PRIMORDIAL_PULSE",
      label: "Primordial reaction",
      description: "Onboarding process that starts the first RNA chemistry before passive replication takes over.",
      availableFromStart: true,
      cooldownMs: DEV_TUNING.manualPrimordialPulseCooldownMs,
      cooldownStages: [
        {
          afterNodeId: "M01",
          cooldownMs: DEV_TUNING.manualPrimordialPulseStableRnaCooldownMs
        },
        {
          afterNodeId: "M02",
          cooldownMs: DEV_TUNING.manualPrimordialPulseSelfReplicationCooldownMs
        }
      ],
      provisional: true,
      reward: {
        type: "manual_gain",
        resourceId: "rna",
        baseAmount: 1,
        productionSeconds: 1.5,
        rewardMultiplier: 1
      },
      usesManualGainModifiers: true
    },
    {
      id: "MANUAL_DNA_SYNTHESIS",
      label: "Manual DNA Synthesis",
      description: "Convert spare RNA into short DNA strands after synthesis chemistry is understood.",
      availableAfterNodeId: "M03",
      cooldownMs: DEV_TUNING.manualDnaSynthesisCooldownMs,
      provisional: true,
      reward: {
        type: "convert_resource",
        inputCost: { rna: 18 },
        resourceId: "dna",
        baseAmount: 3,
        productionSeconds: 0,
        rewardMultiplier: 1
      },
      usesManualGainModifiers: false
    }
  ];

  // src/chronicles/config/events.js
  var events = [
    {
      id: "EV-RNA-01",
      type: "milestone",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G001" },
      phaseWindow: { eraIds: ["MOLECULAR"] },
      priority: 60,
      telemetryKey: "event_rna_stable",
      title: "\u0420\u041D\u041A \u0441\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0430",
      body: "\u0421\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430 \u0443\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u043E\u043B\u0433\u043E, \u0447\u0442\u043E\u0431\u044B \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u0438 \u0438\u043C\u0435\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435.",
      chronicleSummary: "\u0412 \u043F\u0435\u0440\u0432\u0438\u0447\u043D\u043E\u043C \u043E\u043A\u0435\u0430\u043D\u0435 \u043F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u0430\u044F \u0420\u041D\u041A.",
      choices: [{ id: "continue", label: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C", effects: [] }]
    },
    {
      id: "EV-RNA-RESONANCE",
      type: "flavor",
      deck: "early_biology",
      trigger: { type: "deck", deck: "early_biology" },
      phaseWindow: { eraIds: ["MOLECULAR"], minActiveMs: 6e4, maxActiveMs: 42e4 },
      preconditions: [{ type: "node_completed", nodeId: "M01" }],
      weight: 3,
      cooldownMs: 0,
      priority: 10,
      telemetryKey: "event_rna_resonance",
      title: "\u0423\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u044B\u0439 \u0446\u0438\u043A\u043B",
      body: "\u041D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0443\u0434\u0430\u0447\u043D\u044B\u0445 \u0440\u0435\u0430\u043A\u0446\u0438\u0439 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0442\u0441\u044F \u0447\u0430\u0449\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445.",
      chronicleSummary: "\u0420\u0430\u043D\u043D\u0438\u0435 \u0440\u0435\u0430\u043A\u0446\u0438\u0438 \u0434\u0430\u043B\u0438 \u043D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u044B\u0439 \u0438\u0437\u0431\u044B\u0442\u043E\u043A \u0420\u041D\u041A.",
      choices: [
        { id: "stabilize", label: "\u0417\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u044C \u0446\u0438\u043A\u043B", effects: [{ type: "grant_resource", resourceId: "rna", amount: 12 }] },
        { id: "observe", label: "\u041D\u0430\u0431\u043B\u044E\u0434\u0430\u0442\u044C", effects: [{ type: "set_flag", flag: "run.bio.rna_cycle_observed", value: true }] }
      ]
    },
    {
      id: "EV-DNA-01",
      type: "narrative",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G003" },
      phaseWindow: { eraIds: ["MOLECULAR"] },
      priority: 55,
      telemetryKey: "event_dna_revealed",
      title: "\u041D\u043E\u0441\u0438\u0442\u0435\u043B\u044C \u043D\u0430\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438",
      body: "\u041E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D \u0431\u043E\u043B\u0435\u0435 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u044B\u0439 \u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C \u043D\u0430\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u0438.",
      chronicleSummary: "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0438 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u0435\u0440\u0435\u0436\u0438\u0432\u0430\u0442\u044C \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u044F.",
      choices: [{ id: "continue", label: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C", effects: [] }]
    },
    {
      id: "EV-DNA-TRACE",
      type: "flavor",
      deck: "early_biology",
      trigger: { type: "deck", deck: "early_biology" },
      phaseWindow: { eraIds: ["MOLECULAR"], minActiveMs: 24e4, maxActiveMs: 6e5 },
      preconditions: [{ type: "node_completed", nodeId: "M03" }],
      weight: 2,
      cooldownMs: 0,
      priority: 10,
      telemetryKey: "event_dna_trace",
      title: "\u0422\u043E\u0447\u043D\u0430\u044F \u043A\u043E\u043F\u0438\u044F",
      body: "\u041E\u0434\u043D\u0430 \u0438\u0437 \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0435\u0439 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u043F\u043E\u0447\u0442\u0438 \u0431\u0435\u0437 \u0438\u0441\u043A\u0430\u0436\u0435\u043D\u0438\u0439.",
      chronicleSummary: "\u0423\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0435 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0414\u041D\u041A \u0434\u0430\u043B\u043E \u043D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0437\u0430\u043F\u0430\u0441 \u043D\u0430\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u0430.",
      choices: [{ id: "retain", label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C", effects: [{ type: "grant_resource", resourceId: "dna", amount: 5 }] }]
    },
    {
      id: "EV-CELL-01",
      type: "milestone",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G005" },
      phaseWindow: { eraIds: ["CELLULAR"] },
      priority: 70,
      telemetryKey: "event_cell_reached",
      title: "\u0416\u0418\u0417\u041D\u042C",
      body: "\u0422\u0435\u043F\u0435\u0440\u044C \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B.",
      chronicleSummary: "\u041C\u0438\u0440 \u043F\u0435\u0440\u0435\u0441\u0442\u0430\u043B \u0431\u044B\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0445\u0438\u043C\u0438\u0435\u0439: \u043F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C \u043F\u0435\u0440\u0432\u0430\u044F \u043A\u043B\u0435\u0442\u043A\u0430.",
      choices: [{ id: "continue", label: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C", effects: [{ type: "set_flag", flag: "milestone.cell_event_seen", value: true }] }]
    },
    {
      id: "EV-BIO-01",
      type: "branch",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "C01" },
      phaseWindow: { eraIds: ["CELLULAR"] },
      priority: 80,
      blocks: { branchGroup: "cell_identity_1" },
      telemetryKey: "event_primary_trait",
      title: "\u041F\u0435\u0440\u0432\u044B\u0439 \u043F\u0443\u0442\u044C",
      body: "\u0421\u0440\u0435\u0434\u0430 \u043D\u0435 \u043F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0433\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044F. \u0422\u043E\u043B\u044C\u043A\u043E \u0440\u0430\u0437\u043D\u044B\u0435 \u0441\u043F\u043E\u0441\u043E\u0431\u044B \u0432\u044B\u0436\u0438\u0442\u044C.",
      chronicleSummary: "\u041F\u0435\u0440\u0432\u0438\u0447\u043D\u044B\u0439 \u044D\u0432\u043E\u043B\u044E\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043F\u0443\u0442\u044C \u0432\u0438\u0434\u0430 \u0431\u044B\u043B \u0437\u0430\u043A\u0440\u0435\u043F\u043B\u0451\u043D.",
      choices: [
        { id: "absorption", label: "\u041F\u043E\u0433\u043B\u043E\u0449\u0435\u043D\u0438\u0435", purchaseNodeId: "C02A" },
        { id: "symbiosis", label: "\u0421\u0438\u043C\u0431\u0438\u043E\u0437", purchaseNodeId: "C02B" },
        { id: "shell", label: "\u041F\u0430\u043D\u0446\u0438\u0440\u044C", purchaseNodeId: "C02C" }
      ]
    },
    {
      id: "EV-BIO-02",
      type: "branch",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "C06" },
      phaseWindow: { eraIds: ["CELLULAR"] },
      priority: 75,
      blocks: { branchGroup: "body_adaptation_1" },
      telemetryKey: "event_body_adaptation",
      title: "\u0410\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u0438 \u0442\u0435\u043B\u0430",
      body: "\u041D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043D\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B \u0434\u043B\u044F \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0448\u0430\u0433\u0430. \u041E\u043D\u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0442, \u043A\u0430\u043A\u0438\u043C \u0441\u0442\u0430\u043D\u0435\u0442 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043C.",
      chronicleSummary: "\u0410\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0432\u0438\u0434\u0430.",
      choices: [
        { id: "mobility", label: "\u041F\u043E\u0434\u0432\u0438\u0436\u043D\u043E\u0441\u0442\u044C", purchaseNodeId: "B02A" },
        { id: "sensory", label: "\u0427\u0443\u0432\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043A\u043B\u0435\u0442\u043A\u0438", purchaseNodeId: "B02B" },
        { id: "digestion", label: "\u041F\u0438\u0449\u0435\u0432\u0430\u0440\u0435\u043D\u0438\u0435", purchaseNodeId: "B02C" },
        { id: "structural", label: "\u041E\u043F\u043E\u0440\u043D\u044B\u0435 \u0442\u043A\u0430\u043D\u0438", purchaseNodeId: "B02D" }
      ]
    },
    {
      id: "EV-BIO-04",
      type: "milestone",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "B04" },
      phaseWindow: { eraIds: ["MULTICELLULAR"] },
      priority: 60,
      telemetryKey: "event_cognition_begins",
      title: "\u041F\u0440\u043E\u0431\u043B\u0435\u0441\u043A \u0440\u0430\u0437\u0443\u043C\u0430",
      body: "\u041D\u0435\u0440\u0432\u043D\u0430\u044F \u0442\u043A\u0430\u043D\u044C \u0432\u043F\u0435\u0440\u0432\u044B\u0435 \u0441\u0432\u044F\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u0440\u043E\u0448\u043B\u043E\u0435 \u0441 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u043C: \u0442\u043E, \u0447\u0442\u043E \u0443\u0436\u0435 \u0441\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C, \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442 \u043C\u0435\u043D\u044F\u0442\u044C \u0442\u043E, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0441\u0435\u0439\u0447\u0430\u0441.",
      chronicleSummary: "\u0412\u0438\u0434 \u043D\u0430\u0447\u0430\u043B \u043D\u0430\u043A\u0430\u043F\u043B\u0438\u0432\u0430\u0442\u044C \u043A\u043E\u0433\u043D\u0438\u0442\u0438\u0432\u043D\u0443\u044E \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C.",
      choices: [{ id: "continue", label: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C", effects: [] }]
    },
    {
      id: "EV-BIO-03",
      type: "branch",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "B05" },
      phaseWindow: { eraIds: ["MULTICELLULAR"] },
      priority: 80,
      blocks: { branchGroup: "behavior_1" },
      telemetryKey: "event_behavior_strategy",
      title: "\u041F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435",
      body: "\u041D\u0435\u0440\u0432\u043D\u0430\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u043C\u0435\u043D\u044F\u0435\u0442 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0440\u0435\u0430\u043A\u0446\u0438\u044E. \u041E\u043D\u0430 \u043C\u0435\u043D\u044F\u0435\u0442 \u0442\u043E, \u043A\u0430\u043A \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043C \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442 \u0434\u0440\u0443\u0433\u043E\u0439 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043C.",
      chronicleSummary: "\u041F\u043E\u0432\u0435\u0434\u0435\u043D\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F \u0432\u0438\u0434\u0430 \u0431\u044B\u043B\u0430 \u0437\u0430\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u0430.",
      choices: [
        { id: "solitary", label: "\u041E\u0434\u0438\u043D\u043E\u0447\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F", purchaseNodeId: "N02A" },
        { id: "social", label: "\u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435", purchaseNodeId: "N02B" },
        { id: "manipulation", label: "\u041C\u0430\u043D\u0438\u043F\u0443\u043B\u044F\u0446\u0438\u044F \u043E\u0431\u044A\u0435\u043A\u0442\u0430\u043C\u0438", purchaseNodeId: "N02C" }
      ]
    },
    {
      id: "EV-FLAVOR-01",
      type: "flavor",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "B05" },
      phaseWindow: { eraIds: ["MULTICELLULAR"] },
      priority: 20,
      telemetryKey: "event_cognition_danger",
      title: "\u041E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C",
      body: "\u041D\u0435\u0440\u0432\u043D\u0430\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u0432\u043F\u0435\u0440\u0432\u044B\u0435 \u0443\u0441\u043F\u0435\u0432\u0430\u0435\u0442 \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0440\u0435\u0430\u043A\u0446\u0438\u044E \u0434\u043E \u0443\u0434\u0430\u0440\u0430 \u0441\u0440\u0435\u0434\u044B.",
      chronicleSummary: "\u0412\u0438\u0434 \u0443\u0447\u0438\u043B\u0441\u044F \u043E\u0442\u043B\u0438\u0447\u0430\u0442\u044C \u0443\u0433\u0440\u043E\u0437\u0443 \u043E\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438.",
      choices: [
        { id: "flee", label: "\u041E\u0442\u0441\u0442\u0443\u043F\u0438\u0442\u044C", effects: [{ type: "grant_cognition", amount: 2 }, { type: "set_flag", flag: "run.bio.danger_response", value: "flee" }] },
        { id: "confront", label: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0443\u0433\u0440\u043E\u0437\u0443", effects: [{ type: "grant_cognition", amount: 3 }, { type: "set_flag", flag: "run.bio.danger_response", value: "confront" }] }
      ]
    },
    {
      id: "EV-FLAVOR-02",
      type: "flavor",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "N03" },
      phaseWindow: { eraIds: ["MULTICELLULAR"] },
      priority: 20,
      telemetryKey: "event_cognition_other",
      title: "\u0414\u0440\u0443\u0433\u043E\u0439",
      body: "\u0414\u0440\u0443\u0433\u043E\u0439 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435\u043C \u043D\u0430 \u043F\u0435\u0440\u0438\u0444\u0435\u0440\u0438\u0438 \u0447\u0443\u0432\u0441\u0442\u0432.",
      chronicleSummary: "\u0412\u0438\u0434 \u0432\u044B\u0431\u0440\u0430\u043B \u043F\u0435\u0440\u0432\u0443\u044E \u0440\u0435\u0430\u043A\u0446\u0438\u044E \u043D\u0430 \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u0440\u0430\u0437\u0443\u043C\u043D\u043E\u0433\u043E \u043D\u0430\u0431\u043B\u044E\u0434\u0430\u0442\u0435\u043B\u044F.",
      choices: [
        { id: "cooperate", label: "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u0447\u0430\u0442\u044C", effects: [{ type: "grant_cognition", amount: 3 }, { type: "set_flag", flag: "run.bio.other_response", value: "cooperate" }] },
        { id: "conflict", label: "\u0421\u043E\u043F\u0435\u0440\u043D\u0438\u0447\u0430\u0442\u044C", effects: [{ type: "grant_cognition", amount: 2 }, { type: "set_flag", flag: "run.bio.other_response", value: "conflict" }] }
      ]
    },
    {
      id: "EV-CIV-01",
      type: "narrative",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "N07" },
      phaseWindow: { eraIds: ["EARLY_CIV"] },
      priority: 55,
      telemetryKey: "event_civilization_awake",
      title: "\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",
      body: "\u0422\u0435\u043F\u0435\u0440\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0430\u0442 \u043D\u0435 \u043E\u0434\u043D\u043E\u043C\u0443 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u043C\u0443, \u0430 \u0442\u0435\u043C, \u043A\u0442\u043E \u0441\u043C\u043E\u0436\u0435\u0442 \u0438\u0445 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u044C.",
      chronicleSummary: "\u041F\u0435\u0440\u0432\u044B\u0435 \u0440\u0430\u0437\u0443\u043C\u043D\u044B\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043D\u0430\u0447\u0430\u043B\u0438 \u0432\u044B\u0436\u0438\u0432\u0430\u0442\u044C \u043A\u0430\u043A \u0433\u0440\u0443\u043F\u043F\u0430.",
      choices: [
        { id: "share", label: "\u0414\u0435\u043B\u0438\u0442\u044C \u0434\u043E\u0431\u044B\u0447\u0443", effects: [{ type: "set_flag", flag: "run.civ.distribution", value: "shared" }] },
        { id: "merit", label: "\u041D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0442\u044C \u043B\u0443\u0447\u0448\u0438\u0445", effects: [{ type: "set_flag", flag: "run.civ.distribution", value: "merit" }] }
      ]
    },
    {
      id: "EV-CIV-02",
      type: "milestone",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G015" },
      phaseWindow: { eraIds: ["TRIBE"] },
      priority: 60,
      telemetryKey: "event_tribe_established",
      title: "\u041F\u041B\u0415\u041C\u042F",
      body: "\u0413\u0440\u0443\u043F\u043F\u0430 \u0441\u0442\u0430\u043B\u0430 \u0447\u0435\u043C-\u0442\u043E \u0431\u043E\u043B\u044C\u0448\u0438\u043C, \u0447\u0435\u043C \u0441\u0443\u043C\u043C\u0430 \u0435\u0451 \u0447\u043B\u0435\u043D\u043E\u0432.",
      chronicleSummary: "\u0412\u0438\u0434 \u0437\u0430\u043A\u0440\u0435\u043F\u0438\u043B\u0441\u044F \u043A\u0430\u043A \u043F\u043B\u0435\u043C\u044F.",
      choices: [{ id: "continue", label: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C", effects: [] }]
    },
    {
      id: "EV-CIV-03",
      type: "flavor",
      deck: "authored",
      trigger: { type: "node_completed", nodeId: "T08" },
      phaseWindow: { eraIds: ["SETTLEMENT_EARLY"] },
      priority: 35,
      telemetryKey: "event_settlement_profile",
      title: "\u041F\u0435\u0440\u0432\u043E\u0435 \u043F\u043E\u043B\u0435",
      body: "\u0417\u0435\u043C\u043B\u044F \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442 \u043E\u0442\u0432\u0435\u0447\u0430\u0442\u044C \u043D\u0430 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0439\u0441\u044F \u0442\u0440\u0443\u0434.",
      chronicleSummary: "\u041F\u043B\u0435\u043C\u044F \u0432\u044B\u0431\u0440\u0430\u043B\u043E \u043F\u0443\u0442\u044C \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E\u0433\u043E \u0442\u0440\u0443\u0434\u0430 \u043D\u0430 \u0437\u0435\u043C\u043B\u0435.",
      choices: [
        { id: "irrigation", label: "\u0412\u0435\u0441\u0442\u0438 \u0432\u043E\u0434\u0443", effects: [{ type: "set_flag", flag: "run.civ.settlement_profile", value: "irrigation" }] },
        { id: "masonry", label: "\u0423\u043A\u0440\u0435\u043F\u0438\u0442\u044C \u0431\u0435\u0440\u0435\u0433", effects: [{ type: "set_flag", flag: "run.civ.settlement_profile", value: "masonry" }] },
        { id: "exchange", label: "\u041D\u0430\u043B\u0430\u0434\u0438\u0442\u044C \u043E\u0431\u043C\u0435\u043D", effects: [{ type: "set_flag", flag: "run.civ.settlement_profile", value: "exchange" }] }
      ]
    },
    {
      id: "EV-NAR-01",
      type: "anomaly",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G017" },
      phaseWindow: { eraIds: ["SETTLEMENT"] },
      priority: 45,
      telemetryKey: "event_traces_before_us",
      title: "\u0421\u043B\u0435\u0434\u044B \u0434\u043E \u043D\u0430\u0441",
      body: "\u041F\u043E\u0434 \u043D\u043E\u0432\u044B\u043C \u0444\u0443\u043D\u0434\u0430\u043C\u0435\u043D\u0442\u043E\u043C \u043B\u0435\u0436\u0430\u0442 \u0444\u0440\u0430\u0433\u043C\u0435\u043D\u0442\u044B, \u043D\u0435 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0430\u0449\u0438\u0435 \u043D\u0438 \u043E\u0434\u043D\u043E\u043C\u0443 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u043C\u0443 \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u044E.",
      chronicleSummary: "\u041F\u043E\u0441\u0435\u043B\u0435\u043D\u0438\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0438\u043B\u043E \u0441\u043B\u0435\u0434\u044B \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0439 \u043F\u0440\u0435\u0436\u043D\u0435\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0438.",
      choices: [
        { id: "study", label: "\u0418\u0437\u0443\u0447\u0438\u0442\u044C", effects: [{ type: "grant_resource", resourceId: "knowledge", amount: 35 }, { type: "set_flag", flag: "run.anomaly.first_trace", value: "studied" }] },
        { id: "dismantle", label: "\u0420\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C", effects: [{ type: "grant_resource", resourceId: "materials", amount: 45 }, { type: "set_flag", flag: "run.anomaly.first_trace", value: "dismantled" }] },
        { id: "preserve", label: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C", effects: [{ type: "set_flag", flag: "run.anomaly.first_trace", value: "preserved" }] }
      ]
    },
    {
      id: "EV-CIV-04",
      type: "narrative",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G019" },
      phaseWindow: { eraIds: ["CITY"] },
      priority: 50,
      telemetryKey: "event_governance",
      title: "\u041A\u0442\u043E \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u044F?",
      body: "\u0413\u043E\u0440\u043E\u0434 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043F\u0435\u0440\u0435\u0436\u0438\u0432\u0443\u0442 \u0433\u043E\u043B\u043E\u0441 \u043E\u0434\u043D\u043E\u0433\u043E \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430.",
      chronicleSummary: "\u0413\u043E\u0440\u043E\u0434 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u043B \u0441\u0432\u043E\u0439 \u043F\u0435\u0440\u0432\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u044F.",
      choices: [
        { id: "council", label: "\u0421\u043E\u0432\u0435\u0442", effects: [{ type: "set_flag", flag: "run.civ.governance", value: "council" }] },
        { id: "leader", label: "\u041B\u0438\u0434\u0435\u0440", effects: [{ type: "set_flag", flag: "run.civ.governance", value: "leader" }] },
        { id: "merchants", label: "\u0422\u043E\u0440\u0433\u043E\u0432\u0446\u044B", effects: [{ type: "set_flag", flag: "run.civ.governance", value: "merchants" }] }
      ]
    },
    {
      id: "EV-CIV-06",
      type: "crisis",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G021" },
      phaseWindow: { eraIds: ["INDUSTRY"] },
      priority: 70,
      telemetryKey: "event_energy_path",
      title: "\u042D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0432\u044B\u0431\u043E\u0440",
      body: "\u041D\u043E\u0432\u0430\u044F \u0438\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0431\u043E\u043B\u044C\u0448\u0435 \u044D\u043D\u0435\u0440\u0433\u0438\u0438, \u0447\u0435\u043C \u043F\u0440\u0435\u0436\u043D\u0438\u0439 \u043C\u0438\u0440 \u0443\u043C\u0435\u0435\u0442 \u0434\u0430\u0432\u0430\u0442\u044C \u0431\u0435\u0437 \u043F\u043E\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u0439.",
      chronicleSummary: "\u0418\u043D\u0434\u0443\u0441\u0442\u0440\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0446\u0438\u0432\u0438\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0432\u044B\u0431\u0440\u0430\u043B\u0430 \u0441\u0432\u043E\u0439 \u044D\u043D\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C.",
      choices: [
        { id: "fossil", label: "\u0424\u043E\u0440\u0441\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438\u043D\u0434\u0443\u0441\u0442\u0440\u0438\u044E", effects: [{ type: "set_flag", flag: "run.energy.path", value: "fossil" }] },
        { id: "clean", label: "\u041D\u0430\u0447\u0430\u0442\u044C \u0447\u0438\u0441\u0442\u0443\u044E \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0443", effects: [{ type: "set_flag", flag: "run.energy.path", value: "clean" }] },
        { id: "atomic", label: "\u0423\u0441\u043A\u043E\u0440\u0438\u0442\u044C \u0430\u0442\u043E\u043C\u043D\u044B\u0435 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F", effects: [{ type: "set_flag", flag: "run.energy.path", value: "early_atomic" }] }
      ]
    },
    {
      id: "EV-NAR-02",
      type: "anomaly",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G022" },
      phaseWindow: { eraIds: ["MODERN"] },
      priority: 65,
      telemetryKey: "event_error17",
      title: "ERROR 17",
      body: "\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u0446\u0438\u043A\u043B\u0430: \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.\n\nERROR 17",
      chronicleSummary: "\u0413\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u043B\u0430 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u043D\u043E\u0437 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u0446\u0438\u043A\u043B\u0430.",
      choices: [{ id: "record", label: "\u0417\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u0442\u044C", effects: [{ type: "set_flag", flag: "run.anomaly.error17_active", value: true }, { type: "set_meta_flag", flag: "meta.anomaly.error17_seen", value: true }] }]
    },
    {
      id: "EV-NAR-03",
      type: "anomaly",
      deck: "authored",
      trigger: { type: "goal_completed", goalId: "G023" },
      phaseWindow: { eraIds: ["ATOMIC"] },
      priority: 85,
      telemetryKey: "event_again",
      title: "\u0421\u043D\u043E\u0432\u0430.",
      body: "\u0421\u043E\u0431\u044B\u0442\u0438\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043E.",
      chronicleSummary: "\u0410\u0440\u0445\u0438\u0432 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043B \u0430\u0442\u043E\u043C\u043D\u044B\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u0434\u0432\u0430\u0436\u0434\u044B.",
      choices: [{ id: "continue", label: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C", effects: [{ type: "set_flag", flag: "run.anomaly.again_seen", value: true }, { type: "set_meta_flag", flag: "meta.archive.heard_again", value: true }] }]
    },
    {
      id: "EV-CR-01",
      type: "crisis",
      deck: "crisis",
      trigger: { type: "crisis_phase", phase: "C1" },
      phaseWindow: { eraIds: ["ATOMIC"] },
      priority: 95,
      telemetryKey: "event_bloc_conflict",
      title: "\u041A\u043E\u043D\u0444\u043B\u0438\u043A\u0442 \u0431\u043B\u043E\u043A\u043E\u0432",
      body: "\u0414\u0432\u0435 \u043A\u043E\u0430\u043B\u0438\u0446\u0438\u0438 \u0442\u0440\u0435\u0431\u0443\u044E\u0442 \u043D\u0435\u0441\u043E\u0432\u043C\u0435\u0441\u0442\u0438\u043C\u044B\u0445 \u0443\u0441\u043B\u043E\u0432\u0438\u0439 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438. \u0412\u043E\u0435\u043D\u043D\u044B\u0435 \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u043F\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043D\u044B \u0432 \u043F\u043E\u0432\u044B\u0448\u0435\u043D\u043D\u0443\u044E \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C.",
      chronicleSummary: "\u041C\u0438\u0440 \u043E\u0442\u0432\u0435\u0442\u0438\u043B \u043D\u0430 \u043F\u0435\u0440\u0432\u044B\u0439 \u043A\u0440\u0438\u0437\u0438\u0441\u043D\u044B\u0439 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442.",
      choices: [
        { id: "deescalate", label: "\u0414\u0435\u044D\u0441\u043A\u0430\u043B\u0430\u0446\u0438\u044F", effects: [{ type: "set_flag", flag: "run.crisis.bloc_choice", value: "deescalate" }, { type: "adjust_crisis_stability", amount: 9 }] },
        { id: "sanctions", label: "\u0421\u0430\u043D\u043A\u0446\u0438\u0438", effects: [{ type: "set_flag", flag: "run.crisis.bloc_choice", value: "sanctions" }, { type: "adjust_crisis_stability", amount: 2 }] },
        { id: "force", label: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0441\u0438\u043B\u044B", effects: [{ type: "set_flag", flag: "run.crisis.bloc_choice", value: "force" }, { type: "adjust_crisis_stability", amount: -7 }] }
      ]
    },
    {
      id: "EV-CR-02",
      type: "crisis",
      deck: "crisis",
      trigger: { type: "crisis_phase", phase: "C2" },
      phaseWindow: { eraIds: ["ATOMIC"] },
      priority: 96,
      telemetryKey: "event_false_warning",
      title: "\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",
      body: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0440\u0430\u043D\u043D\u0435\u0433\u043E \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442 \u0430\u0442\u0430\u043A\u0443. \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0438\u0437 \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u044B\u0445 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442.",
      chronicleSummary: "\u041C\u0438\u0440 \u0432\u044B\u0431\u0440\u0430\u043B, \u043A\u0430\u043A \u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u043D\u0430 \u043D\u0435\u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435.",
      choices: [
        { id: "trust_automation", label: "\u0414\u043E\u0432\u0435\u0440\u0438\u0442\u044C\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u043A\u0435", effects: [{ type: "set_flag", flag: "run.crisis.warning_choice", value: "trust_automation" }, { type: "adjust_crisis_stability", amount: -6 }] },
        { id: "manual_verify", label: "\u0420\u0443\u0447\u043D\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430", effects: [{ type: "set_flag", flag: "run.crisis.warning_choice", value: "manual_verify" }, { type: "adjust_crisis_stability", amount: 6 }] }
      ]
    },
    {
      id: "EV-CR-03",
      type: "ending",
      deck: "crisis",
      trigger: { type: "crisis_phase", phase: "C4" },
      phaseWindow: { eraIds: ["ATOMIC"] },
      priority: 100,
      telemetryKey: "event_last_protocol",
      title: "\u041F\u041E\u0421\u041B\u0415\u0414\u041D\u0418\u0419 \u041F\u0420\u041E\u0422\u041E\u041A\u041E\u041B",
      body: "\u041D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0438\u0441\u0442\u0435\u043C \u0442\u0440\u0435\u0431\u0443\u044E\u0442 \u043E\u043A\u043E\u043D\u0447\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044F. \u041F\u043E\u043B\u043D\u043E\u0439 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043D\u0435\u0442. \u0412\u0440\u0435\u043C\u0435\u043D\u0438 \u043D\u0430 \u043D\u043E\u0432\u044B\u0439 \u0446\u0438\u043A\u043B \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u043D\u0435 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C.",
      chronicleSummary: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043F\u0440\u043E\u0442\u043E\u043A\u043E\u043B \u0431\u044B\u043B \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D.",
      choices: [
        { id: "retaliate", label: "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0443\u0434\u0430\u0440\u043E\u043C", effects: [{ type: "set_flag", flag: "run.crisis.last_protocol", value: "retaliate" }, { type: "complete_ending", subtype: "ash_fire" }] },
        { id: "disarm", label: "\u041F\u043E\u043F\u044B\u0442\u0430\u0442\u044C\u0441\u044F \u0440\u0430\u0437\u043E\u0440\u0443\u0436\u0438\u0442\u044C \u0441\u0438\u0441\u0442\u0435\u043C\u0443", effects: [{ type: "set_flag", flag: "run.crisis.last_protocol", value: "disarm" }, { type: "complete_ending", subtype: "ash_too_late" }] },
        { id: "delegate_system", label: "\u041F\u0435\u0440\u0435\u0434\u0430\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0441\u0438\u0441\u0442\u0435\u043C\u0435", effects: [{ type: "set_flag", flag: "run.crisis.last_protocol", value: "delegate_system" }, { type: "complete_ending", subtype: "ash_system" }] }
      ]
    }
  ];

  // src/chronicles/config/milestones.js
  var milestones = [{ id: "MS_PROTOCELL", triggerNodeId: "M06", eraId: "CELLULAR" }];

  // src/chronicles/config/endings.js
  var endings = [
    {
      id: "ENDING_ASH",
      type: "scripted_first_timeline",
      requiresEra: "ATOMIC",
      targetTimeMs: 696e4
    }
  ];

  // src/chronicles/config/effects.js
  var effectSupport = {
    unlock_auto_production: { status: "supported" },
    resource_production_multiplier: { status: "supported" },
    resource_capacity: { status: "supported" },
    global_production_multiplier: { status: "supported" },
    unlock_resource: { status: "supported" },
    producer_cost_multiplier: { status: "supported" },
    unlock_building: { status: "supported" },
    manual_gain_multiplier: { status: "supported" },
    set_flag: { status: "supported" },
    job_output_multiplier: { status: "supported" },
    population_capacity: { status: "supported" }
  };
  var allowedEffectTypes = Object.keys(effectSupport).filter(
    (effectType) => effectSupport[effectType].status === "supported"
  );

  // src/chronicles/config/index.js
  var RULESET_VERSION = "timeline1-v11-branch-cost-fix";
  var ruleset = {
    version: RULESET_VERSION,
    resources,
    eras,
    producers,
    nodes,
    branchGroups,
    branchCostRules,
    buildings,
    jobs,
    goals,
    manualProcesses,
    events,
    milestones,
    endings,
    allowedEffectTypes,
    effectSupport
  };
  function indexById(items) {
    return Object.fromEntries(items.map((item) => [item.id, item]));
  }
  function createRulesetIndexes(source = ruleset) {
    return {
      resources: indexById(source.resources),
      eras: indexById(source.eras),
      producers: indexById(source.producers),
      nodes: indexById(source.nodes),
      buildings: indexById(source.buildings),
      jobs: indexById(source.jobs),
      goals: indexById(source.goals),
      manualProcesses: indexById(source.manualProcesses || []),
      events: indexById(source.events)
    };
  }

  // src/chronicles/domain/domainEvents.js
  function createDomainEvent(type, payload, state, ports = {}) {
    return Object.freeze({
      type,
      payload: Object.freeze({ ...payload }),
      occurredAtMs: state.run.clock.simulationMs,
      wallTimeMs: ports.clock ? ports.clock.getNow() : null
    });
  }

  // src/chronicles/domain/services/resources.js
  function getResourceState(state, resourceId) {
    if (!state.run.resources[resourceId]) {
      state.run.resources[resourceId] = { amount: 0 };
    }
    return state.run.resources[resourceId];
  }
  function calculateCap(state, resourceId, ruleset2) {
    const resourceState = state.run.resources[resourceId];
    if (resourceState && resourceState.capOverride != null) {
      return resourceState.capOverride;
    }
    const indexes2 = createRulesetIndexes(ruleset2);
    const config = indexes2.resources[resourceId];
    const baseCap = config?.baseCap ?? Infinity;
    if (!Number.isFinite(baseCap)) return baseCap;
    const expansion = Object.values(state.run.modifiers.active).reduce((total, modifier) => {
      if (modifier.type !== "resource_capacity" || modifier.resourceId !== resourceId) return total;
      return total + modifier.value;
    }, 0);
    return Math.max(0, baseCap + expansion);
  }
  function addResource(state, resourceId, amount, ruleset2, ports) {
    if (!Number.isFinite(amount)) {
      throw new Error(`Invalid resource delta for ${resourceId}`);
    }
    const resource = getResourceState(state, resourceId);
    const before = resource.amount;
    const cap = calculateCap(state, resourceId, ruleset2);
    resource.amount = Math.min(cap, Math.max(0, before + amount));
    state.run.stats.totalEarned ||= {};
    state.run.stats.totalEarned[resourceId] = (state.run.stats.totalEarned[resourceId] || 0) + Math.max(0, resource.amount - before);
    if (before !== resource.amount) {
      return [
        createDomainEvent(
          "resource_changed",
          { resourceId, before, after: resource.amount, delta: resource.amount - before },
          state,
          ports
        )
      ];
    }
    return [];
  }

  // src/chronicles/domain/services/costs.js
  function round3sig(value) {
    if (value === 0) {
      return 0;
    }
    const digits = Math.floor(Math.log10(Math.abs(value))) + 1;
    const factor = 10 ** Math.max(0, digits - 3);
    return Math.round(value / factor) * factor;
  }
  function scaleCost(baseCost, growth, ownedCount) {
    const nextCostNumber = ownedCount + 1;
    return Object.fromEntries(
      Object.entries(baseCost).map(([resourceId, amount]) => [
        resourceId,
        round3sig(amount * growth ** (nextCostNumber - 1))
      ])
    );
  }
  function multiplyCost(cost, multiplier) {
    return Object.fromEntries(
      Object.entries(cost).map(([resourceId, amount]) => [resourceId, round3sig(amount * multiplier)])
    );
  }
  function canAfford(state, cost) {
    for (const [resourceId, amount] of Object.entries(cost)) {
      const current = state.run.resources[resourceId]?.amount || 0;
      if (current < amount) {
        return { ok: false, resourceId, missing: amount - current };
      }
    }
    return { ok: true };
  }
  function payCost(state, cost, ruleset2, ports) {
    if (state.settings.testMode === true) {
      return { ok: true, events: [] };
    }
    const affordability = canAfford(state, cost);
    if (!affordability.ok) {
      return {
        ok: false,
        reason: "INSUFFICIENT_RESOURCES",
        details: affordability,
        events: []
      };
    }
    const events2 = [];
    for (const [resourceId, amount] of Object.entries(cost)) {
      const resource = getResourceState(state, resourceId);
      const before = resource.amount;
      resource.amount = Math.max(0, Math.min(calculateCap(state, resourceId, ruleset2), before - amount));
      events2.push(
        createDomainEvent(
          "resource_changed",
          { resourceId, before, after: resource.amount, delta: resource.amount - before },
          state,
          ports
        )
      );
    }
    return { ok: true, events: events2 };
  }

  // src/chronicles/domain/services/evolution.js
  function prerequisitesMet(state, entity) {
    if (entity.eraIds && !entity.eraIds.includes(state.run.eraId)) {
      return false;
    }
    const required = entity.requiresNodes || [];
    const nodesMet = required.every((nodeId) => state.run.nodes.completed[nodeId]);
    if (!nodesMet) {
      return false;
    }
    const flagsMet = (entity.requiresFlags || []).every((flagId) => state.run.flags[flagId]);
    if (!flagsMet) {
      return false;
    }
    const buildingsMet = (entity.requiresBuildings || []).every((requirement) => {
      return (state.run.buildings?.[requirement.buildingId]?.count || 0) >= (requirement.count || 1);
    });
    if (!buildingsMet) {
      return false;
    }
    if (entity.cognitionMin != null && cognitionValue(state, entity.cognitionContributions) < entity.cognitionMin) {
      return false;
    }
    if (entity.requiresAnyBranchGroup) {
      return Boolean(state.run.nodes.selectedBranchByGroup[entity.requiresAnyBranchGroup]);
    }
    return true;
  }
  function cognitionValue(state, contributions = []) {
    const total = contributions.reduce((sum, contribution) => {
      return state.run.nodes.completed[contribution.nodeId] ? sum + contribution.value : sum;
    }, state.run.cognition?.eventBonus || 0);
    return Math.min(100, total);
  }
  function branchAvailable(state, ruleset2, node) {
    if (!node.branchGroup) {
      return true;
    }
    const selected = state.run.nodes.selectedBranchByGroup[node.branchGroup];
    if (!selected || selected === node.id) {
      return true;
    }
    const rule = ruleset2.branchCostRules?.[node.branchGroup];
    return rule?.allowAdditionalBranches === true;
  }
  function branchCostMultiplier(state, ruleset2, node) {
    if (!node.branchGroup) {
      return 1;
    }
    const rule = ruleset2.branchCostRules?.[node.branchGroup];
    if (!rule) {
      return 1;
    }
    const selected = state.run.nodes.selectedBranchByGroup[node.branchGroup];
    const archiveWaivesPenalty = rule.waiveWithArchiveNodeId && state.meta.archiveNodes?.[rule.waiveWithArchiveNodeId];
    if (!selected || selected === node.id || archiveWaivesPenalty) {
      return 1;
    }
    return rule.additionalBranchCostMultiplier || 1;
  }

  // src/chronicles/domain/services/crisis.js
  var CRISIS_PHASES = [
    // A first run needs enough room to read, answer and anticipate the next
    // escalation. The 2/5/8/12-minute cadence makes Atomic a real finale,
    // rather than a short post-tech cutscene.
    { id: "C1", atMs: 12e4, eventId: "EV-CR-01" },
    { id: "C2", atMs: 3e5, eventId: "EV-CR-02" },
    { id: "C3", atMs: 48e4 },
    { id: "C4", atMs: 72e4, eventId: "EV-CR-03" }
  ];
  function createInitialCrisisState() {
    return {
      active: true,
      stability: 100,
      minStability: 100,
      crisisClockMs: 0,
      atomicLoad: 1,
      unresolvedCrises: 0,
      phase: "C0",
      seenPhases: ["C0"]
    };
  }
  function advanceCrisis(state, ruleset2, deltaMs, ports) {
    const crisis = state.run.crisis;
    if (!crisis?.active || state.run.eraId !== "ATOMIC" || state.run.events?.pendingId) return [];
    crisis.crisisClockMs += deltaMs;
    crisis.stability = Math.max(0, crisis.stability - deltaMs / 1e3 * 0.2);
    crisis.minStability = Math.min(crisis.minStability ?? crisis.stability, crisis.stability);
    const events2 = [createDomainEvent("crisis_updated", {
      stability: crisis.stability,
      worldTension: 100 - crisis.stability,
      crisisClockMs: crisis.crisisClockMs
    }, state, ports)];
    const next = CRISIS_PHASES.find((phase) => !crisis.seenPhases.includes(phase.id) && crisis.crisisClockMs >= phase.atMs);
    if (!next) return events2;
    crisis.phase = next.id;
    crisis.seenPhases.push(next.id);
    events2.push(createDomainEvent("crisis_phase_changed", { phase: next.id }, state, ports));
    if (next.eventId) {
      const queued = queueEvent(state, ruleset2, next.eventId, ports);
      if (queued.ok) events2.push(...queued.events);
    }
    return events2;
  }
  function adjustCrisisStability(state, amount) {
    if (!state.run.crisis) return;
    state.run.crisis.stability = Math.max(0, Math.min(100, state.run.crisis.stability + amount));
    state.run.crisis.minStability = Math.min(state.run.crisis.minStability ?? state.run.crisis.stability, state.run.crisis.stability);
  }
  function completeAshEnding(state, subtype) {
    const endingSubtype = subtype || "ash_too_late";
    state.run.crisis ||= createInitialCrisisState();
    state.run.crisis.active = false;
    state.run.crisis.phase = "ENDED";
    state.run.flags["run.ending.id"] = "ENDING_ASH";
    state.run.flags["run.ending.subtype"] = endingSubtype;
    state.run.ending = { id: "ENDING_ASH", subtype: endingSubtype, completedAtMs: state.run.clock.simulationMs };
    state.run.lifecycle = "ended";
    state.meta.persistentFlags ||= {};
    state.meta.persistentFlags["meta.endings.first_ending"] ||= "ENDING_ASH";
  }

  // src/chronicles/domain/services/events.js
  var EVENT_RNG_MULTIPLIER = 1664525;
  var EVENT_RNG_INCREMENT = 1013904223;
  function ensureEventState(state) {
    const events2 = state.run.events ||= {};
    events2.queue ||= [];
    events2.states ||= {};
    events2.history ||= [];
    events2.pendingId ||= null;
    events2.rngState = Number.isInteger(events2.rngState) ? events2.rngState >>> 0 : 1;
    events2.lastDeckDrawAtMs ||= {};
    return events2;
  }
  function nextRandom(events2) {
    events2.rngState = EVENT_RNG_MULTIPLIER * events2.rngState + EVENT_RNG_INCREMENT >>> 0;
    return events2.rngState / 4294967296;
  }
  function conditionsMet(state, conditions = []) {
    return conditions.every((condition) => {
      if (condition.type === "node_completed") return Boolean(state.run.nodes.completed[condition.nodeId]);
      if (condition.type === "goal_completed") return state.run.goals.states[condition.goalId]?.status === "archived";
      if (condition.type === "flag_set") return state.run.flags[condition.flag] === condition.value;
      if (condition.type === "era_reached") return state.run.eraId === condition.eraId;
      return false;
    });
  }
  function phaseOpen(state, event) {
    const window2 = event.phaseWindow || {};
    if (window2.eraIds && !window2.eraIds.includes(state.run.eraId)) return false;
    if (window2.minActiveMs != null && state.run.clock.activeMs < window2.minActiveMs) return false;
    if (window2.maxActiveMs != null && state.run.clock.activeMs > window2.maxActiveMs) return false;
    return true;
  }
  function activateNext(state, ports) {
    const runtime2 = ensureEventState(state);
    if (runtime2.pendingId || runtime2.queue.length === 0) return [];
    const eventId = runtime2.queue.shift();
    runtime2.pendingId = eventId;
    runtime2.states[eventId].status = "pending";
    return [createDomainEvent("event_pending", { eventId }, state, ports)];
  }
  function isEventEligible(state, event) {
    const runtime2 = ensureEventState(state);
    const tracked = runtime2.states[event.id];
    if (tracked?.status && !event.repeatable) return false;
    if (!phaseOpen(state, event) || !conditionsMet(state, event.preconditions)) return false;
    if (event.cooldownMs && tracked?.resolvedAtMs + event.cooldownMs > state.run.clock.simulationMs) return false;
    return true;
  }
  function queueEvent(state, ruleset2, eventId, ports, options = {}) {
    const eventConfig = ruleset2.events.find((event) => event.id === eventId);
    if (!eventConfig) return { ok: false, reason: "UNKNOWN_EVENT", eventId, events: [] };
    const runtime2 = ensureEventState(state);
    if (runtime2.states[eventId]?.status && !options.force && !eventConfig.repeatable) {
      return { ok: false, reason: "EVENT_ALREADY_TRACKED", eventId, events: [] };
    }
    runtime2.states[eventId] = { status: "queued", queuedAtMs: state.run.clock.simulationMs };
    runtime2.queue.push(eventId);
    runtime2.queue.sort((a, b) => (ruleset2.events.find((event) => event.id === b).priority || 0) - (ruleset2.events.find((event) => event.id === a).priority || 0));
    return { ok: true, eventId, events: [createDomainEvent("event_queued", { eventId }, state, ports), ...activateNext(state, ports)] };
  }
  function queueEventsForTrigger(state, ruleset2, trigger, ports) {
    const events2 = [];
    for (const event of ruleset2.events) {
      if (event.trigger?.type !== trigger.type) continue;
      if (trigger.goalId && event.trigger.goalId !== trigger.goalId) continue;
      if (trigger.nodeId && event.trigger.nodeId !== trigger.nodeId) continue;
      if (!isEventEligible(state, event)) continue;
      const queued = queueEvent(state, ruleset2, event.id, ports);
      if (queued.ok) events2.push(...queued.events);
    }
    return events2;
  }
  function queueEventsForGoal(state, ruleset2, goalId, ports) {
    return queueEventsForTrigger(state, ruleset2, { type: "goal_completed", goalId }, ports);
  }
  function queueEventsForNode(state, ruleset2, nodeId, ports) {
    return queueEventsForTrigger(state, ruleset2, { type: "node_completed", nodeId }, ports);
  }
  function queueDueDeckEvents(state, ruleset2, ports) {
    const runtime2 = ensureEventState(state);
    const decks = [...new Set(ruleset2.events.filter((event) => event.trigger?.type === "deck").map((event) => event.deck))];
    const events2 = [];
    for (const deckId of decks) {
      if (runtime2.pendingId || runtime2.queue.length) break;
      if (state.run.clock.activeMs - (runtime2.lastDeckDrawAtMs[deckId] || 0) < 6e4) continue;
      const eligible = ruleset2.events.filter((event) => event.deck === deckId && event.trigger?.type === "deck" && isEventEligible(state, event));
      if (!eligible.length) continue;
      const totalWeight = eligible.reduce((total, event) => total + (event.weight || 1), 0);
      let threshold = nextRandom(runtime2) * totalWeight;
      const chosen = eligible.find((event) => (threshold -= event.weight || 1) < 0) || eligible.at(-1);
      runtime2.lastDeckDrawAtMs[deckId] = state.run.clock.simulationMs;
      events2.push(...queueEvent(state, ruleset2, chosen.id, ports).events);
    }
    return events2;
  }
  function eventBlocksNode(state, ruleset2, node) {
    const runtime2 = ensureEventState(state);
    const indexes2 = createRulesetIndexes(ruleset2).events;
    const blockingId = [runtime2.pendingId, ...runtime2.queue].find((eventId) => {
      const branchGroup = indexes2[eventId]?.blocks?.branchGroup;
      return Boolean(branchGroup && branchGroup === node.branchGroup);
    });
    return Boolean(blockingId);
  }
  function resolveEvent(state, ruleset2, eventId, choiceId, ports, options = {}) {
    const runtime2 = ensureEventState(state);
    if (runtime2.pendingId !== eventId) return { ok: false, reason: "EVENT_NOT_PENDING", events: [] };
    const event = createRulesetIndexes(ruleset2).events[eventId];
    const choice = event?.choices?.find((candidate) => candidate.id === choiceId);
    if (!choice) return { ok: false, reason: "UNKNOWN_EVENT_CHOICE", events: [] };
    const applied = choice.purchaseNodeId && options.applyPurchaseNode ? options.applyPurchaseNode(choice.purchaseNodeId) : { ok: true, events: [] };
    if (!applied.ok) return applied;
    const effectEvents = [];
    for (const effect of choice.effects || []) {
      if (effect.type === "grant_resource") effectEvents.push(...addResource(state, effect.resourceId, effect.amount, ruleset2, ports));
      if (effect.type === "set_flag") state.run.flags[effect.flag] = effect.value;
      if (effect.type === "set_meta_flag") (state.meta.persistentFlags ||= {})[effect.flag] = effect.value;
      if (effect.type === "grant_cognition") {
        state.run.cognition ||= { eventBonus: 0 };
        state.run.cognition.eventBonus = Math.max(0, state.run.cognition.eventBonus + effect.amount);
      }
      if (effect.type === "adjust_crisis_stability") adjustCrisisStability(state, effect.amount);
      if (effect.type === "complete_ending") completeAshEnding(state, effect.subtype);
      if (effect.type === "unlock_meta") state.meta.unlocks[effect.unlockId] = true;
    }
    runtime2.states[eventId] = { ...runtime2.states[eventId], status: "resolved", choiceId, resolvedAtMs: state.run.clock.simulationMs };
    runtime2.history.push({ eventId, choiceId, resolvedAtMs: state.run.clock.simulationMs });
    runtime2.pendingId = null;
    const recordId = `${state.run.id}:${eventId}`;
    if (!state.meta.chronicle.some((record) => record.id === recordId)) {
      state.meta.chronicle.push({ id: recordId, kind: "event", eventId, choiceId, summary: event.chronicleSummary, occurredAtMs: state.run.clock.simulationMs });
    }
    ports.platform?.track?.(event.telemetryKey || "event_resolved", { eventId, choiceId });
    return {
      ok: true,
      eventId,
      choiceId,
      events: [...applied.events || [], ...effectEvents, createDomainEvent("event_resolved", { eventId, choiceId, telemetryKey: event.telemetryKey }, state, ports), ...activateNext(state, ports)]
    };
  }

  // src/chronicles/domain/services/goals.js
  var TERMINAL_STATUSES = /* @__PURE__ */ new Set(["archived", "skipped_by_archive", "failed_soft"]);
  function isParallelGoal(goal) {
    return Boolean(goal.optional || goal.slot === "side" || goal.slot === "progressive");
  }
  function getGoalState(state, goalId) {
    return state.run.goals.states[goalId] || { status: "hidden" };
  }
  function conditionMet(state, condition) {
    switch (condition.type) {
      case "resource_amount":
        return (state.run.resources[condition.resourceId]?.amount || 0) >= condition.amount;
      case "producer_count":
        return (state.run.producers[condition.producerId]?.count || 0) >= condition.count;
      case "node_completed":
        return Boolean(state.run.nodes.completed[condition.nodeId]);
      case "branch_selected":
        return Boolean(state.run.nodes.selectedBranchByGroup[condition.branchGroup]);
      case "manual_process_completed":
        return (state.run.manualProcesses[condition.processId]?.uses || 0) >= (condition.count || 1);
      case "era_reached":
        return state.run.eraId === condition.eraId;
      case "flag_set":
        return state.run.flags[condition.flag] === condition.value;
      case "adaptation_selected":
        return (state.run.adaptation?.selectedOptionalNodes || []).length >= (condition.count || 1);
      case "cognition_at_least":
        return cognitionValue(state, condition.contributions || []) >= condition.value;
      case "population_at_least":
        return (state.run.population?.current || 0) >= condition.value;
      case "building_count":
        return (state.run.buildings[condition.buildingId]?.count || 0) >= condition.count;
      default:
        return false;
    }
  }
  function goalPrerequisitesMet(state, goal) {
    return (goal.prerequisites || []).every((condition) => conditionMet(state, condition));
  }
  function goalConditionsMet(state, goal) {
    return (goal.conditions || []).every((condition) => conditionMet(state, condition));
  }
  function writeGoalState(state, goal, status, fields = {}) {
    const current = getGoalState(state, goal.id);
    state.run.goals.states[goal.id] = { ...current, status, ...fields };
    return state.run.goals.states[goal.id];
  }
  function activateGoal(state, goal, ports) {
    const current = getGoalState(state, goal.id);
    writeGoalState(state, goal, "active", {
      revealedAtMs: current.revealedAtMs ?? state.run.clock.simulationMs,
      startedAtMs: current.startedAtMs ?? state.run.clock.simulationMs,
      lastProgressAtMs: current.lastProgressAtMs ?? state.run.clock.simulationMs
    });
    if (isParallelGoal(goal)) {
      if (!state.run.goals.side.activeIds.includes(goal.id)) {
        state.run.goals.side.activeIds.push(goal.id);
      }
    } else {
      state.run.goals.currentId = goal.id;
      state.run.goals.chapter.activeId = goal.id;
    }
    return current.status === "active" ? [] : [createDomainEvent("goal_started", { goalId: goal.id, slot: goal.slot || "chapter" }, state, ports)];
  }
  function applyGoalRewards(state, ruleset2, goal, ports) {
    const goalState = getGoalState(state, goal.id);
    if (goalState.rewardAppliedAtMs != null) {
      return [];
    }
    const events2 = [];
    for (const reward of goal.rewards || []) {
      if (reward.type === "grant_resource") {
        events2.push(...addResource(state, reward.resourceId, reward.amount, ruleset2, ports));
      }
      if (reward.type === "reveal_entity") {
        if (!state.run.discovery) {
          state.run.discovery = { seenEntities: [], corruptedSeen: [] };
        }
        if (!state.run.discovery.seenEntities.includes(reward.entityId)) {
          state.run.discovery.seenEntities.push(reward.entityId);
        }
        events2.push(createDomainEvent("entity_revealed", reward, state, ports));
      }
      if (reward.type === "set_flag") {
        state.run.flags[reward.flag] = reward.value;
        events2.push(createDomainEvent("flag_set", { flag: reward.flag, value: reward.value, sourceGoalId: goal.id }, state, ports));
      }
      if (reward.type === "grant_adaptation_points") {
        state.run.adaptation ||= { points: 0, earnedTotal: 0, spentTotal: 0, selectedOptionalNodes: [] };
        state.run.adaptation.points += reward.amount;
        state.run.adaptation.earnedTotal += reward.amount;
        events2.push(createDomainEvent("adaptation_points_granted", { amount: reward.amount, sourceGoalId: goal.id }, state, ports));
      }
    }
    writeGoalState(state, goal, "archived", {
      rewardAppliedAtMs: state.run.clock.simulationMs,
      archivedAtMs: state.run.clock.simulationMs
    });
    if (isParallelGoal(goal)) {
      state.run.goals.side.activeIds = state.run.goals.side.activeIds.filter((goalId) => goalId !== goal.id);
    }
    return events2;
  }
  function completeGoal(state, ruleset2, goal, ports) {
    const current = getGoalState(state, goal.id);
    if (current.completedAtMs != null) {
      return [];
    }
    writeGoalState(state, goal, "completed", { completedAtMs: state.run.clock.simulationMs });
    writeGoalState(state, goal, "reward_pending");
    return [
      createDomainEvent("goal_completed", { goalId: goal.id, nodeId: goal.nodeId || null }, state, ports),
      ...applyGoalRewards(state, ruleset2, goal, ports)
    ];
  }
  function maybeShowHint(state, goal, ports) {
    const goalState = getGoalState(state, goal.id);
    if (goalState.status !== "active" || !goal.hintTimeoutMs || goalState.hintShownAtMs != null) {
      return [];
    }
    if (state.run.clock.simulationMs - goalState.startedAtMs < goal.hintTimeoutMs) {
      return [];
    }
    writeGoalState(state, goal, "stalled", { hintShownAtMs: state.run.clock.simulationMs });
    return [createDomainEvent("goal_hint_shown", { goalId: goal.id, hint: goal.hint || null }, state, ports)];
  }
  function canActivateMainGoal(state, goal) {
    if (isParallelGoal(goal)) {
      return false;
    }
    if (!state.run.goals.currentId || state.run.goals.currentId === goal.id) {
      return true;
    }
    return TERMINAL_STATUSES.has(getGoalState(state, state.run.goals.currentId).status);
  }
  function evaluateGoals(state, ruleset2, ports = {}) {
    const events2 = [];
    const indexes2 = createRulesetIndexes(ruleset2);
    for (const goal of ruleset2.goals || []) {
      const goalState = getGoalState(state, goal.id);
      if (!TERMINAL_STATUSES.has(goalState.status) && goalPrerequisitesMet(state, goal) && goalState.status === "hidden") {
        writeGoalState(state, goal, "revealed", { revealedAtMs: state.run.clock.simulationMs });
      }
    }
    for (const goal of ruleset2.goals || []) {
      const goalState = getGoalState(state, goal.id);
      if (TERMINAL_STATUSES.has(goalState.status)) {
        continue;
      }
      const canActivate = goalPrerequisitesMet(state, goal) && (isParallelGoal(goal) || canActivateMainGoal(state, goal));
      if (canActivate && ["hidden", "revealed"].includes(goalState.status)) {
        events2.push(...activateGoal(state, goal, ports));
      }
    }
    for (const goal of ruleset2.goals || []) {
      const goalState = getGoalState(state, goal.id);
      if (TERMINAL_STATUSES.has(goalState.status)) {
        continue;
      }
      if (goalConditionsMet(state, goal)) {
        events2.push(...completeGoal(state, ruleset2, goal, ports));
      } else {
        events2.push(...maybeShowHint(state, goal, ports));
      }
    }
    const currentGoal = indexes2.goals[state.run.goals.currentId];
    const nextGoal = indexes2.goals[currentGoal?.sequence?.nextGoalId];
    if (nextGoal && TERMINAL_STATUSES.has(getGoalState(state, currentGoal.id).status) && goalPrerequisitesMet(state, nextGoal)) {
      events2.push(...activateGoal(state, nextGoal, ports));
    }
    return events2;
  }

  // src/chronicles/domain/services/modifiers.js
  function applyEffects(state, effects = [], source = {}) {
    for (const effect of effects) {
      if (effect.deferred) {
        continue;
      }
      const sourceKey = source.sourceId || "unknown";
      if (effect.type === "resource_production_multiplier") {
        state.run.modifiers.active[`${sourceKey}:resource:${effect.resourceId}`] = effect;
      }
      if (effect.type === "resource_capacity") {
        state.run.modifiers.active[`${sourceKey}:capacity:${effect.resourceId}`] = effect;
      }
      if (effect.type === "global_production_multiplier") {
        state.run.modifiers.active[`${sourceKey}:global`] = effect;
      }
      if (effect.type === "producer_cost_multiplier") {
        state.run.modifiers.active[`${sourceKey}:producer_cost:${effect.producerTag}`] = effect;
      }
      if (effect.type === "unlock_auto_production") {
        state.run.modifiers.active[`${sourceKey}:auto_production`] = effect;
      }
      if (effect.type === "manual_gain_multiplier") {
        state.run.modifiers.active[`${sourceKey}:manual_gain`] = effect;
      }
      if (effect.type === "job_output_multiplier") {
        state.run.modifiers.active[`${sourceKey}:job:${effect.jobId}`] = effect;
      }
      if (effect.type === "population_capacity") {
        state.run.modifiers.active[`${sourceKey}:population_capacity`] = effect;
      }
      if (effect.type === "unlock_resource") {
        if (!state.run.resources[effect.resourceId]) {
          state.run.resources[effect.resourceId] = { amount: 0 };
        }
      }
      if (effect.type === "unlock_building") {
        state.run.flags[`run.unlock.building.${effect.buildingId}`] = true;
      }
      if (effect.type === "set_flag") {
        state.run.flags[effect.flag] = effect.value;
      }
    }
  }
  function isAutoProductionUnlocked(state) {
    return Object.values(state.run.modifiers.active).some((modifier) => modifier.type === "unlock_auto_production");
  }

  // src/chronicles/domain/services/production.js
  function producerMilestoneMultiplier(count, milestones2 = []) {
    return milestones2.reduce((multiplier, milestone) => {
      return count >= milestone.count ? multiplier * milestone.multiplier : multiplier;
    }, 1);
  }
  function productionMultiplierForResource(state, resourceId) {
    let multiplier = 1;
    for (const modifier of Object.values(state.run.modifiers.active)) {
      if (modifier.type === "global_production_multiplier") {
        multiplier *= modifier.value;
      }
      if (modifier.type === "resource_production_multiplier" && modifier.resourceId === resourceId) {
        multiplier *= modifier.value;
      }
    }
    return multiplier;
  }
  function producerFlowRates(state, producer, count) {
    const milestoneMultiplier = producerMilestoneMultiplier(count, producer.milestones);
    const output = {};
    const input = {};
    for (const [resourceId, amount] of Object.entries(producer.output || {})) {
      output[resourceId] = count * amount * milestoneMultiplier * productionMultiplierForResource(state, resourceId);
    }
    for (const [resourceId, amount] of Object.entries(producer.input || {})) {
      input[resourceId] = count * amount;
    }
    return { input, output };
  }
  function activeProducerFlows(state, ruleset2) {
    const autoProductionUnlocked = isAutoProductionUnlocked(state);
    const indexes2 = createRulesetIndexes(ruleset2);
    return Object.entries(state.run.producers).map(([producerId, producerState]) => ({ producer: indexes2.producers[producerId], count: producerState.count || 0 })).filter(({ producer, count }) => producer && count && (autoProductionUnlocked || producer.producesBeforeAutoUnlock === true)).map(({ producer, count }) => ({ kind: "producer", id: producer.id, ...producerFlowRates(state, producer, count) }));
  }
  function jobOutputMultiplier(state, jobId) {
    return Object.values(state.run.modifiers.active || {}).reduce((multiplier, modifier) => {
      return modifier.type === "job_output_multiplier" && modifier.jobId === jobId ? multiplier * modifier.value : multiplier;
    }, 1);
  }
  function activeJobFlows(state, ruleset2) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const assignments = state.run.population?.assignments || {};
    return Object.entries(assignments).map(([jobId, count]) => ({ job: indexes2.jobs[jobId], count })).filter(({ job, count }) => job && count > 0 && prerequisitesMet(state, job)).map(({ job, count }) => {
      const multiplier = jobOutputMultiplier(state, job.id);
      const output = Object.fromEntries(Object.entries(job.output || {}).map(([resourceId, amount]) => [resourceId, count * amount * multiplier]));
      return { kind: "job", id: job.id, input: {}, output };
    });
  }
  function activeBuildingFlows(state, ruleset2) {
    const indexes2 = createRulesetIndexes(ruleset2);
    return Object.entries(state.run.buildings).map(([buildingId, buildingState]) => ({ building: indexes2.buildings[buildingId], count: buildingState.count || 0 })).filter(({ building, count }) => building && count > 0 && prerequisitesMet(state, building)).map(({ building, count }) => ({
      kind: "building",
      id: building.id,
      input: Object.fromEntries(Object.entries(building.input || {}).map(([resourceId, amount]) => [resourceId, count * amount])),
      output: Object.fromEntries(Object.entries(building.output || {}).map(([resourceId, amount]) => [resourceId, count * amount * productionMultiplierForResource(state, resourceId)]))
    }));
  }
  function activeFlows(state, ruleset2) {
    return [...activeProducerFlows(state, ruleset2), ...activeJobFlows(state, ruleset2), ...activeBuildingFlows(state, ruleset2)];
  }
  function calculateProductionRates(state, ruleset2) {
    const rates = {};
    for (const flow of activeFlows(state, ruleset2)) {
      for (const [resourceId, amount] of Object.entries(flow.output)) rates[resourceId] = (rates[resourceId] || 0) + amount;
      for (const [resourceId, amount] of Object.entries(flow.input)) rates[resourceId] = (rates[resourceId] || 0) - amount;
    }
    return rates;
  }
  function applyProduction(state, ruleset2, deltaMs, ports) {
    if (state.run.lifecycle !== "active") {
      return { rates: {}, events: [] };
    }
    const seconds = deltaMs / 1e3;
    const flows = activeFlows(state, ruleset2);
    const available = Object.fromEntries(Object.entries(state.run.resources).map(([resourceId, resource]) => [resourceId, resource.amount]));
    const actualRates = {};
    const appliedFlows = flows.map((flow) => {
      let scale = 1;
      for (const [resourceId, rate] of Object.entries(flow.input)) {
        const needed = rate * seconds;
        if (needed > 0) scale = Math.min(scale, Math.max(0, (available[resourceId] || 0) / needed));
      }
      for (const [resourceId, rate] of Object.entries(flow.input)) available[resourceId] = Math.max(0, (available[resourceId] || 0) - rate * seconds * scale);
      return { ...flow, scale };
    });
    const events2 = [];
    for (const flow of appliedFlows) {
      for (const [resourceId, rate] of Object.entries(flow.input)) {
        const appliedRate = rate * flow.scale;
        actualRates[resourceId] = (actualRates[resourceId] || 0) - appliedRate;
        events2.push(...addResource(state, resourceId, -appliedRate * seconds, ruleset2, ports));
      }
    }
    for (const flow of appliedFlows) {
      for (const [resourceId, rate] of Object.entries(flow.output)) {
        const appliedRate = rate * flow.scale;
        actualRates[resourceId] = (actualRates[resourceId] || 0) + appliedRate;
        events2.push(...addResource(state, resourceId, appliedRate * seconds, ruleset2, ports));
      }
    }
    const powerDemand = appliedFlows.filter((flow) => flow.kind === "building" && flow.input.power).reduce((total, flow) => total + flow.input.power * seconds, 0);
    const suppliedPower = appliedFlows.filter((flow) => flow.kind === "building" && flow.input.power).reduce((total, flow) => total + flow.input.power * seconds * flow.scale, 0);
    const hadPowerDeficit = state.run.economy?.deficits?.power === true;
    const hasPowerDeficit = powerDemand > suppliedPower + 1e-6;
    state.run.economy ||= { deficits: {} };
    state.run.economy.deficits ||= {};
    state.run.economy.deficits.power = hasPowerDeficit;
    if (hasPowerDeficit !== hadPowerDeficit) {
      events2.push(createDomainEvent(
        hasPowerDeficit ? "power_deficit_started" : "power_deficit_recovered",
        { demand: powerDemand / seconds, supplied: suppliedPower / seconds },
        state,
        ports
      ));
    }
    return { rates: actualRates, events: events2 };
  }

  // src/chronicles/domain/services/manualProcesses.js
  function selectManualProcessState(state, processId) {
    return state.run.manualProcesses[processId] || null;
  }
  function manualProcessAvailable(state, process) {
    if (!process) {
      return false;
    }
    if (!process.availableFromStart) {
      if (!process.availableAfterNodeId || !state.run.nodes.completed[process.availableAfterNodeId]) {
        return false;
      }
    }
    for (const nodeId of process.requiresNodes || []) {
      if (!state.run.nodes.completed[nodeId]) {
        return false;
      }
    }
    if (process.obsoleteAfterNodeId && state.run.nodes.completed[process.obsoleteAfterNodeId]) {
      return false;
    }
    return state.run.clock.simulationMs >= (selectManualProcessState(state, process.id)?.availableAtMs || 0);
  }
  function manualProcessCooldownMs(state, process) {
    const stage = (process.cooldownStages || []).filter((candidate) => candidate.afterNodeId && state.run.nodes.completed[candidate.afterNodeId]).at(-1);
    if (stage) {
      return stage.cooldownMs;
    }
    if (process.cooldownAfterNodeId && state.run.nodes.completed[process.cooldownAfterNodeId]) {
      return process.cooldownAfterMs ?? process.cooldownMs;
    }
    return process.cooldownMs;
  }
  function manualProcessInputCost(process) {
    return process?.reward?.inputCost || process?.inputCost || {};
  }
  function calculateManualReward(state, ruleset2, process, options = {}) {
    if (!process?.reward || !["manual_gain", "convert_resource"].includes(process.reward.type)) {
      return {};
    }
    const rates = calculateProductionRates(state, ruleset2);
    const resourceId = process.reward.resourceId;
    const productionAmount = (rates[resourceId] || 0) * (process.reward.productionSeconds || 0);
    const manualGainMultiplier = process.usesManualGainModifiers === false ? 1 : Object.values(state.run.modifiers.active).reduce((value, modifier) => {
      return modifier.type === "manual_gain_multiplier" ? value * modifier.value : value;
    }, 1);
    const rewardMultiplier = (process.reward.rewardMultiplier ?? process.rewardMultiplier ?? 1) * (options.rewardMultiplier ?? 1);
    const multiplier = manualGainMultiplier * rewardMultiplier;
    return { [resourceId]: Math.max(process.reward.baseAmount || 0, productionAmount) * multiplier };
  }
  function useManualProcess(state, ruleset2, processId, ports = {}, options = {}) {
    const process = createRulesetIndexes(ruleset2).manualProcesses[processId];
    if (!process) {
      return { ok: false, reason: "UNKNOWN_MANUAL_PROCESS", processId, events: [] };
    }
    if (!manualProcessAvailable(state, process)) {
      return { ok: false, reason: "MANUAL_PROCESS_UNAVAILABLE", processId, events: [] };
    }
    const inputCost = manualProcessInputCost(process);
    const affordability = canAfford(state, inputCost);
    if (!affordability.ok) {
      return {
        ok: false,
        reason: "INSUFFICIENT_RESOURCES",
        details: affordability,
        processId,
        events: []
      };
    }
    const reward = calculateManualReward(state, ruleset2, process, options);
    const payment = payCost(state, inputCost, ruleset2, ports);
    const events2 = [...payment.events];
    for (const [resourceId, amount] of Object.entries(reward)) {
      events2.push(...addResource(state, resourceId, amount, ruleset2, ports));
    }
    const previous = selectManualProcessState(state, processId) || { uses: 0 };
    state.run.manualProcesses[processId] = {
      uses: previous.uses + 1,
      lastUsedAtMs: state.run.clock.simulationMs,
      availableAtMs: state.run.clock.simulationMs + manualProcessCooldownMs(state, process)
    };
    events2.push(createDomainEvent("manual_process_used", { processId, inputCost, reward }, state, ports));
    return { ok: true, events: events2, inputCost, reward };
  }

  // src/chronicles/domain/services/population.js
  var FOOD_PER_PERSON_PER_SECOND = 0.12;
  var GROWTH_PER_SECOND = 0.02;
  function calculatePopulationCap(state) {
    const baseCap = state.run.population?.baseCap || 0;
    const expansion = Object.values(state.run.modifiers.active || {}).reduce((total, modifier) => {
      return modifier.type === "population_capacity" ? total + modifier.value : total;
    }, 0);
    return baseCap + expansion;
  }
  function initializePopulation(state, era) {
    const start = era?.civilizationStart;
    if (!start || state.run.population) return;
    state.run.population = {
      current: start.population,
      peak: start.population,
      baseCap: start.populationCap,
      assignments: {},
      foodStatus: "healthy"
    };
  }
  function applyPopulationFoodLoop(state, ruleset2, deltaMs, ports) {
    const population = state.run.population;
    if (!population) return { events: [], consumed: 0, grew: 0 };
    const seconds = deltaMs / 1e3;
    const required = population.current * FOOD_PER_PERSON_PER_SECOND * seconds;
    const available = state.run.resources.food?.amount || 0;
    const consumed = Math.min(required, available);
    const events2 = addResource(state, "food", -consumed, ruleset2, ports);
    const deficit = required > consumed + 1e-6;
    const previousStatus = population.foodStatus || "healthy";
    population.foodStatus = deficit ? "deficit" : "healthy";
    if (previousStatus !== population.foodStatus) {
      events2.push(createDomainEvent(
        deficit ? "food_deficit_started" : "food_deficit_recovered",
        { required, consumed, population: population.current },
        state,
        ports
      ));
    }
    let grew = 0;
    const cap = calculatePopulationCap(state);
    if (!deficit && (state.run.resources.food?.amount || 0) > 0 && population.current < cap) {
      grew = Math.min(cap - population.current, GROWTH_PER_SECOND * seconds);
      population.current += grew;
      population.peak = Math.max(population.peak, population.current);
      events2.push(createDomainEvent("population_grew", { amount: grew, current: population.current, cap }, state, ports));
    }
    return { events: events2, consumed, grew };
  }
  function assertPopulationRequirement(state, entity) {
    if (!entity.populationMin) {
      return { ok: true };
    }
    const current = state.run.population?.current || 0;
    if (current < entity.populationMin) {
      return {
        ok: false,
        reason: "POPULATION_REQUIREMENT_NOT_MET",
        details: { required: entity.populationMin, current }
      };
    }
    return { ok: true };
  }

  // src/chronicles/domain/selectors.js
  function formatResourceAmount(value) {
    if (!Number.isFinite(value)) {
      return "0";
    }
    return String(Math.floor(Math.max(0, value)));
  }
  function formatEtaDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return "0\u0441";
    }
    const totalSeconds = Math.ceil(seconds);
    if (totalSeconds < 3600) {
      const minutes2 = Math.floor(totalSeconds / 60);
      const remainingSeconds = totalSeconds % 60;
      if (minutes2 > 0 && remainingSeconds === 0) {
        return `${minutes2}\u043C`;
      }
      if (minutes2 > 0) {
        return `${minutes2}\u043C ${remainingSeconds}\u0441`;
      }
      return `${remainingSeconds}\u0441`;
    }
    const totalMinutes = Math.ceil(seconds / 60);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor(totalMinutes % 1440 / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) {
      return `${days}\u0434 ${hours}\u0447 ${minutes}\u043C`;
    }
    return `${hours}\u0447 ${minutes}\u043C`;
  }
  function formatEta(eta) {
    if (!eta || eta.status === "unavailable") {
      return "\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E";
    }
    if (eta.status === "now") {
      return "\u0421\u0435\u0439\u0447\u0430\u0441";
    }
    return `\u2248${formatEtaDuration(eta.seconds)}`;
  }
  function selectProductionRates(state, ruleset2) {
    return calculateProductionRates(state, ruleset2);
  }
  function timeUntilAffordable(state, ruleset2, cost) {
    const rates = calculateProductionRates(state, ruleset2);
    let seconds = 0;
    const missing = {};
    for (const [resourceId, amount] of Object.entries(cost || {})) {
      const current = state.run.resources[resourceId]?.amount || 0;
      const deficit = amount - current;
      if (deficit <= 0) {
        continue;
      }
      missing[resourceId] = deficit;
      const cap = calculateCap(state, resourceId, ruleset2);
      if (amount > cap || (rates[resourceId] || 0) <= 0) {
        return { status: "unavailable", resourceId, missing };
      }
      seconds = Math.max(seconds, deficit / rates[resourceId]);
    }
    if (seconds <= 0) {
      return { status: "now", seconds: 0, missing };
    }
    return { status: "waiting", seconds, missing };
  }
  function selectPurchaseEta(state, ruleset2, status, cost) {
    if (status === "completed") {
      return null;
    }
    if (status === "locked" || status === "unknown") {
      return { status: "unavailable" };
    }
    return timeUntilAffordable(state, ruleset2, cost);
  }
  function selectVisibleResources(state, ruleset2) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const active = indexes2.eras[state.run.eraId]?.activeResources || Object.keys(state.run.resources);
    return active.filter((resourceId) => state.run.resources[resourceId]).map((resourceId) => ({
      id: resourceId,
      label: indexes2.resources[resourceId]?.label || indexes2.resources[resourceId]?.labelKey || resourceId,
      amount: state.run.resources[resourceId].amount,
      cap: calculateCap(state, resourceId, ruleset2),
      perSecond: calculateProductionRates(state, ruleset2)[resourceId] || 0
    }));
  }
  function selectPopulation(state) {
    if (!state.run.population) return null;
    const assigned = Object.values(state.run.population.assignments || {}).reduce((sum, value) => sum + value, 0);
    return {
      ...state.run.population,
      cap: calculatePopulationCap(state),
      assigned,
      unassigned: Math.max(0, Math.floor(state.run.population.current) - assigned)
    };
  }
  function selectCognition(state, ruleset2) {
    const contributions = ruleset2.nodes.flatMap((node) => node.cognitionContribution ? [{ nodeId: node.id, value: node.cognitionContribution }] : []);
    return { value: cognitionValue(state, contributions), max: 100 };
  }
  function checkAffordability(state, cost) {
    if (state.settings.testMode === true) return { ok: true };
    return canAfford(state, cost);
  }
  function selectNodeStatus(state, ruleset2, nodeId) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const node = indexes2.nodes[nodeId];
    if (!node) {
      return "unknown";
    }
    if (state.run.nodes.completed[nodeId]) {
      return "completed";
    }
    if (!prerequisitesMet(state, node) || !branchAvailable(state, ruleset2, node) || eventBlocksNode(state, ruleset2, node)) {
      return "locked";
    }
    if ((node.adaptationPointCost || 0) > (state.run.adaptation?.points || 0)) {
      return "available_unaffordable";
    }
    const cost = selectNodeCost(state, ruleset2, nodeId);
    return checkAffordability(state, cost).ok ? "available_affordable" : "available_unaffordable";
  }
  function selectProducerPrice(state, ruleset2, producerId) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const producer = indexes2.producers[producerId];
    const count = state.run.producers[producerId]?.count || 0;
    let cost = scaleCost(producer.baseCost, producer.growth, count);
    for (const modifier of Object.values(state.run.modifiers.active)) {
      if (modifier.type !== "producer_cost_multiplier") {
        continue;
      }
      if ((producer.tags || []).includes(modifier.producerTag)) {
        cost = multiplyCost(cost, modifier.value);
      }
    }
    return cost;
  }
  function selectProducerStatus(state, ruleset2, producerId) {
    const producer = createRulesetIndexes(ruleset2).producers[producerId];
    if (!producer) {
      return "unknown";
    }
    if (!producer.unlocksAtStart && !prerequisitesMet(state, producer)) {
      return "locked";
    }
    return checkAffordability(state, selectProducerPrice(state, ruleset2, producerId)).ok ? "available_affordable" : "available_unaffordable";
  }
  function selectBuildingPrice(state, ruleset2, buildingId) {
    const building = createRulesetIndexes(ruleset2).buildings[buildingId];
    if (!building) return null;
    const count = state.run.buildings[buildingId]?.count || 0;
    return scaleCost(building.baseCost, building.growth, count);
  }
  function selectBuildingStatus(state, ruleset2, buildingId) {
    const building = createRulesetIndexes(ruleset2).buildings[buildingId];
    if (!building) return "unknown";
    if (!prerequisitesMet(state, building)) return "locked";
    const count = state.run.buildings[buildingId]?.count || 0;
    if (building.maxCount != null && count >= building.maxCount) return "maxed";
    const price = selectBuildingPrice(state, ruleset2, buildingId);
    const affordability = checkAffordability(state, price);
    return affordability.ok ? "available_affordable" : "available_unaffordable";
  }
  function selectProducerOutputView(state, ruleset2, producerId) {
    const producer = createRulesetIndexes(ruleset2).producers[producerId];
    if (!producer) {
      return null;
    }
    const count = state.run.producers[producerId]?.count || 0;
    const milestoneMultiplier = producerMilestoneMultiplier(count, producer.milestones);
    const nextMilestone = (producer.milestones || []).find((candidate) => count < candidate.count) || null;
    const reachedMilestone = [...producer.milestones || []].reverse().find((candidate) => count >= candidate.count) || null;
    const basePerUnit = { ...producer.output || {} };
    const inputPerUnit = { ...producer.input || {} };
    const flow = producerFlowRates(state, producer, count);
    const currentTotal = flow.output;
    return {
      count,
      basePerUnit,
      inputPerUnit,
      currentInput: flow.input,
      currentTotal,
      milestoneMultiplier,
      nextMilestone,
      reachedMilestone
    };
  }
  function selectNodeCost(state, ruleset2, nodeId) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const node = indexes2.nodes[nodeId];
    return multiplyCost(node.cost, branchCostMultiplier(state, ruleset2, node));
  }
  function selectEvolutionRevealLevel(state, ruleset2, nodeId, memo = {}) {
    if (memo[nodeId] != null) return memo[nodeId];
    const node = createRulesetIndexes(ruleset2).nodes[nodeId];
    if (!node || state.run.nodes.completed[nodeId]) return -1;
    const incompleteRequirements = (node.requiresNodes || []).filter(
      (requiredId) => !requiredId.endsWith("*") && !state.run.nodes.completed[requiredId]
    );
    let level = incompleteRequirements.length ? Math.max(...incompleteRequirements.map((requiredId) => selectEvolutionRevealLevel(state, ruleset2, requiredId, memo) + 1)) : 0;
    if (node.requiresAnyBranchGroup && !state.run.nodes.selectedBranchByGroup[node.requiresAnyBranchGroup]) {
      const branchLevels = ruleset2.branchGroups[node.requiresAnyBranchGroup].map((branchNodeId) => selectEvolutionRevealLevel(state, ruleset2, branchNodeId, memo));
      level = Math.max(level, Math.min(...branchLevels) + 1);
    }
    memo[nodeId] = level;
    return level;
  }
  function selectCurrentGoal(state, ruleset2) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const goal = indexes2.goals[state.run.goals.currentId];
    if (!goal) {
      return null;
    }
    return {
      ...goal,
      state: getGoalState(state, goal.id),
      completed: goalConditionsMet(state, goal)
    };
  }
  function activeParallelGoals(state, ruleset2) {
    const indexes2 = createRulesetIndexes(ruleset2);
    return state.run.goals.side.activeIds.map((goalId) => indexes2.goals[goalId]).filter(Boolean).map((goal) => ({ ...goal, state: getGoalState(state, goal.id), completed: goalConditionsMet(state, goal) }));
  }
  function selectSideGoals(state, ruleset2) {
    return activeParallelGoals(state, ruleset2).filter((goal) => goal.slot !== "progressive");
  }
  function selectProgressiveGoals(state, ruleset2) {
    return activeParallelGoals(state, ruleset2).filter((goal) => goal.slot === "progressive");
  }
  function selectManualProcessView(state, ruleset2, processId) {
    const process = createRulesetIndexes(ruleset2).manualProcesses[processId];
    if (!process) {
      return null;
    }
    const processState = state.run.manualProcesses[processId] || { uses: 0, availableAtMs: 0 };
    const inputCost = manualProcessInputCost(process);
    const affordable = canAfford(state, inputCost).ok;
    return {
      ...process,
      state: processState,
      available: manualProcessAvailable(state, process),
      affordable,
      inputCost,
      reward: calculateManualReward(state, ruleset2, process),
      cooldownMs: manualProcessCooldownMs(state, process)
    };
  }

  // src/chronicles/domain/state.js
  var CANONICAL_PATH_SCORE_IDS = [
    "nature",
    "industry",
    "freedom",
    "control",
    "cooperation",
    "dominance",
    "biology",
    "machines",
    "preservation",
    "expansion"
  ];
  function createInitialPathScores() {
    return Object.fromEntries(CANONICAL_PATH_SCORE_IDS.map((pathId) => [pathId, 0]));
  }
  function createInitialGameState(options = {}) {
    const sourceRuleset = options.ruleset || ruleset;
    const runId = options.runId || "run_001";
    const resources2 = {};
    for (const resource of sourceRuleset.resources) {
      if (resource.visibleFromEra === "MOLECULAR") {
        resources2[resource.id] = { amount: resource.initialAmount };
      }
    }
    return {
      run: {
        id: runId,
        timelineId: 1,
        rulesetVersion: sourceRuleset.version,
        lifecycle: "active",
        clock: { simulationMs: 0, activeMs: 0 },
        chapterId: "CH01",
        eraId: "MOLECULAR",
        resources: resources2,
        producers: {},
        nodes: { completed: {}, selectedBranchByGroup: {} },
        population: null,
        economy: { deficits: {} },
        adaptation: { points: 0, earnedTotal: 0, spentTotal: 0, selectedOptionalNodes: [] },
        cognition: { eventBonus: 0 },
        buildings: {},
        goals: {
          currentId: null,
          chapter: { activeId: null },
          side: { activeIds: [] },
          states: {}
        },
        events: { rngState: options.eventSeed ?? 1, queue: [], pendingId: null, states: {}, history: [], lastDeckDrawAtMs: {} },
        flags: {},
        discovery: { seenEntities: [], corruptedSeen: [] },
        pathScores: createInitialPathScores(),
        modifiers: { active: {} },
        manualProcesses: {},
        crisis: null,
        stats: { totalEarned: {} }
      },
      meta: {
        archiveFragments: 0,
        chronicle: [],
        unlocks: {},
        persistentFlags: {},
        seenEntities: {}
      },
      settings: {
        locale: "ru",
        autosave: true,
        testMode: false
      },
      session: {
        dirty: false,
        lastEvents: []
      }
    };
  }
  function toPersistedGameState(state) {
    return {
      run: state.run,
      meta: state.meta,
      settings: state.settings
    };
  }

  // src/chronicles/domain/validation.js
  function assertSerializable(value, path, errors) {
    if (typeof value === "function") {
      errors.push(`${path} must be serializable and cannot contain functions`);
    }
    if (!value || typeof value !== "object") {
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      assertSerializable(child, `${path}.${key}`, errors);
    }
  }
  function validateGameState(state, ruleset2) {
    const errors = [];
    assertSerializable(state, "state", errors);
    if (!state.run || !state.meta || !state.settings) {
      errors.push("State must contain run, meta and settings");
      return { ok: false, errors };
    }
    if (state.run.rulesetVersion !== ruleset2.version) {
      errors.push(`Unsupported ruleset version ${state.run.rulesetVersion}`);
    }
    for (const [resourceId, resource] of Object.entries(state.run.resources || {})) {
      if (!Number.isFinite(resource.amount) || resource.amount < 0) {
        errors.push(`Resource ${resourceId} has invalid amount`);
      }
    }
    const events2 = state.run.events;
    if (!events2 || !Number.isInteger(events2.rngState) || !Array.isArray(events2.queue) || !events2.states || !Array.isArray(events2.history)) {
      errors.push("State must contain normalized event runtime state");
    }
    return { ok: errors.length === 0, errors };
  }

  // src/chronicles/save/codec.js
  var jsonCodec = {
    encode(jsonString) {
      return jsonString;
    },
    decode(payload) {
      return payload;
    }
  };

  // src/chronicles/save/migrations.js
  var CURRENT_SCHEMA_VERSION = 2;
  var CAPACITY_EFFECTS_BY_NODE = {
    M02: [{ resourceId: "rna", value: 300 }],
    M03: [{ resourceId: "rna", value: 500 }, { resourceId: "dna", value: 200 }],
    M05: [{ resourceId: "rna", value: 1e3 }, { resourceId: "dna", value: 250 }],
    M06: [{ resourceId: "dna", value: 350 }, { resourceId: "biomass", value: 200 }],
    C01: [{ resourceId: "atp", value: 120 }],
    C02C: [{ resourceId: "biomass", value: 60 }],
    C05: [{ resourceId: "biomass", value: 120 }],
    T01A: [{ resourceId: "food", value: 300 }, { resourceId: "materials", value: 200 }, { resourceId: "knowledge", value: 80 }],
    T01B: [{ resourceId: "food", value: 300 }, { resourceId: "materials", value: 200 }, { resourceId: "knowledge", value: 80 }],
    T01C: [{ resourceId: "food", value: 300 }, { resourceId: "materials", value: 200 }, { resourceId: "knowledge", value: 80 }],
    T02: [{ resourceId: "food", value: 500 }, { resourceId: "materials", value: 250 }, { resourceId: "knowledge", value: 100 }],
    T03: [{ resourceId: "food", value: 900 }, { resourceId: "materials", value: 400 }, { resourceId: "knowledge", value: 150 }],
    T05: [{ resourceId: "food", value: 1e3 }, { resourceId: "materials", value: 700 }, { resourceId: "knowledge", value: 200 }]
  };
  function rehydrateCapacityEffects(run) {
    run.modifiers ||= { active: {} };
    run.modifiers.active ||= {};
    for (const [nodeId, effects] of Object.entries(CAPACITY_EFFECTS_BY_NODE)) {
      if (!run.nodes?.completed?.[nodeId]) continue;
      for (const effect of effects) {
        run.modifiers.active[`${nodeId}:capacity:${effect.resourceId}`] = { type: "resource_capacity", ...effect };
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
        const migratedKey = key.replaceAll("BLD_ENERGY_STORE", "BLD_ATP_STORE").replace(/:energy(?=$|:)/g, ":atp");
        if (effect.resourceId === "energy") effect.resourceId = "atp";
        if (migratedKey !== key) {
          active[migratedKey] = effect;
          delete active[key];
        }
      }
    }
  }
  var BASE_RESOURCE_CAPS = {
    rna: 100,
    dna: 100,
    biomass: 80,
    atp: 40,
    food: 300,
    materials: 150,
    knowledge: 100,
    power: 100
  };
  var STORAGE_CAPACITY_EFFECTS = {
    BLD_MEMBRANE_STORE: [{ resourceId: "rna", value: 250 }],
    BLD_GENETIC_STORE: [{ resourceId: "dna", value: 150 }],
    BLD_BIOMASS_STORE: [{ resourceId: "biomass", value: 160 }],
    BLD_ATP_STORE: [{ resourceId: "atp", value: 120 }],
    BLD_FOOD_STORE: [{ resourceId: "food", value: 1500 }],
    BLD_MATERIALS_STORE: [{ resourceId: "materials", value: 2e3 }],
    BLD_KNOWLEDGE_ARCHIVE: [{ resourceId: "knowledge", value: 1500 }],
    BLD_POWER_STORE: [{ resourceId: "power", value: 2e3 }]
  };
  function migrateToStorageGates(run) {
    run.modifiers ||= { active: {} };
    const active = run.modifiers.active ||= {};
    for (const [key, effect] of Object.entries(active)) {
      if (effect.type === "resource_capacity") delete active[key];
    }
    const caps = { ...BASE_RESOURCE_CAPS };
    for (const [buildingId, effects] of Object.entries(STORAGE_CAPACITY_EFFECTS)) {
      const count = run.buildings?.[buildingId]?.count || 0;
      for (let instance = 1; instance <= count; instance += 1) {
        for (const effect of effects) {
          active[`${buildingId}:${instance}:capacity:${effect.resourceId}`] = { type: "resource_capacity", ...effect };
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
    if (run.nodes?.completed?.C06 && adaptation.earnedTotal === 0) {
      const spent = adaptation.selectedOptionalNodes.reduce((total, nodeId) => {
        return total + ({ B02A: 1, B02B: 1, B02C: 1, B02D: 2 }[nodeId] || 0);
      }, 0);
      adaptation.earnedTotal = 2;
      adaptation.spentTotal = Math.max(adaptation.spentTotal, spent);
      adaptation.points = Math.max(adaptation.points || 0, Math.max(0, 2 - spent));
    }
  }
  function normalizeEnvelope(envelope) {
    if (!envelope || !envelope.run) return envelope;
    return {
      ...envelope,
      run: {
        ...envelope.run,
        goals: {
          currentId: envelope.run?.goals?.currentId || null,
          chapter: envelope.run?.goals?.chapter || { activeId: envelope.run?.goals?.currentId || null },
          side: envelope.run?.goals?.side || { activeIds: [] },
          states: envelope.run?.goals?.states || {}
        },
        flags: envelope.run?.flags || {},
        discovery: envelope.run?.discovery || { seenEntities: [], corruptedSeen: [] },
        manualProcesses: envelope.run?.manualProcesses || {},
        economy: {
          deficits: {},
          ...envelope.run?.economy || {}
        },
        adaptation: {
          points: 0,
          earnedTotal: 0,
          spentTotal: 0,
          selectedOptionalNodes: [],
          ...envelope.run?.adaptation || {}
        },
        cognition: {
          eventBonus: 0,
          ...envelope.run?.cognition || {}
        },
        stats: {
          totalEarned: {},
          ...envelope.run?.stats || {}
        },
        events: {
          rngState: 1,
          queue: [],
          pendingId: null,
          states: {},
          history: [],
          lastDeckDrawAtMs: {},
          ...envelope.run?.events || {}
        }
      },
      meta: {
        archiveFragments: 0,
        chronicle: [],
        unlocks: {},
        appliedTransactions: [],
        persistentFlags: {},
        seenEntities: {},
        ...envelope.meta || {}
      },
      settings: {
        locale: "ru",
        autosave: true,
        testMode: false,
        ...envelope.settings || {}
      },
      transactions: {
        pendingReset: null,
        ...envelope.transactions || {}
      }
    };
  }
  function migrateEnvelope(envelope) {
    if (!envelope || !envelope.run) return envelope;
    if (envelope.schemaVersion !== 1 && envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) return envelope;
    const migrated = normalizeEnvelope({ ...envelope, schemaVersion: CURRENT_SCHEMA_VERSION });
    if (migrated.rulesetVersion === "timeline1-v2-reconciled") {
      migrated.rulesetVersion = "timeline1-v3-full";
      migrated.run.rulesetVersion = "timeline1-v3-full";
      migrated.run.migrationNotice = "T1-0: event engine added; progression and resources are unchanged.";
    }
    if (migrated.rulesetVersion === "timeline1-v3-full") {
      rehydrateCapacityEffects(migrated.run);
      migrated.rulesetVersion = "timeline1-v4-caps";
      migrated.run.rulesetVersion = "timeline1-v4-caps";
      migrated.run.migrationNotice = "T1-1: resource storage limits and capacity buildings restored.";
    }
    if (migrated.rulesetVersion === "timeline1-v4-caps") {
      migrateCellularEnergyToAtp(migrated.run);
      migrated.rulesetVersion = "timeline1-v5-atp";
      migrated.run.rulesetVersion = "timeline1-v5-atp";
      migrated.run.migrationNotice = "T1-2: cellular Energy renamed to ATP; stored amounts and capacity upgrades migrated.";
    }
    if (migrated.rulesetVersion === "timeline1-v5-atp") {
      rehydrateCapacityEffects(migrated.run);
      migrated.rulesetVersion = "timeline1-v6-cell-balance";
      migrated.run.rulesetVersion = "timeline1-v6-cell-balance";
      migrated.run.migrationNotice = "T1-3: Cell-era costs rebalanced; Organelles expands Biomass storage for C06.";
    }
    if (migrated.rulesetVersion === "timeline1-v6-cell-balance") {
      migrateToStorageGates(migrated.run);
      migrated.rulesetVersion = "timeline1-v7-storage-gates";
      migrated.run.rulesetVersion = "timeline1-v7-storage-gates";
      migrated.run.migrationNotice = "T1-4: storage gates restored; only storage buildings expand resource caps.";
    }
    if (migrated.rulesetVersion === "timeline1-v7-storage-gates") {
      migrated.run.economy ||= { deficits: {} };
      migrated.run.economy.deficits ||= {};
      migrated.rulesetVersion = "timeline1-v8-civilization-chains";
      migrated.run.rulesetVersion = "timeline1-v8-civilization-chains";
      migrated.run.migrationNotice = "T1-5: civilization jobs, Food maintenance and industrial Power deficits restored.";
    }
    if (migrated.rulesetVersion === "timeline1-v8-civilization-chains") {
      migrated.run.crisis ??= null;
      migrated.rulesetVersion = "timeline1-v9-full-t1-route";
      migrated.run.rulesetVersion = "timeline1-v9-full-t1-route";
      migrated.run.migrationNotice = "T1-6: full Tribe \u2192 Atomic route, crisis phases and Ash ending added.";
    }
    if (migrated.rulesetVersion === "timeline1-v9-full-t1-route") {
      migrateLegacyAdaptationPoints(migrated.run);
      migrated.rulesetVersion = "timeline1-v10-adaptation-repair";
      migrated.run.rulesetVersion = "timeline1-v10-adaptation-repair";
      migrated.run.migrationNotice = "T1-7: Adaptation Points restored for completed Cell Coordination.";
    }
    if (migrated.rulesetVersion === "timeline1-v10-adaptation-repair") {
      migrated.rulesetVersion = "timeline1-v11-branch-cost-fix";
      migrated.run.rulesetVersion = "timeline1-v11-branch-cost-fix";
      migrated.run.migrationNotice = "T1-1 fix: B02A-D and N02A-C no longer cost less than the core node that unlocks them.";
    }
    return migrated;
  }

  // src/chronicles/save/repository.js
  var SAVE_KEYS = Object.freeze({
    primary: "chronicles_evolution",
    backup: "chronicles_evolution.backup",
    pending: "chronicles_evolution.pending"
  });
  var SAVE_FORMAT = "chronicles-evolution-save";
  var OLD_RULESET_RESTART_VERSIONS = /* @__PURE__ */ new Set(["timeline1-v1"]);
  function nowIso(clock) {
    return new Date(clock ? clock.getNow() : Date.now()).toISOString();
  }
  function createSaveEnvelope(state, options = {}) {
    const persisted = toPersistedGameState(state);
    const timestamp = nowIso(options.clock);
    return normalizeEnvelope({
      format: SAVE_FORMAT,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      saveRevision: options.saveRevision || 1,
      gameVersion: options.gameVersion || "1.4.10",
      rulesetVersion: state.run.rulesetVersion,
      createdAt: options.createdAt || timestamp,
      updatedAt: timestamp,
      ...persisted,
      transactions: {
        pendingReset: null,
        ...options.transactions || {}
      }
    });
  }
  function parseEnvelope(payload, codec = jsonCodec) {
    try {
      const decoded = codec.decode(payload);
      const envelope = JSON.parse(decoded);
      return { ok: true, envelope: migrateEnvelope(envelope) };
    } catch (error) {
      return { ok: false, reason: "PARSE_FAILED", error };
    }
  }
  function validateEnvelope(envelope) {
    const errors = [];
    if (!envelope || typeof envelope !== "object") {
      return { ok: false, errors: ["Save envelope must be an object"] };
    }
    if (envelope.format !== SAVE_FORMAT) {
      errors.push("Invalid save format");
    }
    if (envelope.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      errors.push(`Unsupported schema version ${envelope.schemaVersion}`);
    }
    if (envelope.rulesetVersion !== ruleset.version) {
      errors.push(`Unsupported ruleset version ${envelope.rulesetVersion}`);
    }
    if (!Number.isInteger(envelope.saveRevision) || envelope.saveRevision < 1) {
      errors.push("Save revision must be a positive integer");
    }
    if (!envelope.createdAt || !envelope.updatedAt) {
      errors.push("Save envelope must include createdAt and updatedAt");
    }
    if (!envelope.transactions || !Object.prototype.hasOwnProperty.call(envelope.transactions, "pendingReset")) {
      errors.push("Save envelope must include transactions.pendingReset");
    }
    const stateValidation = validateGameState(
      { run: envelope.run, meta: envelope.meta, settings: envelope.settings, session: { dirty: false } },
      ruleset
    );
    errors.push(...stateValidation.errors);
    return { ok: errors.length === 0, errors };
  }
  function createSaveRepository({ storage: storage2, codec = jsonCodec, clock } = {}) {
    if (!storage2) {
      throw new Error("SaveRepository requires a StoragePort");
    }
    function encodeEnvelope(envelope) {
      return codec.encode(JSON.stringify(envelope));
    }
    function readKey(key) {
      const payload = storage2.get(key);
      if (payload === null) {
        return { ok: false, reason: "MISSING" };
      }
      const parsed = parseEnvelope(payload, codec);
      if (!parsed.ok) {
        return parsed;
      }
      if (OLD_RULESET_RESTART_VERSIONS.has(parsed.envelope?.rulesetVersion)) {
        return { ok: false, reason: "OLD_RULESET_RESTART_REQUIRED", envelope: parsed.envelope };
      }
      const validation = validateEnvelope(parsed.envelope);
      if (!validation.ok) {
        return { ok: false, reason: "VALIDATION_FAILED", errors: validation.errors };
      }
      return { ok: true, envelope: parsed.envelope };
    }
    return {
      loadOrCreate(options = {}) {
        const loadedSlots = [SAVE_KEYS.primary, SAVE_KEYS.pending, SAVE_KEYS.backup].map((key) => ({ key, loaded: readKey(key) }));
        const candidates = loadedSlots.filter((candidate) => candidate.loaded.ok);
        const primary = candidates.find((candidate) => candidate.key === SAVE_KEYS.primary);
        const recovered = primary || candidates.filter((candidate) => candidate.key !== SAVE_KEYS.primary).sort((a, b) => b.loaded.envelope.saveRevision - a.loaded.envelope.saveRevision)[0];
        if (recovered) {
          return {
            ok: true,
            state: {
              run: recovered.loaded.envelope.run,
              meta: recovered.loaded.envelope.meta,
              settings: recovered.loaded.envelope.settings,
              session: { dirty: false, lastEvents: [] }
            },
            envelope: recovered.loaded.envelope,
            sourceKey: recovered.key
          };
        }
        const oldRuleset = loadedSlots.filter((candidate) => candidate.loaded.reason === "OLD_RULESET_RESTART_REQUIRED").sort((a, b) => (b.loaded.envelope.saveRevision || 0) - (a.loaded.envelope.saveRevision || 0))[0];
        if (oldRuleset) {
          const state = createInitialGameState();
          state.meta = normalizeEnvelope(oldRuleset.loaded.envelope).meta;
          state.settings = normalizeEnvelope(oldRuleset.loaded.envelope).settings;
          return {
            ok: true,
            state,
            created: true,
            oldRulesetRestarted: true,
            previousRulesetVersion: oldRuleset.loaded.envelope.rulesetVersion,
            sourceKey: oldRuleset.key
          };
        }
        const damagedSlots = [SAVE_KEYS.primary, SAVE_KEYS.pending, SAVE_KEYS.backup].map((key) => ({ key, loaded: readKey(key) })).filter((candidate) => candidate.loaded.reason !== "MISSING").map((candidate) => ({
          key: candidate.key,
          reason: candidate.loaded.reason,
          errors: candidate.loaded.errors || []
        }));
        if (damagedSlots.length > 0 && !options.startFreshAfterCorruption) {
          return { ok: false, reason: "RECOVERY_REQUIRED", damagedSlots };
        }
        return { ok: true, state: createInitialGameState(), created: true };
      },
      startFreshAfterCorruption() {
        return this.loadOrCreate({ startFreshAfterCorruption: true });
      },
      save(state, options = {}) {
        const current = readKey(SAVE_KEYS.primary);
        const saveRevision = current.ok ? current.envelope.saveRevision + 1 : 1;
        const envelope = createSaveEnvelope(state, {
          ...options,
          clock,
          saveRevision,
          createdAt: current.ok ? current.envelope.createdAt : void 0
        });
        const validation = validateEnvelope(envelope);
        if (!validation.ok) {
          return { ok: false, reason: "VALIDATION_FAILED", errors: validation.errors };
        }
        const encoded = encodeEnvelope(envelope);
        storage2.set(SAVE_KEYS.pending, encoded);
        const pending = readKey(SAVE_KEYS.pending);
        if (!pending.ok || pending.envelope.saveRevision !== envelope.saveRevision) {
          return { ok: false, reason: "PENDING_VERIFY_FAILED" };
        }
        const primaryPayload = storage2.get(SAVE_KEYS.primary);
        if (primaryPayload) {
          storage2.set(SAVE_KEYS.backup, primaryPayload);
        }
        storage2.set(SAVE_KEYS.primary, encoded);
        const primary = readKey(SAVE_KEYS.primary);
        if (!primary.ok || primary.envelope.saveRevision !== envelope.saveRevision) {
          return { ok: false, reason: "PRIMARY_VERIFY_FAILED" };
        }
        storage2.remove(SAVE_KEYS.pending);
        state.session.dirty = false;
        return { ok: true, envelope };
      }
    };
  }

  // src/chronicles/domain/services/eras.js
  function remapJobsForEra(state, eraId, ruleset2) {
    const assignments = state.run.population?.assignments;
    if (!assignments) return;
    const remapped = {};
    for (const [jobId, count] of Object.entries(assignments)) {
      if (!count) continue;
      const oldJob = ruleset2.jobs.find((job) => job.id === jobId);
      if (!oldJob) continue;
      const replacement = ruleset2.jobs.find((job) => job.eraIds?.includes(eraId) && job.lineage === oldJob.lineage);
      if (replacement) remapped[replacement.id] = (remapped[replacement.id] || 0) + count;
    }
    state.run.population.assignments = remapped;
  }
  function applyEraTransition(state, nextEraId, ruleset2, ports) {
    if (!nextEraId || state.run.eraId === nextEraId) {
      return [];
    }
    const era = ruleset2.eras.find((candidate) => candidate.id === nextEraId);
    if (!era) {
      return [];
    }
    const previousEraId = state.run.eraId;
    state.run.eraId = nextEraId;
    state.run.chapterId = era.chapterId;
    initializePopulation(state, era);
    remapJobsForEra(state, nextEraId, ruleset2);
    if (nextEraId === "ATOMIC" && !state.run.crisis) {
      state.run.crisis = createInitialCrisisState();
    }
    const startEvents = Object.entries(era.civilizationStart?.resources || {}).flatMap(([resourceId, amount]) => {
      return addResource(state, resourceId, amount, ruleset2, ports);
    });
    return [
      createDomainEvent("era_changed", { previousEraId, eraId: nextEraId }, state, ports),
      ...nextEraId === "ATOMIC" ? [createDomainEvent("crisis_started", { stability: state.run.crisis?.stability ?? 100 }, state, ports)] : [],
      ...startEvents
    ];
  }

  // src/chronicles/save/resetTransaction.js
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function formatTimelineId(timelineId) {
    return String(timelineId).padStart(3, "0");
  }
  function createCanonicalResetTransactionId({ timelineId, endingId }) {
    return `timeline_${formatTimelineId(timelineId)}_ending_${endingId}`;
  }
  function prepareResetTransaction(state, input = {}) {
    const endingId = input.endingId || "ENDING_ASH";
    const createdAtSimulationMs = input.createdAtSimulationMs ?? state.run.clock.simulationMs;
    const id = input.id || input.transactionId || createCanonicalResetTransactionId({
      timelineId: state.run.timelineId,
      endingId
    });
    return {
      id,
      transactionId: id,
      status: "prepared",
      source: {
        runId: state.run.id,
        timelineId: state.run.timelineId,
        endingId
      },
      closedRunId: state.run.id,
      timelineId: state.run.timelineId,
      endingId,
      createdAtSimulationMs,
      reward: clone(input.reward || {}),
      chronicleRecord: input.chronicleRecord ? clone(input.chronicleRecord) : null
    };
  }
  function applyPreparedResetTransaction(state, transaction, options = {}) {
    if (!transaction || transaction.status !== "prepared") {
      return { ok: false, reason: "RESET_TRANSACTION_NOT_PREPARED" };
    }
    const meta = clone(state.meta);
    const settings = clone(state.settings);
    meta.appliedTransactions = Array.isArray(meta.appliedTransactions) ? meta.appliedTransactions : [];
    const alreadyApplied = meta.appliedTransactions.includes(transaction.id);
    if (!alreadyApplied) {
      if (Number.isFinite(transaction.reward?.archiveFragments)) {
        meta.archiveFragments = (meta.archiveFragments || 0) + transaction.reward.archiveFragments;
      }
      if (transaction.chronicleRecord) {
        const chronicle = Array.isArray(meta.chronicle) ? meta.chronicle : [];
        if (!chronicle.some((record) => record.transactionId === transaction.id)) {
          chronicle.push({ ...clone(transaction.chronicleRecord), transactionId: transaction.id });
        }
        meta.chronicle = chronicle;
      }
      meta.appliedTransactions.push(transaction.id);
    }
    const nextState = createInitialGameState({
      ruleset: options.ruleset || ruleset,
      runId: options.nextRunId || `${transaction.source.runId}:next`
    });
    nextState.meta = meta;
    nextState.settings = settings;
    nextState.session.dirty = true;
    return { ok: true, state: nextState, transaction, alreadyApplied };
  }

  // src/chronicles/domain/commands.js
  function ok(state, events2) {
    state.session.dirty = true;
    state.session.lastEvents = events2;
    return { ok: true, events: events2 };
  }
  function withGoalEvaluation(state, ruleset2, events2, ports) {
    const goalEvents = evaluateGoals(state, ruleset2, ports);
    const queuedEvents = goalEvents.flatMap((event) => {
      if (event.type === "goal_completed") {
        return queueEventsForGoal(state, ruleset2, event.payload.goalId, ports);
      }
      return [];
    });
    return [...events2, ...goalEvents, ...queuedEvents];
  }
  function rejected(reason, details = {}) {
    return { ok: false, reason, details, events: [] };
  }
  function dispatchCommand(state, ruleset2, command, ports = {}) {
    if (!state.run || state.run.lifecycle !== "active" && command.type !== "ARCHIVE_RESET") {
      if (command.type === "TICK") {
        return { ok: true, events: [], frozen: true };
      }
      return rejected("RUN_NOT_ACTIVE");
    }
    switch (command.type) {
      case "ADD_RESOURCE": {
        const events2 = addResource(state, command.resourceId, command.amount, ruleset2, ports);
        return ok(state, withGoalEvaluation(state, ruleset2, events2, ports));
      }
      case "USE_MANUAL_PROCESS":
        return manualProcess(state, ruleset2, command, ports);
      case "BUY_PRODUCER":
        return buyProducer(state, ruleset2, command.producerId, ports);
      case "BUY_NODE":
        return buyNode(state, ruleset2, command.nodeId, ports);
      case "RESOLVE_EVENT":
        return resolvePendingEvent(state, ruleset2, command, ports);
      case "BUY_BUILDING":
        return buyBuilding(state, ruleset2, command.buildingId, ports);
      case "ASSIGN_JOB":
        return assignJob(state, ruleset2, command.jobId, command.amount, ports);
      case "ARCHIVE_RESET":
        return archiveReset(state, ruleset2, command, ports);
      case "TICK": {
        state.run.clock.simulationMs += command.deltaMs;
        state.run.clock.activeMs += command.deltaMs;
        const events2 = [createDomainEvent("tick", { deltaMs: command.deltaMs }, state, ports)];
        return ok(state, events2);
      }
      default:
        return rejected("UNKNOWN_COMMAND", { type: command.type });
    }
  }
  function assignJob(state, ruleset2, jobId, amount, ports) {
    const job = createRulesetIndexes(ruleset2).jobs[jobId];
    if (!job) return rejected("UNKNOWN_JOB", { jobId });
    if (!prerequisitesMet(state, job)) return rejected("JOB_UNAVAILABLE", { jobId, eraId: state.run.eraId });
    if (!state.run.population) return rejected("POPULATION_UNAVAILABLE");
    if (!Number.isInteger(amount) || amount < 0) return rejected("INVALID_ASSIGNMENT", { jobId, amount });
    const assignments = state.run.population.assignments || (state.run.population.assignments = {});
    const current = assignments[jobId] || 0;
    const assignedElsewhere = Object.values(assignments).reduce((sum, value) => sum + value, 0) - current;
    if (assignedElsewhere + amount > state.run.population.current + 1e-6) {
      return rejected("POPULATION_ASSIGNMENT_EXCEEDED", {
        jobId,
        available: Math.floor(state.run.population.current - assignedElsewhere)
      });
    }
    assignments[jobId] = amount;
    return ok(state, [createDomainEvent("job_assigned", { jobId, previous: current, amount }, state, ports)]);
  }
  function archiveReset(state, ruleset2, command, ports) {
    if (state.run.lifecycle !== "ended" || state.run.ending?.id !== "ENDING_ASH") {
      return rejected("ENDING_NOT_READY_FOR_ARCHIVE");
    }
    const nodeCount = Object.keys(state.run.nodes.completed || {}).length;
    const peakPopulation = state.run.population?.peak || 0;
    const stabilityBonus = Math.max(0, Math.min(3, Math.floor((state.run.crisis?.minStability || 0) / 30)));
    const archiveFragments = Math.max(14, Math.min(18, 14 + Math.floor(nodeCount / 15) + (peakPopulation >= 60 ? 1 : 0) + stabilityBonus));
    const transaction = prepareResetTransaction(state, {
      transactionId: command.transactionId,
      endingId: "ENDING_ASH",
      reward: { archiveFragments },
      chronicleRecord: {
        id: `${state.run.id}:ending`,
        kind: "ending",
        endingId: "ENDING_ASH",
        subtype: state.run.ending.subtype,
        durationMs: state.run.clock.activeMs,
        peakPopulation,
        minimumStability: state.run.crisis?.minStability ?? 100,
        summary: "Timeline #1 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D: \u041F\u0435\u043F\u0435\u043B \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u0410\u0440\u0445\u0438\u0432\u0435."
      }
    });
    const applied = applyPreparedResetTransaction(state, transaction, { ruleset: ruleset2, nextRunId: command.nextRunId });
    if (!applied.ok) return applied;
    Object.assign(state, applied.state);
    return ok(state, [createDomainEvent("archive_reset_completed", { transactionId: transaction.id, archiveFragments, alreadyApplied: applied.alreadyApplied }, state, ports)]);
  }
  function manualProcess(state, ruleset2, command, ports) {
    const result = useManualProcess(state, ruleset2, command.processId, ports, {
      rewardMultiplier: command.rewardMultiplier
    });
    if (!result.ok) {
      return result;
    }
    return ok(state, withGoalEvaluation(state, ruleset2, result.events, ports));
  }
  function buyProducer(state, ruleset2, producerId, ports) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const producer = indexes2.producers[producerId];
    if (!producer) {
      return rejected("UNKNOWN_PRODUCER", { producerId });
    }
    if (!producer.unlocksAtStart && !prerequisitesMet(state, producer)) {
      return rejected("PREREQUISITES_NOT_MET", { producerId });
    }
    const currentCount = state.run.producers[producerId]?.count || 0;
    const cost = selectProducerPrice(state, ruleset2, producerId);
    const payment = payCost(state, cost, ruleset2, ports);
    if (!payment.ok) {
      return payment;
    }
    state.run.producers[producerId] = { count: currentCount + 1 };
    const events2 = [
      ...payment.events,
      createDomainEvent("producer_bought", { producerId, newCount: currentCount + 1, cost }, state, ports)
    ];
    return ok(state, withGoalEvaluation(state, ruleset2, events2, ports));
  }
  function buyNode(state, ruleset2, nodeId, ports, options = {}) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const node = indexes2.nodes[nodeId];
    if (!node) {
      return rejected("UNKNOWN_NODE", { nodeId });
    }
    if (state.run.nodes.completed[nodeId]) {
      return rejected("NODE_ALREADY_COMPLETED", { nodeId });
    }
    if (!prerequisitesMet(state, node) || !branchAvailable(state, ruleset2, node)) {
      return rejected("PREREQUISITES_NOT_MET", { nodeId });
    }
    if (!options.fromEvent && eventBlocksNode(state, ruleset2, node)) {
      return rejected("BLOCKED_BY_EVENT", { nodeId, eventId: state.run.events.pendingId });
    }
    const populationCheck = assertPopulationRequirement(state, node);
    if (!populationCheck.ok) {
      return populationCheck;
    }
    const apCost = node.adaptationPointCost || 0;
    if (apCost > (state.run.adaptation?.points || 0)) {
      return rejected("INSUFFICIENT_ADAPTATION_POINTS", { nodeId, required: apCost, available: state.run.adaptation?.points || 0 });
    }
    const cost = selectNodeCost(state, ruleset2, nodeId);
    const payment = payCost(state, cost, ruleset2, ports);
    if (!payment.ok) {
      return payment;
    }
    state.run.nodes.completed[nodeId] = { completedAtMs: state.run.clock.simulationMs };
    if (apCost) {
      state.run.adaptation.points -= apCost;
      state.run.adaptation.spentTotal += apCost;
      state.run.adaptation.selectedOptionalNodes.push(nodeId);
    }
    if (node.branchGroup && !state.run.nodes.selectedBranchByGroup[node.branchGroup]) {
      state.run.nodes.selectedBranchByGroup[node.branchGroup] = nodeId;
    }
    applyEffects(state, node.effects, { sourceType: "node", sourceId: nodeId });
    const eraEvents = applyEraTransition(state, node.transition, ruleset2, ports);
    const events2 = [
      ...payment.events,
      createDomainEvent("node_completed", { nodeId, cost }, state, ports),
      ...eraEvents
    ];
    if (nodeId === "M06") {
      events2.push(createDomainEvent("cell_reached", { nodeId }, state, ports));
    }
    events2.push(...queueEventsForNode(state, ruleset2, nodeId, ports));
    return ok(state, withGoalEvaluation(state, ruleset2, events2, ports));
  }
  function resolvePendingEvent(state, ruleset2, command, ports) {
    const result = resolveEvent(state, ruleset2, command.eventId, command.choiceId, ports, {
      applyPurchaseNode(nodeId) {
        return buyNode(state, ruleset2, nodeId, ports, { fromEvent: true });
      }
    });
    if (!result.ok) return result;
    return ok(state, result.events);
  }
  function buyBuilding(state, ruleset2, buildingId, ports) {
    const indexes2 = createRulesetIndexes(ruleset2);
    const building = indexes2.buildings[buildingId];
    if (!building) {
      return rejected("UNKNOWN_BUILDING", { buildingId });
    }
    if (!prerequisitesMet(state, building)) {
      return rejected("PREREQUISITES_NOT_MET", { buildingId });
    }
    const currentCount = state.run.buildings[buildingId]?.count || 0;
    if (building.maxCount != null && currentCount >= building.maxCount) {
      return rejected("MAX_COUNT_REACHED", { buildingId });
    }
    const cost = scaleCost(building.baseCost, building.growth, currentCount);
    const payment = payCost(state, cost, ruleset2, ports);
    if (!payment.ok) {
      return payment;
    }
    state.run.buildings[buildingId] = { count: currentCount + 1 };
    applyEffects(state, building.effects, { sourceType: "building", sourceId: `${buildingId}:${currentCount + 1}` });
    const events2 = [
      ...payment.events,
      createDomainEvent("building_bought", { buildingId, newCount: currentCount + 1, cost }, state, ports)
    ];
    return ok(state, withGoalEvaluation(state, ruleset2, events2, ports));
  }

  // src/chronicles/domain/engine.js
  function evaluateGoalsWithQueuedEvents(state, ruleset2, ports) {
    const goalEvents = evaluateGoals(state, ruleset2, ports);
    const queuedEvents = goalEvents.flatMap((event) => {
      if (event.type === "goal_completed") {
        return queueEventsForGoal(state, ruleset2, event.payload.goalId, ports);
      }
      return [];
    });
    return [...goalEvents, ...queuedEvents];
  }
  function createChroniclesEngine(options = {}) {
    const ruleset2 = options.ruleset || ruleset;
    const ports = options.ports || {};
    const state = options.state || createInitialGameState({ ...options, ruleset: ruleset2 });
    const initialGoalEvents = evaluateGoalsWithQueuedEvents(state, ruleset2, ports);
    state.session.lastEvents = initialGoalEvents;
    return {
      state,
      ruleset: ruleset2,
      dispatch(command) {
        return dispatchCommand(state, ruleset2, command, ports);
      },
      tick(deltaMs) {
        const tickResult = dispatchCommand(state, ruleset2, { type: "TICK", deltaMs }, ports);
        const productionResult = applyProduction(state, ruleset2, deltaMs, ports);
        const populationResult = applyPopulationFoodLoop(state, ruleset2, deltaMs, ports);
        const crisisEvents = advanceCrisis(state, ruleset2, deltaMs, ports);
        const goalEvents = evaluateGoalsWithQueuedEvents(state, ruleset2, ports);
        const deckEvents = queueDueDeckEvents(state, ruleset2, ports);
        const events2 = [...tickResult.events, ...productionResult.events, ...populationResult.events, ...crisisEvents, ...goalEvents, ...deckEvents];
        state.session.lastEvents = events2;
        return { ok: tickResult.ok, frozen: tickResult.frozen || false, rates: productionResult.rates, events: events2 };
      }
    };
  }

  // src/chronicles/dev/debugApi.js
  var DEV_TIME_SCALES = Object.freeze([1, 5, 20, 100]);
  function createDebugApi(options = {}) {
    const engine2 = options.engine || createChroniclesEngine(options);
    const devEnabled = options.dev !== false && options.environment !== "production";
    const indexes2 = createRulesetIndexes(engine2.ruleset);
    function assertDevEnabled() {
      if (!devEnabled) {
        throw new Error("Debug API is disabled outside development builds");
      }
    }
    return {
      engine: engine2,
      timeScales: DEV_TIME_SCALES,
      setTimeScale(scale) {
        assertDevEnabled();
        if (!DEV_TIME_SCALES.includes(scale)) {
          return { ok: false, reason: "INVALID_TIME_SCALE", allowed: DEV_TIME_SCALES };
        }
        engine2.state.settings.devTimeScale = scale;
        options.ports?.clock?.setTimeScale?.(scale);
        return { ok: true, scale };
      },
      grant(resourceId, amount) {
        assertDevEnabled();
        return engine2.dispatch({ type: "ADD_RESOURCE", resourceId, amount });
      },
      toggleTestMode() {
        assertDevEnabled();
        engine2.state.settings.testMode = !engine2.state.settings.testMode;
        engine2.state.session.dirty = true;
        return { ok: true, testMode: engine2.state.settings.testMode };
      },
      jumpToEra(eraId) {
        assertDevEnabled();
        const era = indexes2.eras[eraId];
        if (!era) {
          return { ok: false, reason: "UNKNOWN_ERA", eraId };
        }
        engine2.state.run.eraId = era.id;
        engine2.state.run.chapterId = era.chapterId;
        for (const resourceId of era.activeResources) {
          if (!engine2.state.run.resources[resourceId]) {
            engine2.state.run.resources[resourceId] = { amount: 0 };
          }
        }
        engine2.state.session.dirty = true;
        return { ok: true, eraId: era.id, chapterId: era.chapterId };
      },
      triggerEvent(eventId, triggerOptions = {}) {
        assertDevEnabled();
        const queued = queueEvent(engine2.state, engine2.ruleset, eventId, options.ports, {
          force: triggerOptions.force === true || options.forceEvents === true
        });
        if (!queued.ok) {
          return queued;
        }
        engine2.state.session.dirty = true;
        return queued;
      },
      manualDevReset(resetOptions = {}) {
        assertDevEnabled();
        const previousMeta = engine2.state.meta;
        const previousSettings = engine2.state.settings;
        const nextState = createInitialGameState({
          ruleset: engine2.ruleset,
          runId: resetOptions.runId || "run_dev_reset"
        });
        engine2.state.run = nextState.run;
        engine2.state.meta = previousMeta;
        engine2.state.settings = previousSettings;
        engine2.state.session.dirty = true;
        engine2.state.session.lastEvents = [];
        return { ok: true, runId: engine2.state.run.id };
      },
      dumpState() {
        assertDevEnabled();
        return JSON.parse(JSON.stringify(engine2.state));
      },
      buyNode(nodeId) {
        assertDevEnabled();
        return engine2.dispatch({ type: "BUY_NODE", nodeId });
      },
      ruleset
    };
  }

  // src/chronicles/save/autosave.js
  function createAutosaveController({ repository: repository2, engine: engine2, intervalMs = 5e3, clock } = {}) {
    if (!repository2) {
      throw new Error("AutosaveController requires a save repository");
    }
    if (!engine2) {
      throw new Error("AutosaveController requires an engine");
    }
    let elapsedMs = 0;
    let lastResult = null;
    function autosave2(reason = "manual") {
      if (!engine2.state.settings.autosave || !engine2.state.session.dirty) {
        return { ok: true, skipped: true, reason };
      }
      lastResult = repository2.save(engine2.state, { clock, autosaveReason: reason });
      if (!lastResult.ok) {
        engine2.state.session.saveError = { reason: lastResult.reason, atMs: engine2.state.run.clock.simulationMs };
      } else {
        delete engine2.state.session.saveError;
      }
      return lastResult;
    }
    return {
      tick(deltaMs) {
        elapsedMs += deltaMs;
        if (elapsedMs < intervalMs) {
          return { ok: true, skipped: true, reason: "interval" };
        }
        elapsedMs = 0;
        return autosave2("interval");
      },
      flush(reason = "flush") {
        elapsedMs = 0;
        return autosave2(reason);
      },
      getLastResult() {
        return lastResult;
      }
    };
  }

  // src/chronicles/ui/runtime.js
  function createPlayableRuntime({ repository: repository2, ruleset: ruleset2 = ruleset, dev = false, loadResult = null, ports = {} }) {
    const loaded = loadResult || repository2.loadOrCreate();
    if (!loaded.ok) {
      return {
        mode: loaded.reason === "RECOVERY_REQUIRED" ? "recovery_required" : "load_failed",
        loaded,
        diagnostics: loaded.damagedSlots || [],
        startFreshAfterCorruption() {
          const fresh = repository2.startFreshAfterCorruption();
          if (!fresh.ok) {
            return { ok: false, loaded: fresh };
          }
          return { ok: true, runtime: createPlayableRuntime({ repository: repository2, ruleset: ruleset2, dev, loadResult: fresh, ports }) };
        }
      };
    }
    const engine2 = createChroniclesEngine({ ruleset: ruleset2, state: loaded.state, ports });
    const autosave2 = createAutosaveController({ repository: repository2, engine: engine2, intervalMs: 5e3 });
    const debugApi2 = dev ? createDebugApi({ dev: true, engine: engine2, ports }) : null;
    return {
      mode: "playable",
      loaded,
      engine: engine2,
      autosave: autosave2,
      debugApi: debugApi2,
      ruleset: ruleset2,
      dev
    };
  }
  function routeCtaFocus(cta, indexes2) {
    const targetId = cta?.targetId || null;
    if (!targetId) {
      return { activeView: "world", focusedEntityId: null };
    }
    if (indexes2.nodes[targetId]) {
      return { activeView: "evolution", focusedEntityId: targetId };
    }
    if (indexes2.producers[targetId] || indexes2.manualProcesses[targetId]) {
      return { activeView: "world", focusedEntityId: targetId };
    }
    return { activeView: "world", focusedEntityId: targetId };
  }

  // src/chronicles/ui/app.js
  var DEV = true;
  var ROOT_ID = "chronicles-root";
  var EVOLUTION_NODES = ruleset.nodes.map((node) => node.id);
  var RESOURCE_NAMES = {
    rna: "RNA",
    dna: "DNA",
    biomass: "Biomass",
    atp: "ATP",
    food: "Food",
    materials: "Materials",
    knowledge: "Knowledge",
    power: "Power"
  };
  var NODE_NAMES = {
    M01: "Stable RNA",
    M02: "Self Replication",
    M03: "DNA Synthesis",
    M04: "Error Correction",
    M05: "Membrane",
    M06: "Cell",
    C01: "Metabolism",
    C02A: "Absorption",
    C02B: "Symbiosis",
    C02C: "Shell",
    C03: "Protein Synthesis",
    C04A: "Photosynthesis",
    C04B: "Chemosynthesis",
    C04C: "Efficient Digestion",
    C05: "Organelles",
    C06: "Cell Coordination",
    B02A: "Mobility",
    B02B: "Sensory Cells",
    B02C: "Digestion",
    B02D: "Structural Tissue",
    C07: "Multicellularity",
    B03: "Tissue Specialization",
    B04: "Nervous Tissue",
    B05: "Nervous System",
    N03: "Neural Complexity",
    N05: "Proto-language",
    N07: "Sapience",
    N02A: "Solitary Strategy",
    N02B: "Social Behavior",
    N02C: "Object Manipulation",
    T01A: "Hunting Tradition",
    T01B: "Gathering Network",
    T01C: "Knowledge Ritual",
    T02: "Fire",
    T03: "Shared Survival",
    T05: "Tribe",
    T07: "Seed Selection",
    T08: "Agriculture",
    T09: "Permanent Settlement",
    T10: "Writing",
    T11: "Organized Labor",
    T12: "City",
    T13: "Mechanization",
    T14: "Steam and Rail",
    T15: "Electrification",
    T16: "Electrical Grid",
    T17: "Research Institutions",
    T18: "Global Connection",
    A01: "Scientific Method",
    A02: "Atomic Theory",
    A03: "Reactor/Lab Program",
    A04: "Atomic Age"
  };
  var PRODUCER_NAMES = {
    PROC_PRIMORDIAL_REACTION: "Primordial Reaction",
    PROC_RNA_REPLICATION: "RNA Replication",
    PROC_DNA_SYNTHESIS: "DNA Synthesis",
    PROC_BIOMASS_UPTAKE: "Biomass Uptake",
    PROC_RESPIRATION: "Respiration"
  };
  var BUILDING_NAMES = {
    BLD_MEMBRANE_STORE: "Membrane Layers",
    BLD_GENETIC_STORE: "Genetic Storage",
    BLD_BIOMASS_STORE: "Biomass Reserve",
    BLD_ATP_STORE: "ATP Reserve",
    BLD_FOOD_STORE: "Food Store",
    BLD_MATERIALS_STORE: "Materials Store",
    BLD_KNOWLEDGE_ARCHIVE: "Knowledge Archive",
    BLD_POWER_STORE: "Power Reserve",
    BLD_FIELD: "Field",
    BLD_HOUSE: "House",
    BLD_WORKSHOP: "Workshop",
    BLD_SCHOOL: "School",
    BLD_MARKET: "Market",
    BLD_FACTORY: "Factory",
    BLD_RAIL_HUB: "Rail Hub",
    BLD_GRID: "Electrical Grid",
    BLD_REACTOR_LAB: "Reactor/Lab"
  };
  var storage = createBrowserStorage();
  var repository = createSaveRepository({ storage });
  var runtime = createPlayableRuntime({ repository, ruleset, dev: DEV });
  var indexes = createRulesetIndexes(ruleset);
  var activeView = "world";
  var focusedEntityId = null;
  var lastTickAt = performance.now();
  var lastSaveMessage = runtime.mode === "playable" ? runtime.loaded.created ? "New run created" : "Save loaded" : "Recovery required";
  function engine() {
    return runtime.engine;
  }
  function autosave() {
    return runtime.autosave;
  }
  function debugApi() {
    return runtime.debugApi;
  }
  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "0";
    }
    if (value >= 1e3) {
      return value.toFixed(0);
    }
    if (value >= 100) {
      return value.toFixed(1);
    }
    return value.toFixed(2).replace(/\.?0+$/, "");
  }
  function formatCost(cost) {
    return Object.entries(cost).map(([resourceId, amount]) => `${formatNumber(amount)} ${RESOURCE_NAMES[resourceId] || resourceId}`).join(" + ");
  }
  function shortfallColor(resourceId, amount) {
    const current = engine().state.run.resources[resourceId]?.amount || 0;
    if (current >= amount) {
      return null;
    }
    const cap = calculateCap(engine().state, resourceId, ruleset);
    return amount > cap ? "red" : "lightcoral";
  }
  function formatWholeCost(cost) {
    return Object.entries(cost).map(([resourceId, amount]) => {
      const label = `${formatResourceAmount(amount)} ${RESOURCE_NAMES[resourceId] || resourceId}`;
      const color = shortfallColor(resourceId, amount);
      return color ? `<span style="color:${color}">${label}</span>` : label;
    }).join(" + ");
  }
  function formatNodeCost(node, cost) {
    const adaptationCost = node.adaptationPointCost ? `${node.adaptationPointCost} AP` : "";
    const resourceCost = formatWholeCost(cost);
    return [adaptationCost, resourceCost].filter(Boolean).join(" + ");
  }
  function nodePurchaseFailureMessage(result) {
    if (result.reason === "INSUFFICIENT_ADAPTATION_POINTS") {
      return `\u041D\u0443\u0436\u043D\u043E AP: ${result.details?.required || 0}; \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E: ${result.details?.available || 0}.`;
    }
    if (result.reason === "BLOCKED_BY_EVENT") {
      return "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0435.";
    }
    return `\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0443\u0437\u0435\u043B: ${result.reason || "UNKNOWN"}.`;
  }
  function phaseLabel() {
    if (engine().state.run.eraId !== "MOLECULAR" && engine().state.run.eraId !== "CELLULAR" && engine().state.run.eraId !== "MULTICELLULAR") {
      return engine().state.run.eraId.replaceAll("_", " ");
    }
    if (engine().state.run.nodes.completed.C06) return "Cell Coordination";
    if (engine().state.run.nodes.completed.C05) return "Organelles";
    if (engine().state.run.nodes.completed.C03) return "Protein Synthesis";
    if (engine().state.run.nodes.selectedBranchByGroup?.cell_identity_1) return NODE_NAMES[engine().state.run.nodes.selectedBranchByGroup.cell_identity_1];
    if (engine().state.run.nodes.completed.C01) return "Metabolism";
    if (engine().state.run.nodes.completed.M06) return "Cell";
    if (engine().state.run.nodes.completed.M05) return "Membrane";
    if (engine().state.run.nodes.completed.M03) return "DNA synthesis";
    if (engine().state.run.nodes.completed.M02) return "Self replication";
    if (engine().state.run.nodes.completed.M01) return "Stable RNA";
    return "Primordial";
  }
  function goalProgress(goal) {
    if (!goal) return "";
    if (goal.nodeId) {
      const node = indexes.nodes[goal.nodeId];
      const lines = Object.entries(selectNodeCost(engine().state, ruleset, goal.nodeId)).map(([resourceId, amount]) => {
        const current = engine().state.run.resources[resourceId]?.amount || 0;
        const line = `${RESOURCE_NAMES[resourceId] || resourceId}: ${formatResourceAmount(Math.min(current, amount))} / ${formatResourceAmount(amount)}`;
        const color = shortfallColor(resourceId, amount);
        return color ? `<span style="color:${color}">${line}</span>` : line;
      });
      if (node?.cognitionMin != null) {
        const cognition = selectCognition(engine().state, ruleset);
        lines.push(`Cognition: ${formatNumber(cognition.value)} / ${cognition.max}`);
      }
      return lines.join("<br>");
    }
    const cognitionCondition = goal.conditions?.find((condition) => condition.type === "cognition_at_least");
    if (cognitionCondition) {
      const cognition = selectCognition(engine().state, ruleset);
      return `Cognition: ${formatNumber(cognition.value)} / ${cognitionCondition.value}`;
    }
    return goal.completed ? "Complete" : "In progress";
  }
  function goalEta(goal) {
    if (!goal?.nodeId) {
      return "";
    }
    const status = selectNodeStatus(engine().state, ruleset, goal.nodeId);
    const cost = selectNodeCost(engine().state, ruleset, goal.nodeId);
    return etaText(status, cost);
  }
  function renderResources() {
    return selectVisibleResources(engine().state, ruleset).map(
      (resource) => `<div class="resource-row">
        <span>${RESOURCE_NAMES[resource.id] || resource.id}</span>
        <strong>${formatResourceAmount(resource.amount)} / ${formatResourceAmount(resource.cap)}</strong>
        <small>${resource.perSecond > 0 ? "+" : ""}${formatNumber(resource.perSecond)}/s</small>
      </div>`
    ).join("");
  }
  function renderObjective() {
    const goal = selectCurrentGoal(engine().state, ruleset);
    const sideGoals = selectSideGoals(engine().state, ruleset);
    if (!goal) {
      return '<section class="panel objective"><h2>Objective</h2><p>No active objective.</p></section>';
    }
    const goalState = goal.state;
    const hint = goalState.hintShownAtMs != null ? `<p class="hint">${goal.hint}</p>` : "";
    const eta = goalEta(goal);
    const side = sideGoals.map((sideGoal) => {
      const progress = goalProgress(sideGoal);
      return `<div class="side-goal"><strong>${sideGoal.title}</strong><span>${sideGoal.description}</span>${progress ? `<span>${progress}</span>` : ""}</div>`;
    }).join("");
    return `<section class="panel objective">
    <h2>Objective</h2>
    <h3>${goal.title}</h3>
    <p>${goal.description}</p>
    <div class="progress">${goalProgress(goal)}</div>
    ${eta ? `<p>${eta}</p>` : ""}
    ${hint}
    <button data-action="focus" data-target="${goal.cta?.targetId || ""}">${goal.cta?.label || "Continue"}</button>
    ${side ? `<div class="side-goals">${side}</div>` : ""}
  </section>`;
  }
  function renderProgressiveGoals() {
    return selectProgressiveGoals(engine().state, ruleset).map((goal) => `<section class="panel progressive-goal">
      <h2>${goal.title}</h2>
      <p>${goal.description}</p>
      <div class="progress">${goalProgress(goal)}</div>
    </section>`).join("");
  }
  function renderPendingEvent() {
    const eventId = engine().state.run.events.pendingId;
    if (!eventId) return "";
    const event = indexes.events[eventId];
    if (!event) return "";
    const choices = event.choices.map((choice) => {
      const node = choice.purchaseNodeId ? indexes.nodes[choice.purchaseNodeId] : null;
      const status = node ? selectNodeStatus(engine().state, ruleset, node.id) : "available_affordable";
      const cost = node ? `<small>${formatWholeCost(selectNodeCost(engine().state, ruleset, node.id))}</small>` : "";
      return `<button class="event-choice" data-action="resolve-event" data-event-id="${event.id}" data-choice-id="${choice.id}" ${status === "available_affordable" ? "" : "disabled"}>
      <strong>${choice.label}</strong>${cost}
    </button>`;
    }).join("");
    return `<section class="event-panel ${event.type === "branch" ? "blocking" : ""}" role="dialog" aria-label="${event.title}">
    <small>\u0421\u041E\u0411\u042B\u0422\u0418\u0415</small><h2>${event.title}</h2><p>${event.body}</p><div class="event-choices">${choices}</div>
  </section>`;
  }
  function manualActionStatus(process) {
    if (!process.available) {
      const remaining = Math.max(0, (process.state.availableAtMs || 0) - engine().state.run.clock.simulationMs);
      if (remaining > 0) {
        return `${Math.ceil(remaining / 1e3)}s`;
      }
      return "Locked";
    }
    if (!process.affordable) {
      return `Needs ${formatCost(process.inputCost)}`;
    }
    const cost = Object.keys(process.inputCost || {}).length ? `${formatCost(process.inputCost)} \u2192 ` : "";
    return `${cost}+${formatCost(process.reward)}`;
  }
  function renderManualActions() {
    return ruleset.manualProcesses.map((config) => {
      const process = selectManualProcessView(engine().state, ruleset, config.id);
      if (!process || process.obsoleteAfterNodeId && engine().state.run.nodes.completed[process.obsoleteAfterNodeId]) {
        return "";
      }
      if (!process.available && !process.availableFromStart && !engine().state.run.nodes.completed[process.availableAfterNodeId]) {
        return "";
      }
      const disabled = process.available && process.affordable ? "" : "disabled";
      return `<button class="wide primary ${focusedEntityId === process.id ? "focused" : ""}" data-entity-id="${process.id}" data-action="manual" data-id="${process.id}" ${disabled}>
    ${process.label}
    <small>${manualActionStatus(process)}</small>
  </button>`;
    }).join("");
  }
  function etaText(status, cost) {
    const eta = selectPurchaseEta(engine().state, ruleset, status, cost);
    return eta ? `ETA ${formatEta(eta)}` : "";
  }
  function renderProducerMilestone(outputView) {
    const bonus = outputView.nextMilestone || outputView.reachedMilestone;
    const bonusText = bonus ? `x${formatNumber(bonus.multiplier)} (+${formatNumber((bonus.multiplier - 1) * 100)}%)` : "";
    if (outputView.nextMilestone) {
      return `<small>${outputView.nextMilestone.label} ${outputView.count}/${outputView.nextMilestone.count} \xB7 Bonus ${bonusText} production \xB7 ${outputView.nextMilestone.description}</small>`;
    }
    if (outputView.reachedMilestone) {
      return `<small>${outputView.reachedMilestone.label} \xB7 ${bonusText} production: ${outputView.reachedMilestone.description}</small>`;
    }
    return "";
  }
  function renderProducers() {
    const rows = ruleset.producers.map((producer) => {
      const status = selectProducerStatus(engine().state, ruleset, producer.id);
      if (status === "locked") return "";
      const outputView = selectProducerOutputView(engine().state, ruleset, producer.id);
      const cost = selectProducerPrice(engine().state, ruleset, producer.id);
      const milestone = renderProducerMilestone(outputView);
      const input = Object.keys(outputView.inputPerUnit).length ? `<small>Consumes / unit</small>${formatCost(outputView.inputPerUnit)}/s<small>Current consumption</small>${formatCost(outputView.currentInput)}/s` : "";
      return `<button class="entity ${status} ${focusedEntityId === producer.id ? "focused" : ""}" data-entity-id="${producer.id}" data-action="producer" data-id="${producer.id}" ${status === "available_affordable" ? "" : "disabled"}>
        <span><strong>${PRODUCER_NAMES[producer.id] || producer.id}</strong><small>Owned ${outputView.count}</small>${milestone}</span>
        <span><small>Cost</small>${formatCost(cost)}<small>${etaText(status, cost)}</small></span>
        <span>${input}<small>Base output / unit</small>${formatCost(outputView.basePerUnit)}/s<small>Current output</small>${formatCost(outputView.currentTotal)}/s</span>
      </button>`;
    }).join("");
    return `<section class="panel"><h2>Actions / Generators</h2>${renderManualActions()}<div class="entity-list">${rows}</div></section>`;
  }
  function renderBuildingCapacity(building) {
    const capacity = (building.effects || []).filter((effect) => effect.type === "resource_capacity");
    if (!capacity.length) return "";
    return `<small>Storage</small>${capacity.map((effect) => `+${formatResourceAmount(effect.value)} ${RESOURCE_NAMES[effect.resourceId] || effect.resourceId}`).join(" + ")}`;
  }
  function renderBuildings() {
    const rows = ruleset.buildings.map((building) => {
      const status = selectBuildingStatus(engine().state, ruleset, building.id);
      if (status === "locked" || status === "unknown") return "";
      const count = engine().state.run.buildings[building.id]?.count || 0;
      const cost = selectBuildingPrice(engine().state, ruleset, building.id);
      const disabled = status === "available_affordable" ? "" : "disabled";
      const price = cost ? formatWholeCost(cost) : "";
      return `<button class="entity ${status} ${focusedEntityId === building.id ? "focused" : ""}" data-entity-id="${building.id}" data-action="building" data-id="${building.id}" ${disabled}>
        <span><strong>${BUILDING_NAMES[building.id] || building.id}</strong><small>Built ${count}</small></span>
        <span><small>Cost</small>${price}<small>${status === "maxed" ? "Maximum reached" : etaText(status, cost)}</small></span>
        <span>${renderBuildingCapacity(building)}</span>
      </button>`;
    }).join("");
    if (!rows) return "";
    return `<section class="panel"><h2>Infrastructure</h2><div class="entity-list">${rows}</div></section>`;
  }
  function renderJobs() {
    const population = selectPopulation(engine().state);
    if (!population) return "";
    const rows = ruleset.jobs.filter((job) => job.eraIds.includes(engine().state.run.eraId)).map((job) => {
      const count = engine().state.run.population.assignments[job.id] || 0;
      const output = formatCost(job.output);
      return `<div class="job-row"><span><strong>${job.labelKey?.replace("job.", "") || job.id}</strong><small>+${output}/s per person</small></span>
        <span class="job-controls"><button data-action="job" data-id="${job.id}" data-amount="${Math.max(0, count - 1)}" ${count ? "" : "disabled"}>\u2212</button><strong>${count}</strong><button data-action="job" data-id="${job.id}" data-amount="${count + 1}" ${population.unassigned > 0 ? "" : "disabled"}>+</button></span></div>`;
    }).join("");
    if (!rows) return "";
    return `<section class="panel"><h2>Jobs</h2><p class="job-summary">Population ${formatNumber(population.current)} / ${formatNumber(population.cap)} \xB7 unassigned ${population.unassigned}</p>${rows}</section>`;
  }
  function renderEvolution() {
    const revealLevels = {};
    const rows = EVOLUTION_NODES.map((nodeId) => {
      const node = indexes.nodes[nodeId];
      const revealLevel = selectEvolutionRevealLevel(engine().state, ruleset, nodeId, revealLevels);
      if (!engine().state.run.nodes.completed[nodeId] && revealLevel > 1) {
        return `<button class="node hidden-evolution" disabled aria-label="\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0435">
        <span><strong>\u{1F512} \u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0435</strong></span>
        <small>\u041E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u043F\u043E\u0437\u0436\u0435</small>
      </button>`;
      }
      const status = selectNodeStatus(engine().state, ruleset, nodeId);
      const optional = node.type === "OPTIONAL" ? '<small class="optional">OPTIONAL</small>' : "";
      const cost = selectNodeCost(engine().state, ruleset, nodeId);
      const completed = status === "completed";
      const eta = etaText(status, cost);
      const etaLabel = eta || `ETA ${status === "locked" ? "\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E" : "\u0421\u0435\u0439\u0447\u0430\u0441"}`;
      return `<button class="node ${status} ${focusedEntityId === nodeId ? "focused" : ""}" data-entity-id="${nodeId}" data-action="node" data-id="${nodeId}" ${status === "available_affordable" ? "" : "disabled"}>
      <span><strong>${nodeId} \u2014 ${NODE_NAMES[nodeId] || node.labelKey || nodeId}</strong>${optional}</span>
      <span>${status.replaceAll("_", " ")}${completed ? "" : `<small>${etaLabel}</small>`}</span>
      ${completed ? "" : `<small>${formatNodeCost(node, cost)}</small>`}
    </button>`;
    }).join("");
    const adaptationPoints = engine().state.run.adaptation?.points || 0;
    return `<section class="panel evolution-panel"><h2>Evolution</h2><p class="job-summary">Adaptation Points: ${adaptationPoints}</p><div class="node-grid">${rows}</div></section>`;
  }
  function renderDiorama() {
    const cognitionValue2 = selectCognition(engine().state, ruleset).value;
    const cognition = cognitionValue2 > 0 ? `<span>Cognition ${cognitionValue2}/100</span>` : "";
    return `<section class="diorama" aria-label="World state">
    <div class="orbital orbital-a"></div>
    <div class="orbital orbital-b"></div>
    <div class="molecule ${engine().state.run.nodes.completed.M06 ? "proto" : ""}"></div>
    <div>
      <p>World</p>
      <h1>${phaseLabel()}</h1>
      <span>Timeline #1 \xB7 ${Math.floor(engine().state.run.clock.simulationMs / 1e3)}s</span>${cognition}
    </div>
  </section>`;
  }
  function renderEnding() {
    const ending = engine().state.run.ending;
    if (!ending) return "";
    return `<section class="panel ending"><small>\u0426\u0418\u0412\u0418\u041B\u0418\u0417\u0410\u0426\u0418\u042F \u21161 \u0417\u0410\u0412\u0415\u0420\u0428\u0415\u041D\u0410</small><h2>\u041F\u0415\u041F\u0415\u041B</h2><p>\u041F\u043E\u0434\u0442\u0438\u043F: ${ending.subtype}. \u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0433\u043E\u0442\u043E\u0432\u0430 \u043A \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044E \u0432 \u0410\u0440\u0445\u0438\u0432.</p><button class="primary" data-action="archive-reset">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 \u0410\u0440\u0445\u0438\u0432</button></section>`;
  }
  var renderDevPanel = DEV ? function renderDevPanelContent() {
    return `<details class="panel dev-panel">
    <summary>Development</summary>
    <div class="dev-grid">
      ${debugApi().timeScales.map((scale) => `<button data-action="speed" data-scale="${scale}">${scale}x</button>`).join("")}
      <button data-action="grant" data-resource="rna">+100 RNA</button>
      <button data-action="grant" data-resource="dna">+25 DNA</button>
      <button data-action="grant" data-resource="biomass">+25 Biomass</button>
      <button data-action="grant" data-resource="atp">+25 ATP</button>
      <button data-action="toggle-test-mode">Test mode: ${engine().state.settings.testMode ? "ON" : "OFF"}</button>
      <button data-action="dev-reset">Dev reset</button>
      <button data-action="dump">Dump state</button>
    </div>
    <pre id="dev-dump"></pre>
  </details>`;
  } : function renderNoDevPanel() {
    return "";
  };
  function render() {
    const root = document.getElementById(ROOT_ID);
    if (runtime.mode !== "playable") {
      root.innerHTML = `<main class="app recovery">
      <section class="panel recovery-panel">
        <h1>Save recovery required</h1>
        <p>Primary / pending / backup contain invalid data.</p>
        ${runtime.diagnostics?.length ? `<ul>${runtime.diagnostics.map((slot) => `<li><strong>${slot.key}</strong>: ${slot.reason}${slot.errors?.length ? ` (${slot.errors.join(", ")})` : ""}</li>`).join("")}</ul>` : ""}
        <button class="primary" data-action="start-fresh">Start fresh</button>
      </section>
    </main>`;
      return;
    }
    root.innerHTML = `<main class="app">
    <header>
      <div><strong>\u0425\u0440\u043E\u043D\u0438\u043A\u0438 \u042D\u0432\u043E\u043B\u044E\u0446\u0438\u0438</strong><small>Timeline #1 \xB7 RNA \u2192 Ash</small></div>
      <nav>
        <button data-action="view" data-view="world" class="${activeView === "world" ? "active" : ""}">World</button>
        <button data-action="view" data-view="evolution" class="${activeView === "evolution" ? "active" : ""}">Evolution</button>
      </nav>
    </header>
    <section class="resources">${renderResources()}</section>
    ${renderPendingEvent()}
    <div class="layout">
      <div>
        ${renderDiorama()}
        ${activeView === "world" ? `${renderProducers()}${renderJobs()}${renderBuildings()}` : renderEvolution()}
      </div>
      <aside>
        ${renderEnding() || renderObjective()}
        ${renderProgressiveGoals()}
        <section class="panel status"><h2>Save</h2><p>${lastSaveMessage}</p>${engine().state.run.migrationNotice ? `<p class="hint">${engine().state.run.migrationNotice}</p>` : ""}<button data-action="save">Save now</button><button data-action="new-run">New run</button></section>
        ${renderDevPanel()}
      </aside>
    </div>
  </main>`;
  }
  function handleAction(target) {
    const button = target.closest("button");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "start-fresh") {
      const fresh = runtime.startFreshAfterCorruption();
      if (fresh.ok) {
        runtime = fresh.runtime;
        lastSaveMessage = "New run created";
        lastTickAt = performance.now();
        requestAnimationFrame(loop);
      } else {
        lastSaveMessage = `Recovery failed: ${fresh.loaded.reason}`;
      }
      render();
      return;
    }
    if (runtime.mode !== "playable") return;
    if (action === "view") activeView = button.dataset.view;
    if (action === "focus") {
      const routed = routeCtaFocus({ targetId: button.dataset.target }, indexes);
      activeView = routed.activeView;
      focusedEntityId = routed.focusedEntityId;
    }
    if (action === "manual") engine().dispatch({ type: "USE_MANUAL_PROCESS", processId: button.dataset.id });
    if (action === "producer") engine().dispatch({ type: "BUY_PRODUCER", producerId: button.dataset.id });
    if (action === "building") engine().dispatch({ type: "BUY_BUILDING", buildingId: button.dataset.id });
    if (action === "job") engine().dispatch({ type: "ASSIGN_JOB", jobId: button.dataset.id, amount: Number(button.dataset.amount) });
    if (action === "node") {
      const result = engine().dispatch({ type: "BUY_NODE", nodeId: button.dataset.id });
      if (!result.ok) {
        lastSaveMessage = nodePurchaseFailureMessage(result);
      }
      if (result.ok && result.events.some((event) => event.type === "cell_reached" || event.payload?.nodeId === "M06")) {
        autosave().flush("cell_reached");
      }
    }
    if (action === "resolve-event") engine().dispatch({ type: "RESOLVE_EVENT", eventId: button.dataset.eventId, choiceId: button.dataset.choiceId });
    if (action === "archive-reset") {
      const result = engine().dispatch({ type: "ARCHIVE_RESET" });
      if (result.ok) {
        autosave().flush("archive_reset");
        lastSaveMessage = "Ash saved in Archive";
        activeView = "world";
      }
    }
    if (action === "save") {
      const saved = autosave().flush("manual");
      lastSaveMessage = saved.ok ? "Saved" : `Save failed: ${saved.reason}`;
    }
    if (action === "new-run") {
      storage.remove("chronicles_evolution");
      storage.remove("chronicles_evolution.backup");
      storage.remove("chronicles_evolution.pending");
      window.location.reload();
    }
    if (DEV && action === "speed") debugApi().setTimeScale(Number(button.dataset.scale));
    if (DEV && action === "grant") debugApi().grant(button.dataset.resource, button.dataset.resource === "rna" ? 100 : 25);
    if (DEV && action === "toggle-test-mode") debugApi().toggleTestMode();
    if (DEV && action === "dev-reset") debugApi().manualDevReset({ runId: `run_dev_${Date.now()}` });
    if (DEV && action === "dump") document.getElementById("dev-dump").textContent = JSON.stringify(debugApi().dumpState(), null, 2);
    render();
    if (focusedEntityId) {
      document.querySelector(`[data-entity-id="${focusedEntityId}"]`)?.focus();
      document.querySelector(`[data-entity-id="${focusedEntityId}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }
  function installStyles() {
    const style = document.createElement("style");
    style.textContent = `
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #101316; color: #f3f0e8; }
    button { min-height: 44px; border: 1px solid #3d4b50; background: #20272a; color: #f3f0e8; border-radius: 6px; padding: 10px 12px; cursor: pointer; text-align: left; }
    button:disabled { opacity: .45; cursor: not-allowed; }
    button.active, button.primary, button.available_affordable { border-color: #66d0a5; background: #1e3732; }
    button.focused { outline: 3px solid #f0c36a; outline-offset: 2px; }
    .app { min-height: 100vh; padding: 18px; }
    header { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 12px; }
    header small, small { display: block; color: #aab7b5; margin-top: 2px; }
    nav { display: flex; gap: 8px; }
    .resources { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 8px; margin-bottom: 12px; }
    .resource-row { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: baseline; padding: 12px; background: #171d20; border: 1px solid #283337; border-radius: 6px; }
    .resource-row small { color: #77d7be; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 360px); gap: 12px; }
    .diorama { min-height: 300px; border: 1px solid #354147; border-radius: 8px; background: radial-gradient(circle at 35% 40%, #315c65, #12191d 62%); position: relative; overflow: hidden; display: flex; align-items: end; padding: 28px; }
    .diorama h1 { margin: 0; font-size: 42px; letter-spacing: 0; }
    .diorama p { margin: 0 0 4px; color: #a7e3cf; text-transform: uppercase; font-size: 12px; }
    .diorama span { color: #c0cbc8; }
    .molecule { position: absolute; width: 96px; height: 96px; left: 52%; top: 33%; border-radius: 50%; border: 2px solid #8ee6c1; box-shadow: 0 0 28px #8ee6c1; background: rgba(142, 230, 193, .16); }
    .molecule.proto { border-color: #f0c36a; box-shadow: 0 0 34px #f0c36a; background: rgba(240, 195, 106, .18); }
    .orbital { position: absolute; border: 1px solid rgba(255,255,255,.22); border-radius: 50%; }
    .orbital-a { width: 260px; height: 90px; left: 38%; top: 34%; transform: rotate(-22deg); }
    .orbital-b { width: 220px; height: 70px; left: 43%; top: 39%; transform: rotate(28deg); }
    .panel { margin-top: 12px; padding: 14px; background: #171d20; border: 1px solid #283337; border-radius: 8px; }
    .panel h2 { margin: 0 0 10px; font-size: 15px; }
    .panel h3 { margin: 0 0 8px; font-size: 20px; }
    .panel p { color: #cdd6d2; line-height: 1.45; }
    .wide { width: 100%; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .entity-list, .node-grid, .dev-grid { display: grid; gap: 8px; }
    .entity, .node { width: 100%; display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 8px; align-items: center; }
    .node { grid-template-columns: 1.4fr .8fr 1fr; }
    .completed { border-color: #f0c36a; background: #332d1f; }
    .hidden-evolution { border-color: #283337; background: #14191c; color: #65706e; opacity: .7; }
    .optional { color: #f0c36a; }
    .progress { padding: 10px; border-radius: 6px; background: #20272a; color: #dfe7e4; }
    .hint { border-left: 3px solid #f0c36a; padding-left: 10px; color: #f0d99a !important; }
    .side-goal { border-top: 1px solid #2d383c; padding-top: 10px; margin-top: 10px; }
    .side-goal span { display: block; color: #c0cbc8; margin-top: 3px; }
    .progressive-goal { border-color: #4a6a7a; }
    .progressive-goal h2 { color: #9fd0e6; }
    .status button { width: 100%; margin-top: 8px; text-align: center; }
    .event-panel { margin: 0 0 12px; padding: 16px; border: 1px solid #66d0a5; border-radius: 8px; background: #18302c; box-shadow: 0 8px 30px rgba(0,0,0,.2); }
    .event-panel.blocking { border-color: #f0c36a; background: #332d1f; }
    .event-panel h2 { margin: 4px 0 8px; font-size: 22px; }
    .event-panel p { margin: 0 0 12px; color: #e2e8e5; line-height: 1.45; }
    .event-choices { display: flex; flex-wrap: wrap; gap: 8px; }
    .event-choice { min-width: 150px; flex: 1; }
    .job-row { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid #2d383c; }
    .job-controls { display: flex; align-items: center; gap: 8px; } .job-controls button { min-height: 34px; min-width: 38px; text-align: center; padding: 4px 8px; }
    .job-summary { margin: 0 0 8px; color: #aab7b5 !important; } .ending { border-color: #f0c36a; background: #332d1f; }
    .recovery { display: grid; min-height: 100vh; place-items: center; }
    .recovery-panel { width: min(680px, calc(100vw - 32px)); }
    .recovery-panel h1 { margin: 0 0 10px; font-size: 28px; letter-spacing: 0; }
    #dev-dump { max-height: 260px; overflow: auto; font-size: 11px; color: #cdd6d2; }
    @media (max-width: 820px) {
      .layout { grid-template-columns: 1fr; }
      header { align-items: stretch; flex-direction: column; }
      nav button { flex: 1; text-align: center; }
      .entity, .node { grid-template-columns: 1fr; }
      .diorama h1 { font-size: 32px; }
    }
  `;
    document.head.appendChild(style);
  }
  function loop(now) {
    if (runtime.mode !== "playable") {
      return;
    }
    const deltaMs = Math.min(1e3, now - lastTickAt);
    lastTickAt = now;
    const scaled = deltaMs * (DEV ? engine().state.settings.devTimeScale || 1 : 1);
    engine().tick(scaled);
    const saved = autosave().tick(scaled);
    if (saved.ok && !saved.skipped) {
      lastSaveMessage = "Autosaved";
    }
    render();
    requestAnimationFrame(loop);
  }
  document.addEventListener("DOMContentLoaded", () => {
    installStyles();
    document.getElementById(ROOT_ID).addEventListener("click", (event) => handleAction(event.target));
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && runtime.mode === "playable") autosave().flush("visibility");
    });
    window.addEventListener("beforeunload", () => {
      if (runtime.mode === "playable") autosave().flush("beforeunload");
    });
    if (runtime.mode === "playable") {
      selectProductionRates(engine().state, ruleset);
    }
    render();
    if (runtime.mode === "playable") {
      requestAnimationFrame(loop);
    }
  });
})();
//# sourceMappingURL=chronicles.js.map
