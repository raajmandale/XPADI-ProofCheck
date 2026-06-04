const { runXpadiPipeline } =
require("./pipeline-engine");
const fs = require("fs");
const path = require("path");
const { buildRuntimeIntelligenceReport } =
require("./intelligence-report");
const { evaluateIntent } =
require("./intent-engine");
const { parseTRS } = require("./trs-parser");
const { routeCommands } = require("./trs-router");
const {
  buildExecutionGraph,
  buildDependencyMap,
  buildExecutionTrace,
  buildRuntimeVisualReport
} = require("./execution-graph");
const { buildConsequenceGraph } = require("./consequence-engine");
const { buildArtifactRelationships } = require("./relationship-engine");
const { buildRuntimeState } = require("./state-engine");
const { buildProofChain } = require("./proof-chain-engine");
const { buildContinuityChain } = require("./continuity-chain-engine");

const { runReasoningEngine } =
require("./reasoning-engine");

const { buildReasoningReport } =
require("./reasoning-report");


async function main() {
  const workspaceRoot = process.cwd();
  const trsArg = process.argv[2];

  if (!trsArg) {
    console.error("Usage: npm run trs -- transcript/examples/sample-v4.trs");
    process.exit(1);
  }

  const trsPath = path.resolve(workspaceRoot, trsArg);

  console.log("TRANSCRIPT_RUNTIME_V4");
  console.log("Input:", trsPath);
  console.log("");

  const parsed = parseTRS(trsPath);
  const result = await routeCommands({ workspaceRoot, parsed });
  let detectedIntent = null;

for (const command of parsed.commands) {

  if (
    command.type === "INTENT" ||
    command.command === "INTENT"
  ) {

    detectedIntent =
      command.value ||
      command.target ||
      command.argument;

  }

}

  for (const event of result.events) console.log(event);

  const outputDir = path.join(workspaceRoot, "transcript", "output");

  const { graph, graphPath } = buildExecutionGraph({ workspaceRoot, outputDir, parsed, session: result.session });
  const { dependencyMap, mapPath } = buildDependencyMap({ outputDir, session: result.session });
  const { tracePath } = buildExecutionTrace({ outputDir, session: result.session, graphPath, dependencyMapPath: mapPath });
  const visualReportPath = buildRuntimeVisualReport({ outputDir, session: result.session, graph, dependencyMap, tracePath });

  const { consequenceGraph, consequenceGraphPath } = buildConsequenceGraph({ workspaceRoot, outputDir, session: result.session });
  const { relationships, relationshipsPath } = buildArtifactRelationships({ outputDir, session: result.session });
  const { runtimeState, runtimeStatePath } = buildRuntimeState({ outputDir, session: result.session });
  const { proofChain, proofChainPath } = buildProofChain({ outputDir, session: result.session });
  const { continuityChain, continuityChainPath } = buildContinuityChain({ outputDir, session: result.session });

  if (detectedIntent) {

  const intentResult =
    evaluateIntent(detectedIntent);

  const intentPath = path.join(
    outputDir,
    "intelligence",
    "intent-result.json"
  );

  fs.mkdirSync(
    path.dirname(intentPath),
    { recursive: true }
  );

  fs.writeFileSync(
    intentPath,
    JSON.stringify(
      {
        intent: detectedIntent,
        ...intentResult,
        timestamp:
          new Date().toISOString()
      },
      null,
      2
    )
  );

  console.log(
    "✓ INTENT ANALYSIS →",
    intentPath
  );

}
  const intelligenceReportPath = buildRuntimeIntelligenceReport({
    outputDir,
    session: result.session,
    consequenceGraph,
    relationships,
    runtimeState,
    proofChain,
    continuityChain
  });

const reasoning = runReasoningEngine({
  outputDir,
  session: result.session,
  consequenceGraph,
  runtimeState,
  proofChain,
  continuityChain
});

const reasoningReportPath =
buildReasoningReport({
  outputDir,
  reasoning
});

const pipeline =
runXpadiPipeline({
  outputDir,
  session: result.session,
  reasoning
});
  console.log("");
  console.log("✓ EXECUTION GRAPH →", graphPath);
  console.log("✓ DEPENDENCY MAP →", mapPath);
  console.log("✓ EXECUTION TRACE →", tracePath);
  console.log("✓ RUNTIME VISUAL REPORT →", visualReportPath);
  console.log("✓ CONSEQUENCE GRAPH →", consequenceGraphPath);
  console.log("✓ ARTIFACT RELATIONSHIPS →", relationshipsPath);
  console.log("✓ RUNTIME STATE →", runtimeStatePath);
  console.log("✓ PROOF CHAIN →", proofChainPath);
  console.log("✓ CONTINUITY CHAIN →", continuityChainPath);
  console.log("✓ RUNTIME INTELLIGENCE REPORT →", intelligenceReportPath);
  console.log("✓ XPADI FINAL DECISION →", pipeline.paths.decision);
console.log("✓ XPADI FINAL STATE →", pipeline.paths.finalState);
console.log("✓ XPADI FINAL REPORT →", pipeline.paths.finalReport);
console.log("XPADI DECISION:", pipeline.decision.decision);
console.log("XPADI SCORE:", pipeline.decision.composite_score + "%");
console.log("XPADI VALIDATION:", pipeline.validation.validation_state);
  
  console.log(
 "✓ REASONING STATE →",
 reasoning.paths.reasoningState
);

console.log(
 "✓ RECOVERY ANALYSIS →",
 reasoning.paths.recovery
);

console.log(
 "✓ CONFIDENCE ANALYSIS →",
 reasoning.paths.confidence
);

console.log(
 "✓ FINAL STATE →",
 reasoning.paths.finalState
);

console.log(
 "✓ REASONING REPORT →",
 reasoningReportPath
);

  console.log("");
  console.log("Runtime Complete");
  console.log("Session:", result.outputs.session);
  console.log("Log:", result.outputs.log);
  console.log("Continuity:", result.outputs.continuity);
}

main().catch((err) => {
  console.error("TRANSCRIPT_RUNTIME_ERROR");
  console.error(err.message);
  process.exit(1);
});
