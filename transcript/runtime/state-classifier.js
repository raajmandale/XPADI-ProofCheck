function classifyState(inputs) {
  const proofChain = inputs.proofChain || null;
  const continuityChain = inputs.continuityChain || null;
  const runtimeState = inputs.runtimeState || null;
  const relationships = inputs.relationships || null;
  const consequenceGraph = inputs.consequenceGraph || null;

  const proofCount = proofChain && Array.isArray(proofChain.chain) ? proofChain.chain.length : 0;
  const continuityCount = continuityChain && Array.isArray(continuityChain.chain) ? continuityChain.chain.length : 0;
  const relationshipCount = relationships && Array.isArray(relationships.relationships) ? relationships.relationships.length : 0;
  const consequenceCount = consequenceGraph && Array.isArray(consequenceGraph.edges) ? consequenceGraph.edges.length : 0;

  let state = "UNKNOWN";
  if (proofCount > 0) state = "OBSERVABLE";
  if (proofCount > 0 && continuityCount > 0) state = "CONTINUITY_READY";
  if (proofCount > 0 && continuityCount > 0 && relationshipCount > 0) state = "RECOVERABLE";
  if (proofCount > 0 && continuityCount > 0 && relationshipCount > 0 && consequenceCount > 0) state = "SURVIVABLE";

  return {
    state,
    proof_count: proofCount,
    continuity_count: continuityCount,
    relationship_count: relationshipCount,
    consequence_count: consequenceCount,
    runtime_state: runtimeState ? runtimeState.state : "UNKNOWN"
  };
}
module.exports = { classifyState };
