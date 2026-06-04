const path = require("path");
const { writeJson, writeText } = require("./continuity-generator");

function safeRel(workspaceRoot, p) {
  if (!p) return null;
  return path.relative(workspaceRoot, p).replace(/\\/g, "/");
}

function buildConsequenceGraph({ workspaceRoot, outputDir, session }) {
  const modules = session.modules || [];

  const consequenceNodes = [];
  const consequenceEdges = [];

  for (const mod of modules) {
    const moduleId = `module:${mod.module}`;
    consequenceNodes.push({
      id: moduleId,
      kind: "runtime_module",
      label: mod.module,
      status: mod.status || "unknown",
      target: mod.target || null
    });

    if (mod.module === "PROVE_FILE") {
      consequenceNodes.push(
        { id: "artifact:file-proof", kind: "proof_artifact", label: "file-proof.json", status: "generated" },
        { id: "artifact:file-evidence", kind: "evidence_artifact", label: "file-evidence.md", status: "generated" },
        { id: "artifact:file-report", kind: "report_artifact", label: "file-report.html", status: "generated" }
      );
      consequenceEdges.push(
        { from: moduleId, to: "artifact:file-proof", consequence: "creates file identity baseline" },
        { from: "artifact:file-proof", to: "artifact:file-evidence", consequence: "makes identity and integrity explainable" },
        { from: "artifact:file-evidence", to: "artifact:file-report", consequence: "makes result reviewable" }
      );
    }

    if (mod.module === "PROVE_MULTI") {
      consequenceNodes.push({ id: "artifact:multi-suite", kind: "proof_suite", label: "multi-file output suite", status: mod.status });
      consequenceEdges.push({ from: moduleId, to: "artifact:multi-suite", consequence: "turns multiple files into a shared evidence baseline" });
    }

    if (mod.module === "PROVE_FOLDER") {
      consequenceNodes.push({ id: "artifact:folder-suite", kind: "folder_audit", label: "folder audit output suite", status: mod.status });
      consequenceEdges.push({ from: moduleId, to: "artifact:folder-suite", consequence: "turns a folder into an observable baseline" });
    }

    if (mod.module === "GENERATE_CONTINUITY") {
      consequenceNodes.push({ id: "artifact:continuity-session", kind: "continuity_artifact", label: "continuity-session.json", status: "generated" });
      consequenceEdges.push(
        { from: "artifact:file-proof", to: "artifact:continuity-session", consequence: "file proof contributes to continuity state" },
        { from: "artifact:multi-suite", to: "artifact:continuity-session", consequence: "multi-file proof contributes to continuity state" },
        { from: "artifact:folder-suite", to: "artifact:continuity-session", consequence: "folder audit contributes to continuity state" }
      );
    }
  }

  const graph = {
    artifact: "TRANSCRIPT_CONSEQUENCE_GRAPH_V4",
    runtime: "TRANSCRIPT_RUNTIME_V4",
    session_id: session.session_id,
    summary: "Maps runtime modules to the public consequences they produce.",
    nodes: consequenceNodes,
    edges: consequenceEdges,
    public_boundary: "Public consequence model only. No XPADI private mechanisms exposed.",
    generated_at: new Date().toISOString()
  };

  const outPath = path.join(outputDir, "intelligence", "consequence-graph.json");
  writeJson(outPath, graph);

  const md = [
    "# TRANSCRIPT Consequence Graph V4",
    "",
    "This file records what each public runtime action produced.",
    "",
    ...consequenceEdges.map((edge) => `- ${edge.from} → ${edge.to}: ${edge.consequence}`)
  ].join("\n");

  writeText(path.join(outputDir, "intelligence", "consequence-graph.md"), md);
  return { consequenceGraph: graph, consequenceGraphPath: outPath };
}

module.exports = { buildConsequenceGraph };
