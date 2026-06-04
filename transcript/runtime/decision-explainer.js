function explainDecision({ decision, validation }) {
  const factors = [
    { name: "Recoverability", score: decision.recoverability, weight: "32%", meaning: "How strongly the public evidence supports recoverability posture." },
    { name: "Confidence", score: decision.confidence, weight: "28%", meaning: "How consistent the reasoning layer is across available public artifacts." },
    { name: "Proof Integrity", score: decision.proof_integrity, weight: "20%", meaning: "How complete the proof chain appears from public ProofCheck outputs." },
    { name: "Continuity", score: decision.continuity, weight: "20%", meaning: "How complete the continuity chain appears from public ProofCheck outputs." }
  ];

  const failedChecks = validation?.checks?.filter(c => c.status === "FAIL") || [];
  const warnedChecks = validation?.checks?.filter(c => c.status === "WARN") || [];
  const weakFactors = factors.filter(f => Number(f.score) < 70);
  const strongFactors = factors.filter(f => Number(f.score) >= 85);

  let explanation = "The public evidence chain passed validation and supports a safe demonstration posture.";
  let recommendation = "Safe for public demonstration, repository presentation, and continuity validation review.";

  if (decision.decision === "WATCH") {
    explanation = "The public evidence chain is usable, but validation found one or more signals that should be reviewed before stronger claims are made.";
    recommendation = "Use for controlled demo; review validation warnings before public release positioning.";
  }

  if (decision.decision === "RISK" || decision.decision === "CRITICAL") {
    explanation = "The public evidence chain did not pass validation strongly enough for a confident continuity posture.";
    recommendation = "Do not present as a strong continuity signal until failed validation checks are corrected.";
  }

  return {
    artifact: "XPADI_DECISION_EXPLAINER_V1",
    decision: decision.decision,
    risk: decision.risk,
    composite_score: decision.composite_score,
    explanation,
    recommendation,
    strongest_signals: strongFactors.map(f => f.name),
    review_signals: [...weakFactors.map(f => f.name), ...warnedChecks.map(c => c.check), ...failedChecks.map(c => c.check)],
    validation_failures: failedChecks,
    validation_warnings: warnedChecks,
    factors,
    public_boundary: "Explanation is based only on public ProofCheck artifacts and deterministic validation. No XPADI private mechanisms are disclosed.",
    generated_at: new Date().toISOString()
  };
}

module.exports = { explainDecision };
