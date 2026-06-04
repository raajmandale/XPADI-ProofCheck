const path = require("path");
const fs = require("fs");
const { writeJson } = require("./continuity-generator");

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function makeDecision({ outputDir, session, validation }) {
  const finalStatePath = path.join(outputDir, "reasoning", "final-state.json");
  const runtimeStatePath = path.join(outputDir, "intelligence", "runtime-state.json");
  const proofChainPath = path.join(outputDir, "intelligence", "proof-chain.json");
  const continuityChainPath = path.join(outputDir, "intelligence", "continuity-chain.json");

  const finalState = readJsonIfExists(finalStatePath);
  const runtimeState = readJsonIfExists(runtimeStatePath);
  const proofChain = readJsonIfExists(proofChainPath);
  const continuityChain = readJsonIfExists(continuityChainPath);

  const recoverability = finalState?.recoverability_score ?? 0;
  const confidence = finalState?.confidence_score ?? 0;
  const proofIntegrity = Array.isArray(proofChain?.chain) ? Math.min(100, proofChain.chain.length * 16) : 0;
  const continuity = Array.isArray(continuityChain?.chain) ? Math.min(100, continuityChain.chain.length * 16) : 0;

  const composite = Math.round(recoverability * 0.32 + confidence * 0.28 + proofIntegrity * 0.2 + continuity * 0.2);

  let decision = validation?.validation_state || "UNKNOWN";
  let risk = validation?.risk || "UNKNOWN";

  if (decision === "UNKNOWN") {
    if (composite >= 85) { decision = "SAFE"; risk = "LOW"; }
    else if (composite >= 70) { decision = "WATCH"; risk = "MEDIUM"; }
    else if (composite >= 45) { decision = "RISK"; risk = "HIGH"; }
    else { decision = "CRITICAL"; risk = "CRITICAL"; }
  }

  const payload = {
    artifact: "XPADI_FINAL_DECISION_V1",
    session_id: session.session_id,
    decision,
    risk,
    composite_score: composite,
    recoverability,
    confidence,
    proof_integrity: proofIntegrity,
    continuity,
    validation_state: validation?.validation_state || "NOT_RUN",
    validation_summary: validation?.summary || null,
    runtime_state: runtimeState?.state || "UNKNOWN",
    human_meaning: decision === "SAFE" ? "The public evidence chain passed validation and supports a safe demonstration posture." : decision === "WATCH" ? "The evidence chain is usable, but validation detected signals that should be reviewed." : "Validation detected missing, weak, or risky evidence conditions.",
    public_boundary: "Decision uses public ProofCheck validation artifacts only. No XPADI private mechanisms exposed.",
    generated_at: new Date().toISOString()
  };

  const decisionPath = path.join(outputDir, "final", "xpadi-final-decision.json");
  writeJson(decisionPath, payload);
  return { decision: payload, decisionPath };
}

module.exports = { makeDecision };
