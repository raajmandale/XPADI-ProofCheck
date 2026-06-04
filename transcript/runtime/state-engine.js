const path = require("path");
const { writeJson, writeText } = require("./continuity-generator");

function determineState(session) {
  const modules = session.modules || [];
  const hasProof = modules.some((m) => ["PROVE_FILE", "PROVE_MULTI", "PROVE_FOLDER"].includes(m.module) && m.status === "generated");
  const hasEvidence = modules.some((m) => m.module === "GENERATE_EVIDENCE");
  const hasReport = modules.some((m) => m.module === "GENERATE_REPORT");
  const hasContinuity = modules.some((m) => m.module === "GENERATE_CONTINUITY");

  if (hasProof && hasEvidence && hasReport && hasContinuity) return "CONTINUITY_READY";
  if (hasProof && hasEvidence && hasReport) return "REVIEW_READY";
  if (hasProof && hasEvidence) return "EVIDENCED";
  if (hasProof) return "PROVEN";
  return "OBSERVED";
}

function buildRuntimeState({ outputDir, session }) {
  const state = {
    artifact: "TRANSCRIPT_RUNTIME_STATE_V4",
    runtime: "TRANSCRIPT_RUNTIME_V4",
    session_id: session.session_id,
    state: determineState(session),
    state_path: ["CREATED", "OBSERVED", "PROVEN", "EVIDENCED", "REVIEW_READY", "CONTINUITY_READY"],
    current_capabilities: {
      identity: "observable",
      integrity: "observable",
      evidence: "generated",
      report: "generated",
      continuity: "observable"
    },
    public_boundary: "Runtime state is deterministic and public-safe.",
    generated_at: new Date().toISOString()
  };

  const outPath = path.join(outputDir, "intelligence", "runtime-state.json");
  writeJson(outPath, state);

  const md = `# TRANSCRIPT Runtime State V4

Current State:

\`${state.state}\`

State Path:

${state.state_path.map((s) => `- ${s}`).join("\n")}
`;

  writeText(path.join(outputDir, "intelligence", "runtime-state.md"), md);
  return { runtimeState: state, runtimeStatePath: outPath };
}

module.exports = { buildRuntimeState };
