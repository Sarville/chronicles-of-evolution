export function prerequisitesMet(state, entity) {
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

export function cognitionValue(state, contributions = []) {
  const total = contributions.reduce((sum, contribution) => {
    return state.run.nodes.completed[contribution.nodeId] ? sum + contribution.value : sum;
  }, state.run.cognition?.eventBonus || 0);
  return Math.min(100, total);
}

export function branchAvailable(state, ruleset, node) {
  if (!node.branchGroup) {
    return true;
  }
  const selected = state.run.nodes.selectedBranchByGroup[node.branchGroup];
  if (!selected || selected === node.id) {
    return true;
  }
  const rule = ruleset.branchCostRules?.[node.branchGroup];
  return rule?.allowAdditionalBranches === true;
}

export function branchCostMultiplier(state, ruleset, node) {
  if (!node.branchGroup) {
    return 1;
  }
  const rule = ruleset.branchCostRules?.[node.branchGroup];
  if (!rule) {
    return 1;
  }
  const selected = state.run.nodes.selectedBranchByGroup[node.branchGroup];
  const archiveWaivesPenalty =
    rule.waiveWithArchiveNodeId && state.meta.archiveNodes?.[rule.waiveWithArchiveNodeId];
  if (!selected || selected === node.id || archiveWaivesPenalty) {
    return 1;
  }
  return rule.additionalBranchCostMultiplier || 1;
}
