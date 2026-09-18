import { resources } from './resources.js';
import { eras } from './eras.js';
import { producers } from './producers.js';
import { nodes, branchGroups, branchCostRules } from './nodes.js';
import { buildings } from './buildings.js';
import { jobs } from './jobs.js';
import { goals } from './goals.js';
import { manualProcesses } from './manualProcesses.js';
import { events } from './events.js';
import { milestones } from './milestones.js';
import { endings } from './endings.js';
import { allowedEffectTypes, effectSupport } from './effects.js';

export const RULESET_VERSION = 'timeline1-v14-blight-timer';

export const ruleset = {
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
  effectSupport,
};

export function indexById(items) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

export function createRulesetIndexes(source = ruleset) {
  return {
    resources: indexById(source.resources),
    eras: indexById(source.eras),
    producers: indexById(source.producers),
    nodes: indexById(source.nodes),
    buildings: indexById(source.buildings),
    jobs: indexById(source.jobs),
    goals: indexById(source.goals),
    manualProcesses: indexById(source.manualProcesses || []),
    events: indexById(source.events),
  };
}
