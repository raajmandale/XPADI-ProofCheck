async function loadRuntimeData() {
  const base = "../transcript/output";

  const [
    finalDecision,
    finalState,
    reasoningState,
    validationState
  ] = await Promise.all([
    fetch(`${base}/final/xpadi-final-decision.json`).then(r => r.json()),
    fetch(`${base}/final/xpadi-final-state.json`).then(r => r.json()),
    fetch(`${base}/reasoning/final-state.json`).then(r => r.json()),
    fetch(`${base}/validation/xpadi-validation.json`).then(r => r.json())
  ]);

  return {
    finalDecision,
    finalState,
    reasoningState,
    validationState
  };
}