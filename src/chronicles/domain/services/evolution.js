export function prerequisitesMet(state, entity) {
  const required = entity.requiresNodes || [];
  const nodesMet = required.every((nodeId) => state.run.nodes.completed[nodeId]);
  if (!nodesMet) {
    return false;
  }
  if (entity.requiresAnyBranchGroup) {
    return Boolean(state.run.nodes.selectedBranchByGroup[entity.requiresAnyBranchGroup]);
  }
  return true;
}

export function branchAvailable(state, node) {
  if (!node.branchGroup) {
    return true;
  }
  const selected = state.run.nodes.selectedBranchByGroup[node.branchGroup];
  return !selected || selected === node.id;
}
