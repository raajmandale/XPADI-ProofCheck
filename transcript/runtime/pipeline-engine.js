const path = require("path");
const { validateXpadiArtifacts } = require("./validation-engine");
const { makeDecision } = require("./decision-engine");
const { explainDecision } = require("./decision-explainer");
const { buildFinalReport } = require("./final-report-engine");
const { writeJson } = require("./continuity-generator");

function runXpadiPipeline({ outputDir, session, reasoning }) {
  const { validation, validationPath } = validateXpadiArtifacts({ outputDir, session });
  const { decision, decisionPath } = makeDecision({ outputDir, session, validation });
  const explanation = explainDecision({ decision, reasoning, validation });

  const explanationPath = path.join(outputDir, "final", "xpadi-decision-explanation.json");
  writeJson(explanationPath, explanation);

  const { finalState, finalStatePath, finalReportPath } = buildFinalReport({
    outputDir, session, decision, reasoning, explanation, validation
  });

  return {
    artifact: "XPADI_ONE_COMMAND_PIPELINE_V1",
    validation,
    decision,
    explanation,
    finalState,
    paths: {
      validation: validationPath,
      decision: decisionPath,
      explanation: explanationPath,
      finalState: finalStatePath,
      finalReport: finalReportPath
    }
  };
}

module.exports = { runXpadiPipeline };
