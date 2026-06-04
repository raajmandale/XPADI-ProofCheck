const fs = require("fs");
const path = require("path");
const { writeJson } = require("./continuity-generator");
const { classifyState } = require("./state-classifier");
const { analyzeRecovery } = require("./recovery-engine");
const { analyzeConfidence } = require("./confidence-engine");

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runReasoningEngine({ outputDir, session }) {
  const intelligenceDir = path.join(outputDir, "intelligence");
  const reasoningDir = path.join(outputDir, "reasoning");

  const inputs = {
    proofChain: readJsonIfExists(path.join(intelligenceDir, "proof-chain.json")),
    continuityChain: readJsonIfExists(path.join(intelligenceDir, "continuity-chain.json")),
    runtimeState: readJsonIfExists(path.join(intelligenceDir, "runtime-state.json")),
    relationships: readJsonIfExists(path.join(intelligenceDir, "artifact-relationships.json")),
    consequenceGraph: readJsonIfExists(path.join(intelligenceDir, "consequence-graph.json"))
  };

  const classification = classifyState(inputs);
  const recovery = analyzeRecovery(classification);
  const confidence = analyzeConfidence(classification, recovery);

  const finalState = {
    artifact: "XPADI_FINAL_REASONING_STATE_V1",
    session_id: session.session_id,
    state: classification.state,
    recoverability_score: recovery.recoverability_score,
    recoverability: recovery.recoverability,
    confidence_score: confidence.confidence_score,
    proof_strength: confidence.proof_strength,
    continuity_strength: confidence.continuity_strength,
    public_boundary: "Reasoning uses public artifacts only. No XPADI private mechanisms exposed.",
    generated_at: new Date().toISOString()
  };

  const reasoningStatePath = path.join(reasoningDir, "reasoning-state.json");
  const recoveryPath = path.join(reasoningDir, "recovery-analysis.json");
  const confidencePath = path.join(reasoningDir, "confidence-analysis.json");
  const finalStatePath = path.join(reasoningDir, "final-state.json");

  writeJson(reasoningStatePath, { artifact: "XPADI_REASONING_STATE_V1", session_id: session.session_id, classification });
  writeJson(recoveryPath, recovery);
  writeJson(confidencePath, confidence);
  writeJson(finalStatePath, finalState);

 return {
  classification,
  recovery,
  confidence,
  finalState,

  paths: {
    reasoningState: reasoningStatePath,
    recovery: recoveryPath,
    confidence: confidencePath,
    finalState: finalStatePath
  }
};

}

module.exports = { runReasoningEngine };