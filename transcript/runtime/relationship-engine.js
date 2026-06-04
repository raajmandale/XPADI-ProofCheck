const path = require("path");
const { writeJson, writeText } = require("./continuity-generator");

function buildArtifactRelationships({ outputDir, session }) {
  const relationships = {
    artifact: "TRANSCRIPT_ARTIFACT_RELATIONSHIPS_V4",
    runtime: "TRANSCRIPT_RUNTIME_V4",
    session_id: session.session_id,
    root: "sample.txt",
    relationships: [
      {
        source: "sample.txt",
        relation: "produces",
        targets: ["file-proof.json", "file-evidence.md", "file-report.html"]
      },
      {
        source: "multi-file-proof-suite/input",
        relation: "produces",
        targets: ["suite-proof.json", "suite-evidence.md", "suite-report.html", "suite-benchmark.json"]
      },
      {
        source: "folder-proof-audit/input",
        relation: "produces",
        targets: ["suite-proof.json", "suite-evidence.md", "suite-report.html", "suite-benchmark.json"]
      },
      {
        source: "proof + evidence + report outputs",
        relation: "supports",
        targets: ["continuity-session.json", "runtime-intelligence-report.html"]
      }
    ],
    public_boundary: "Artifact relationships describe output lineage only.",
    generated_at: new Date().toISOString()
  };

  const outPath = path.join(outputDir, "intelligence", "artifact-relationships.json");
  writeJson(outPath, relationships);

  const md = [
    "# TRANSCRIPT Artifact Relationships V4",
    "",
    "Public output lineage:",
    "",
    ...relationships.relationships.map((r) => `- ${r.source} ${r.relation} ${r.targets.join(", ")}`)
  ].join("\n");

  writeText(path.join(outputDir, "intelligence", "artifact-relationships.md"), md);
  return { relationships, relationshipsPath: outPath };
}

module.exports = { buildArtifactRelationships };
