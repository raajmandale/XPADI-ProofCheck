const path = require("path");
const { writeJson, writeText } = require("./continuity-generator");

function buildContinuityChain({ outputDir, session }) {
  const chain = {
    artifact: "TRANSCRIPT_CONTINUITY_CHAIN_V4",
    runtime: "TRANSCRIPT_RUNTIME_V4",
    session_id: session.session_id,
    chain: [
      { stage: "INPUT", state: "received", survives_as: "execution request" },
      { stage: "IDENTITY", state: "observable", survives_as: "hash baseline" },
      { stage: "INTEGRITY", state: "observable", survives_as: "proof record" },
      { stage: "EVIDENCE", state: "generated", survives_as: "markdown + json records" },
      { stage: "OBSERVABILITY", state: "reviewable", survives_as: "HTML report + logs" },
      { stage: "CONTINUITY", state: "ready", survives_as: "continuity session artifact" }
    ],
    result: "CONTINUITY_READY",
    public_boundary: "Continuity chain is a public result chain, not XPADI private recovery logic.",
    generated_at: new Date().toISOString()
  };

  const outPath = path.join(outputDir, "intelligence", "continuity-chain.json");
  writeJson(outPath, chain);

  const md = [
    "# TRANSCRIPT Continuity Chain V4",
    "",
    ...chain.chain.map((c) => `- **${c.stage}** → ${c.state} → survives as: ${c.survives_as}`),
    "",
    `Result: **${chain.result}**`
  ].join("\n");

  writeText(path.join(outputDir, "intelligence", "continuity-chain.md"), md);
  return { continuityChain: chain, continuityChainPath: outPath };
}

module.exports = { buildContinuityChain };
