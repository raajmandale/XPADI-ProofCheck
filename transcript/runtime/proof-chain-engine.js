const path = require("path");
const { writeJson, writeText } = require("./continuity-generator");

function buildProofChain({ outputDir, session }) {
  const chain = {
    artifact: "TRANSCRIPT_PROOF_CHAIN_V4",
    runtime: "TRANSCRIPT_RUNTIME_V4",
    session_id: session.session_id,
    chain: [
      { step: 1, name: "INPUT", meaning: "A file, file group, folder, or transcript request enters the public ProofCheck surface." },
      { step: 2, name: "HASH", meaning: "SHA-256 creates a public identity baseline." },
      { step: 3, name: "PROOF", meaning: "Proof JSON records the observable identity and integrity state." },
      { step: 4, name: "EVIDENCE", meaning: "Markdown evidence translates the proof into human-readable form." },
      { step: 5, name: "REPORT", meaning: "HTML report creates reviewable output." },
      { step: 6, name: "CONTINUITY", meaning: "Continuity artifact records that evidence remains observable after execution." }
    ],
    public_boundary: "Proof chain describes public artifact flow only.",
    generated_at: new Date().toISOString()
  };

  const outPath = path.join(outputDir, "intelligence", "proof-chain.json");
  writeJson(outPath, chain);

  const md = [
    "# TRANSCRIPT Proof Chain V4",
    "",
    ...chain.chain.map((c) => `${c.step}. **${c.name}** — ${c.meaning}`)
  ].join("\n");

  writeText(path.join(outputDir, "intelligence", "proof-chain.md"), md);
  return { proofChain: chain, proofChainPath: outPath };
}

module.exports = { buildProofChain };
