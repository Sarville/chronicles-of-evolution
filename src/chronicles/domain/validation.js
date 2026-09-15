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
    for (const resourceId of Object.keys(producer.output || {})) {
      if (!indexes.resources[resourceId]) {
        errors.push(`${producer.id} outputs unknown resource ${resourceId}`);
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
    for (const effect of node.effects || []) {
      validateEffect(effect, ruleset, node.id, errors);
    }
    if (node.transition && !indexes.eras[node.transition]) {
      errors.push(`${node.id} transitions to unknown era ${node.transition}`);
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

  for (const goal of ruleset.goals) {
    if (!indexes.nodes[goal.nodeId]) {
      errors.push(`${goal.id} references unknown node ${goal.nodeId}`);
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
  return { ok: errors.length === 0, errors };
}
