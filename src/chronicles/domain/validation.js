import { createRulesetIndexes } from '../config/index.js';

function assertSerializable(value, path, errors) {
  if (typeof value === 'function') {
    errors.push(`${path} must be serializable and cannot contain functions`);
  }
  if (!value || typeof value !== 'object') {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    assertSerializable(child, `${path}.${key}`, errors);
  }
}

function validateCost(cost, resourcesById, ownerId, errors) {
  if (!cost || typeof cost !== 'object') {
    errors.push(`${ownerId} must define a cost object`);
    return;
  }
  for (const [resourceId, amount] of Object.entries(cost)) {
    if (!resourcesById[resourceId]) {
      errors.push(`${ownerId} references unknown resource ${resourceId}`);
    }
    if (!Number.isFinite(amount) || amount < 0) {
      errors.push(`${ownerId} has invalid cost for ${resourceId}`);
    }
  }
}

function validateEffect(effect, ruleset, ownerId, errors) {
  const support = ruleset.effectSupport?.[effect.type];
  if (!support) {
    errors.push(`${ownerId} uses unknown effect type ${effect.type}`);
    return;
  }
  if (support.status === 'deferred') {
    if (effect.deferred !== true || effect.deferredUntil !== support.until) {
      errors.push(`${ownerId} uses deferred effect ${effect.type} without explicit deferred marker`);
    }
    return;
  }
  if (!ruleset.allowedEffectTypes.includes(effect.type)) {
    errors.push(`${ownerId} uses effect type ${effect.type} that is not runtime-supported`);
  }
  if (effect.type === 'resource_capacity') {
    const resources = createRulesetIndexes(ruleset).resources;
    if (!resources[effect.resourceId]) errors.push(`${ownerId} expands unknown resource ${effect.resourceId}`);
    if (!Number.isFinite(effect.value) || effect.value <= 0) errors.push(`${ownerId} has invalid resource capacity value`);
  }
}

function visitNode(nodeId, nodesById, temporary, permanent, errors) {
  if (permanent.has(nodeId)) {
    return;
  }
  if (temporary.has(nodeId)) {
    errors.push(`Node graph contains a cycle at ${nodeId}`);
    return;
  }
  temporary.add(nodeId);
  const node = nodesById[nodeId];
  for (const required of node.requiresNodes || []) {
    if (nodesById[required]) {
      visitNode(required, nodesById, temporary, permanent, errors);
    }
  }
  temporary.delete(nodeId);
  permanent.add(nodeId);
}

