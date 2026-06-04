function analyzeConfidence(classification, recovery) {
  let confidence = Math.round(
    recovery.recoverability_score * 0.7 +
    Math.min(classification.relationship_count * 5, 15) +
    Math.min(classification.consequence_count * 3, 15)
  );
  confidence = Math.min(confidence, 100);

  return {
    artifact: "XPADI_CONFIDENCE_ANALYSIS_V1",
    confidence_score: confidence,
    proof_strength: classification.proof_count >= 5 ? "HIGH" : classification.proof_count > 0 ? "MEDIUM" : "LOW",
    continuity_strength: classification.continuity_count >= 5 ? "HIGH" : classification.continuity_count > 0 ? "MEDIUM" : "LOW",
    relationship_strength: classification.relationship_count >= 4 ? "HIGH" : classification.relationship_count > 0 ? "MEDIUM" : "LOW",
    consequence_strength: classification.consequence_count >= 4 ? "HIGH" : classification.consequence_count > 0 ? "MEDIUM" : "LOW",
    meaning:
      confidence >= 85
        ? "The public evidence chain has high continuity confidence."
        : "The public evidence chain is observable but still maturing."
  };
}
module.exports = { analyzeConfidence };
