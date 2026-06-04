const path = require("path");
const fs = require("fs");
const { writeJson } = require("./continuity-generator");

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch (error) { return { _invalid_json: true, _error: error.message, _path: filePath }; }
}

function validateXpadiArtifacts({ outputDir, session }) {
  const required = {
    fileProof: path.join(outputDir, "proofs", "file-proof.json"),
    continuity: path.join(outputDir, "continuity", "continuity-session.json"),
    runtimeState: path.join(outputDir, "intelligence", "runtime-state.json"),
    proofChain: path.join(outputDir, "intelligence", "proof-chain.json"),
    continuityChain: path.join(outputDir, "intelligence", "continuity-chain.json"),
    finalReasoningState: path.join(outputDir, "reasoning", "final-state.json")
  };

  const loaded = {};
  const checks = [];

  for (const [key, filePath] of Object.entries(required)) {
    const present = fs.existsSync(filePath);
    const parsed = present ? readJsonIfExists(filePath) : null;
    loaded[key] = parsed;
    checks.push({
      check: key,
      path: filePath,
      status: present && !parsed?._invalid_json ? "PASS" : "FAIL",
      reason: !present ? "Missing required artifact." : parsed?._invalid_json ? "Artifact exists but is not valid JSON." : "Artifact exists and is readable."
    });
  }

  const proofChainCount = Array.isArray(loaded.proofChain?.chain) ? loaded.proofChain.chain.length : 0;
  const continuityChainCount = Array.isArray(loaded.continuityChain?.chain) ? loaded.continuityChain.chain.length : 0;
  const reasoningScore = Number(loaded.finalReasoningState?.confidence_score || 0);
  const recoverabilityScore = Number(loaded.finalReasoningState?.recoverability_score || 0);

  checks.push({ check: "proof_chain_strength", status: proofChainCount > 0 ? "PASS" : "FAIL", value: proofChainCount, reason: proofChainCount > 0 ? "Proof chain contains public evidence links." : "Proof chain is empty." });
  checks.push({ check: "continuity_chain_strength", status: continuityChainCount > 0 ? "PASS" : "FAIL", value: continuityChainCount, reason: continuityChainCount > 0 ? "Continuity chain contains public continuity links." : "Continuity chain is empty." });
  checks.push({ check: "reasoning_confidence", status: reasoningScore >= 70 ? "PASS" : "WARN", value: reasoningScore, reason: reasoningScore >= 70 ? "Reasoning confidence is strong enough for public demo posture." : "Reasoning confidence should be reviewed." });
  checks.push({ check: "recoverability_signal", status: recoverabilityScore >= 70 ? "PASS" : "WARN", value: recoverabilityScore, reason: recoverabilityScore >= 70 ? "Recoverability signal is strong enough for public demo posture." : "Recoverability signal should be reviewed." });

  const failCount = checks.filter(c => c.status === "FAIL").length;
  const warnCount = checks.filter(c => c.status === "WARN").length;

  let validationState = "SAFE";
  let risk = "LOW";
  if (failCount >= 2) { validationState = "CRITICAL"; risk = "CRITICAL"; }
  else if (failCount === 1) { validationState = "RISK"; risk = "HIGH"; }
  else if (warnCount > 0) { validationState = "WATCH"; risk = "MEDIUM"; }

  const payload = {
    artifact: "XPADI_VALIDATION_ENGINE_V1",
    session_id: session.session_id,
    validation_state: validationState,
    risk,
    checks,
    summary: {
      total_checks: checks.length,
      pass: checks.filter(c => c.status === "PASS").length,
      warn: warnCount,
      fail: failCount,
      proof_chain_count: proofChainCount,
      continuity_chain_count: continuityChainCount,
      reasoning_confidence: reasoningScore,
      recoverability_score: recoverabilityScore
    },
    public_boundary: "Validation uses public ProofCheck artifacts only. No XPADI private mechanisms are exposed.",
    generated_at: new Date().toISOString()
  };

  const validationPath = path.join(outputDir, "final", "xpadi-validation.json");
  writeJson(validationPath, payload);
  return { validation: payload, validationPath };
}

module.exports = { validateXpadiArtifacts };