export function validateRuleset(ruleset) {
  const errors = [];
  assertSerializable(ruleset, 'ruleset', errors);

  const collections = [
    ['resources', ruleset.resources],
    ['eras', ruleset.eras],
    ['producers', ruleset.producers],
    ['nodes', ruleset.nodes],
    ['buildings', ruleset.buildings],
    ['jobs', ruleset.jobs],
    ['goals', ruleset.goals],
    ['manualProcesses', ruleset.manualProcesses || []],
    ['events', ruleset.events],
  ];

  for (const [name, items] of collections) {
    const ids = new Set();
    for (const item of items) {
      if (!item.id || ids.has(item.id)) {
        errors.push(`${name} contains duplicate or missing id ${item.id}`);
      }
      ids.add(item.id);
    }
  }

  const indexes = createRulesetIndexes(ruleset);
  for (const resource of ruleset.resources) {
    if (resource.baseCap != null && (!Number.isFinite(resource.baseCap) || resource.baseCap < 0)) {
      errors.push(`${resource.id} has invalid baseCap`);
    }
  }

  for (const producer of ruleset.producers) {
    validateCost(producer.baseCost, indexes.resources, producer.id, errors);
    const inputEntries = Object.entries(producer.input || {});
    if (inputEntries.length === 0 && !producer.source) {
      errors.push(`${producer.id} must declare an input or external source`);
    }
    if (inputEntries.length > 0 && producer.source) {
      errors.push(`${producer.id} cannot declare both an input and external source`);
    }
    for (const resourceId of Object.keys(producer.output || {})) {
      if (!indexes.resources[resourceId]) {
        errors.push(`${producer.id} outputs unknown resource ${resourceId}`);
      }
    }
    for (const [resourceId, amount] of inputEntries) {
      if (!indexes.resources[resourceId]) errors.push(`${producer.id} consumes unknown resource ${resourceId}`);
      if (!Number.isFinite(amount) || amount < 0) errors.push(`${producer.id} has invalid input for ${resourceId}`);
    }
    for (const milestone of producer.milestones || []) {
      if (!Number.isFinite(milestone.count) || milestone.count <= 0) {
        errors.push(`${producer.id} has invalid milestone count`);
      }
      if (!Number.isFinite(milestone.multiplier) || milestone.multiplier < 1) {
        errors.push(`${producer.id} has invalid milestone multiplier`);
      }
      if (!milestone.label || !milestone.description) {
        errors.push(`${producer.id} milestone must include label and description`);
      }
    }
  }

  for (const building of ruleset.buildings) {
    validateCost(building.baseCost, indexes.resources, building.id, errors);
    for (const required of building.requiresNodes || []) {
      if (!indexes.nodes[required]) {
        errors.push(`${building.id} requires unknown node ${required}`);
      }
    }
    for (const effect of building.effects || []) {
      validateEffect(effect, ruleset, building.id, errors);
    }
  }

  for (const job of ruleset.jobs) {
    if (!Array.isArray(job.eraIds) || job.eraIds.length === 0 || job.eraIds.some((eraId) => !indexes.eras[eraId])) {
      errors.push(`${job.id} must declare known eraIds`);
    }
    for (const [resourceId, amount] of Object.entries(job.output || {})) {
      if (!indexes.resources[resourceId] || !Number.isFinite(amount) || amount < 0) {
        errors.push(`${job.id} has invalid output for ${resourceId}`);
      }
    }
  }

  for (const node of ruleset.nodes) {
    validateCost(node.cost, indexes.resources, node.id, errors);
    for (const required of node.requiresNodes || []) {
      if (required.endsWith('*')) {
        continue;
      }
      if (!indexes.nodes[required]) {
        errors.push(`${node.id} requires unknown node ${required}`);
      }
    }
    for (const requirement of node.requiresBuildings || []) {
      if (!indexes.buildings[requirement.buildingId]) {
        errors.push(`${node.id} requires unknown building ${requirement.buildingId}`);
      }
      if (!Number.isInteger(requirement.count) || requirement.count <= 0) {
        errors.push(`${node.id} has invalid building requirement count`);
      }
    }
    for (const effect of node.effects || []) {
      validateEffect(effect, ruleset, node.id, errors);
    }
    if (node.transition && !indexes.eras[node.transition]) {
      errors.push(`${node.id} transitions to unknown era ${node.transition}`);
    }
    if (node.adaptationPointCost != null && (!Number.isInteger(node.adaptationPointCost) || node.adaptationPointCost < 0)) {
      errors.push(`${node.id} has invalid Adaptation Point cost`);
    }
  }

  for (const [groupId, members] of Object.entries(ruleset.branchGroups)) {
    for (const member of members) {
      if (!indexes.nodes[member]) {
        errors.push(`${groupId} references unknown branch node ${member}`);
      }
    }
  }

  for (const [groupId, rule] of Object.entries(ruleset.branchCostRules || {})) {
    if (!ruleset.branchGroups[groupId]) {
      errors.push(`${groupId} has branch cost rule without branch group`);
    }
    if (rule.allowAdditionalBranches != null && typeof rule.allowAdditionalBranches !== 'boolean') {
      errors.push(`${groupId} has non-boolean allowAdditionalBranches`);
    }
    if (
      rule.additionalBranchCostMultiplier != null &&
      (!Number.isFinite(rule.additionalBranchCostMultiplier) || rule.additionalBranchCostMultiplier < 1)
    ) {
      errors.push(`${groupId} has invalid branch cost multiplier`);
    }
  }

  const conditionTypes = new Set([
    'resource_amount',
    'producer_count',
    'node_completed',
    'manual_process_completed',
    'era_reached',
    'flag_set',
    'branch_selected',
    'adaptation_selected',
    'cognition_at_least',
    'population_at_least',
    'building_count',
  ]);
  const rewardTypes = new Set(['grant_resource', 'reveal_entity', 'set_flag', 'grant_adaptation_points']);

  for (const process of ruleset.manualProcesses || []) {
    if (!Number.isFinite(process.cooldownMs) || process.cooldownMs < 0) {
      errors.push(`${process.id} has invalid cooldownMs`);
    }
    if (process.cooldownAfterMs != null && (!Number.isFinite(process.cooldownAfterMs) || process.cooldownAfterMs < 0)) {
      errors.push(`${process.id} has invalid cooldownAfterMs`);
    }
    if (process.cooldownAfterNodeId && !indexes.nodes[process.cooldownAfterNodeId]) {
      errors.push(`${process.id} references unknown cooldownAfterNodeId ${process.cooldownAfterNodeId}`);
    }
    if (process.availableAfterNodeId && !indexes.nodes[process.availableAfterNodeId]) {
      errors.push(`${process.id} references unknown availableAfterNodeId ${process.availableAfterNodeId}`);
    }
    for (const required of process.requiresNodes || []) {
      if (!indexes.nodes[required]) {
        errors.push(`${process.id} requires unknown node ${required}`);
      }
    }
    for (const stage of process.cooldownStages || []) {
      if (!stage.afterNodeId || !indexes.nodes[stage.afterNodeId]) {
        errors.push(`${process.id} references unknown cooldown stage node ${stage.afterNodeId}`);
      }
      if (!Number.isFinite(stage.cooldownMs) || stage.cooldownMs < 0) {
        errors.push(`${process.id} has invalid cooldown stage cooldownMs`);
      }
    }
    if (process.reward) {
      if (!['manual_gain', 'convert_resource'].includes(process.reward.type)) {
        errors.push(`${process.id} uses unknown manual reward type ${process.reward.type}`);
      }
      if (!indexes.resources[process.reward.resourceId]) {
        errors.push(`${process.id} rewards unknown resource ${process.reward.resourceId}`);
      }
      if (!Number.isFinite(process.reward.baseAmount) || process.reward.baseAmount < 0) {
        errors.push(`${process.id} has invalid manual reward baseAmount`);
      }
      if (
        process.reward.productionSeconds != null &&
        (!Number.isFinite(process.reward.productionSeconds) || process.reward.productionSeconds < 0)
      ) {
        errors.push(`${process.id} has invalid manual reward productionSeconds`);
      }
      if (
        process.reward.rewardMultiplier != null &&
        (!Number.isFinite(process.reward.rewardMultiplier) || process.reward.rewardMultiplier <= 0)
      ) {
        errors.push(`${process.id} has invalid manual reward multiplier`);
      }
      if (process.reward.inputCost) {
        validateCost(process.reward.inputCost, indexes.resources, process.id, errors);
      }
    }
  }

  for (const goal of ruleset.goals) {
    if (goal.nodeId && !indexes.nodes[goal.nodeId]) {
      errors.push(`${goal.id} references unknown node ${goal.nodeId}`);
    }
    for (const condition of [...(goal.prerequisites || []), ...(goal.conditions || [])]) {
      if (!conditionTypes.has(condition.type)) {
        errors.push(`${goal.id} uses unknown condition type ${condition.type}`);
      }
      if (condition.resourceId && !indexes.resources[condition.resourceId]) {
        errors.push(`${goal.id} condition references unknown resource ${condition.resourceId}`);
      }
      if (condition.producerId && !indexes.producers[condition.producerId]) {
        errors.push(`${goal.id} condition references unknown producer ${condition.producerId}`);
      }
      if (condition.nodeId && !indexes.nodes[condition.nodeId]) {
        errors.push(`${goal.id} condition references unknown node ${condition.nodeId}`);
      }
      if (condition.processId && !indexes.manualProcesses[condition.processId]) {
        errors.push(`${goal.id} condition references unknown manual process ${condition.processId}`);
      }
      if (condition.eraId && !indexes.eras[condition.eraId]) {
        errors.push(`${goal.id} condition references unknown era ${condition.eraId}`);
      }
      if (condition.branchGroup && !ruleset.branchGroups[condition.branchGroup]) {
        errors.push(`${goal.id} condition references unknown branch group ${condition.branchGroup}`);
      }
      if (condition.buildingId && !indexes.buildings[condition.buildingId]) {
        errors.push(`${goal.id} condition references unknown building ${condition.buildingId}`);
      }
    }
    for (const reward of goal.rewards || []) {
      if (!rewardTypes.has(reward.type)) {
        errors.push(`${goal.id} uses unknown reward type ${reward.type}`);
      }
      if (reward.resourceId && !indexes.resources[reward.resourceId]) {
        errors.push(`${goal.id} reward references unknown resource ${reward.resourceId}`);
      }
      if (reward.type === 'grant_adaptation_points' && (!Number.isInteger(reward.amount) || reward.amount < 0)) {
        errors.push(`${goal.id} has invalid Adaptation Point reward`);
      }
    }
  }

  const eventEffectTypes = new Set(['grant_resource', 'set_flag', 'set_meta_flag', 'unlock_meta', 'grant_cognition', 'adjust_crisis_stability', 'complete_ending', 'start_chapter_timer']);
  const endingIds = new Set((ruleset.endings || []).map((ending) => ending.id));
  for (const event of ruleset.events) {
    if (!event.type || !event.deck || !event.trigger?.type || !Array.isArray(event.choices) || event.choices.length === 0) {
      errors.push(`${event.id} must define type, deck, trigger and choices`);
      continue;
    }
    if (!Number.isFinite(event.priority)) errors.push(`${event.id} has invalid priority`);
    if (event.weight != null && (!Number.isFinite(event.weight) || event.weight <= 0)) errors.push(`${event.id} has invalid weight`);
    if (event.cooldownMs != null && (!Number.isFinite(event.cooldownMs) || event.cooldownMs < 0)) errors.push(`${event.id} has invalid cooldownMs`);
    if (event.trigger.goalId && !indexes.goals[event.trigger.goalId]) errors.push(`${event.id} trigger references unknown goal ${event.trigger.goalId}`);
    if (event.trigger.nodeId && !indexes.nodes[event.trigger.nodeId]) errors.push(`${event.id} trigger references unknown node ${event.trigger.nodeId}`);
    if (event.blocks?.branchGroup && !ruleset.branchGroups[event.blocks.branchGroup]) errors.push(`${event.id} blocks unknown branch group ${event.blocks.branchGroup}`);
    for (const condition of event.preconditions || []) {
      if (condition.type === 'node_completed' && !indexes.nodes[condition.nodeId]) errors.push(`${event.id} precondition references unknown node ${condition.nodeId}`);
    }
    for (const choice of event.choices) {
      if (!choice.id || !choice.label) errors.push(`${event.id} has choice without id or label`);
      if (choice.purchaseNodeId && !indexes.nodes[choice.purchaseNodeId]) errors.push(`${event.id} choice references unknown node ${choice.purchaseNodeId}`);
      for (const effect of choice.effects || []) {
        if (!eventEffectTypes.has(effect.type)) errors.push(`${event.id} uses unknown event effect ${effect.type}`);
        if (effect.type === 'grant_resource' && (!indexes.resources[effect.resourceId] || !Number.isFinite(effect.amount) || effect.amount < 0)) {
          errors.push(`${event.id} has invalid resource grant`);
        }
        if (effect.type === 'adjust_crisis_stability' && !Number.isFinite(effect.amount)) {
          errors.push(`${event.id} has invalid crisis stability adjustment`);
        }
        if (effect.type === 'grant_cognition' && (!Number.isFinite(effect.amount) || effect.amount < 0)) {
          errors.push(`${event.id} has invalid Cognition grant`);
        }
        if (effect.type === 'complete_ending' && !effect.subtype) {
          errors.push(`${event.id} completes ending without subtype`);
        }
        if (effect.type === 'complete_ending' && !endingIds.has(effect.endingId)) {
          errors.push(`${event.id} completes unknown ending ${effect.endingId}`);
        }
        if (effect.type === 'start_chapter_timer' && !effect.timerId) {
          errors.push(`${event.id} starts a chapter timer without timerId`);
        }
      }
    }
  }

  const permanent = new Set();
  for (const node of ruleset.nodes) {
    visitNode(node.id, indexes.nodes, new Set(), permanent, errors);
  }

  return { ok: errors.length === 0, errors };
}

export function validateGameState(state, ruleset) {
  const errors = [];
  assertSerializable(state, 'state', errors);
  if (!state.run || !state.meta || !state.settings) {
    errors.push('State must contain run, meta and settings');
    return { ok: false, errors };
  }
  if (state.run.rulesetVersion !== ruleset.version) {
    errors.push(`Unsupported ruleset version ${state.run.rulesetVersion}`);
  }
  for (const [resourceId, resource] of Object.entries(state.run.resources || {})) {
    if (!Number.isFinite(resource.amount) || resource.amount < 0) {
      errors.push(`Resource ${resourceId} has invalid amount`);
    }
  }
  const events = state.run.events;
  if (!events || !Number.isInteger(events.rngState) || !Array.isArray(events.queue) || !events.states || !Array.isArray(events.history)) {
    errors.push('State must contain normalized event runtime state');
  }
  return { ok: errors.length === 0, errors };
}
