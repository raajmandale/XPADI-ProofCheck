function analyzeRecovery(classification) {
  let score = 0;
  score += Math.min(classification.proof_count * 10, 30);
  score += Math.min(classification.continuity_count * 8, 25);
  score += Math.min(classification.relationship_count * 7, 25);
  score += Math.min(classification.consequence_count * 4, 20);
  score = Math.min(score, 100);

  let recoverability = "UNKNOWN";
  if (score >= 85) recoverability = "HIGH";
  else if (score >= 60) recoverability = "MEDIUM";
  else if (score > 0) recoverability = "LOW";

  return {
    artifact: "XPADI_RECOVERY_ANALYSIS_V1",
    recoverability_score: score,
    recoverability,
    classification: classification.state,
    evidence_sources:
      classification.proof_count +
      classification.continuity_count +
      classification.relationship_count +
      classification.consequence_count,
    meaning:
      score >= 85
        ? "Evidence, continuity, and relationship artifacts support a strong public survivability posture."
        : "Evidence exists, but continuity confidence is still maturing."
  };
}
module.exports = { analyzeRecovery };
