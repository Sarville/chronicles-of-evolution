export function prerequisitesMet(state, entity) {
  const required = entity.requiresNodes || [];
  const nodesMet = required.every((nodeId) => state.run.nodes.completed[nodeId]);
  if (!nodesMet) {
    return false;
  }
  const flagsMet = (entity.requiresFlags || []).every((flagId) => state.run.flags[flagId]);
  if (!flagsMet) {
    return false;
  }
  if (entity.requiresAnyBranchGroup) {
    return Boolean(state.run.nodes.selectedBranchByGroup[entity.requiresAnyBranchGroup]);
  }
  return true;
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
