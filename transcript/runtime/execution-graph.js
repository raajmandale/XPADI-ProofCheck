const path = require("path");
const { ensureDir, writeJson, writeText } = require("./continuity-generator");

function buildExecutionGraph({ workspaceRoot, outputDir, parsed, session }) {
  const nodes = [];
  const edges = [];

  for (const [index, cmd] of parsed.commands.entries()) {
    const nodeId = `${String(index + 1).padStart(2, "0")}_${cmd.type}`;
    nodes.push({
      id: nodeId,
      type: cmd.type,
      raw: cmd.raw,
      sourceLine: cmd.sourceLine,
      status: "executed"
    });

    if (index > 0) {
      const prevId = `${String(index).padStart(2, "0")}_${parsed.commands[index - 1].type}`;
      edges.push({
        from: prevId,
        to: nodeId,
        relation: "sequence"
      });
    }
  }

  const graph = {
    artifact: "TRANSCRIPT_EXECUTION_GRAPH_V3",
    runtime: "TRANSCRIPT_RUNTIME_V3",
    session_id: session.session_id,
    graph_type: "public_execution_lineage",
    nodes,
    edges,
    generated_at: new Date().toISOString(),
    boundary: "Public execution graph only. No XPADI private mechanisms exposed."
  };

  const graphPath = path.join(outputDir, "graph", "execution-graph.json");
  writeJson(graphPath, graph);
  return { graph, graphPath };
}

function buildDependencyMap({ outputDir, session }) {
  const dependencyMap = {
    artifact: "TRANSCRIPT_DEPENDENCY_MAP_V3",
    runtime: "TRANSCRIPT_RUNTIME_V3",
    session_id: session.session_id,
    modules: [
      {
        module: "PROVE_FILE",
        depends_on: ["proofcheck-pipeline input"],
        produces: ["file-proof.json", "file-evidence.md", "file-report.html"]
      },
      {
        module: "PROVE_MULTI",
        depends_on: ["multi-file-proof-suite"],
        produces: ["suite-proof.json", "suite-evidence.md", "suite-report.html", "suite-benchmark.json"]
      },
      {
        module: "PROVE_FOLDER",
        depends_on: ["folder-proof-audit"],
        produces: ["suite-proof.json", "suite-evidence.md", "suite-report.html", "suite-benchmark.json"]
      },
      {
        module: "GENERATE_CONTINUITY",
        depends_on: ["proof outputs", "evidence outputs", "report outputs"],
        produces: ["continuity-session.json"]
      },
      {
        module: "OPEN_SENTINEL",
        depends_on: ["sentinel-studio"],
        produces: ["localhost:8080 instruction"]
      }
    ],
    boundary: "Dependency map describes public module relationships only.",
    generated_at: new Date().toISOString()
  };

  const mapPath = path.join(outputDir, "graph", "dependency-map.json");
  writeJson(mapPath, dependencyMap);
  return { dependencyMap, mapPath };
}

function buildExecutionTrace({ outputDir, session, graphPath, dependencyMapPath }) {
  const trace = {
    artifact: "TRANSCRIPT_EXECUTION_TRACE_V3",
    runtime: "TRANSCRIPT_RUNTIME_V3",
    session_id: session.session_id,
    events: session.events.map((event, index) => ({
      step: index + 1,
      event,
      state: "completed"
    })),
    graph: graphPath,
    dependency_map: dependencyMapPath,
    continuity: "observable",
    generated_at: new Date().toISOString(),
    boundary: "Trace is public-safe and does not expose XPADI private mechanisms."
  };

  const tracePath = path.join(outputDir, "trace", "execution-trace.json");
  writeJson(tracePath, trace);
  return { trace, tracePath };
}

function buildRuntimeVisualReport({ outputDir, session, graph, dependencyMap, tracePath }) {
  const nodeHtml = graph.nodes.map((node, index) => `
    <div class="node">
      <div class="step">STEP ${index + 1}</div>
      <div class="type">${node.type.replaceAll("_", " ")}</div>
      <div class="raw">${node.raw}</div>
      <div class="status">EXECUTED</div>
    </div>
  `).join("");

  const moduleHtml = dependencyMap.modules.map((m) => `
    <div class="module">
      <div class="module-title">${m.module.replaceAll("_", " ")}</div>
      <div><strong>Depends on:</strong> ${m.depends_on.join(", ")}</div>
      <div><strong>Produces:</strong> ${m.produces.join(", ")}</div>
    </div>
  `).join("");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>TRANSCRIPT Runtime V3 — Execution Orchestration</title>
<style>
  body{margin:0;background:#07111d;color:white;font-family:Segoe UI,Arial,sans-serif}
  .wrap{max-width:1180px;margin:auto;padding:54px 26px}
  .hero{border:1px solid rgba(255,155,69,.42);border-radius:30px;padding:34px;background:linear-gradient(135deg,#111d2e,#07111d)}
  .tag{color:#ff9b45;font-size:13px;font-weight:900;letter-spacing:5px}
  h1{font-size:48px;margin:12px 0 8px}
  .sub{color:#cbd8e5;font-size:20px;line-height:1.5}
  .flow{margin:30px 0;padding:18px;border-radius:18px;background:#0e1b2b;color:#ffb067;font-weight:900;font-size:22px;text-align:center}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:24px}
  .node,.module{border:1px solid rgba(255,255,255,.12);border-radius:20px;background:#0d1928;padding:18px}
  .step{color:#ff9b45;font-size:12px;font-weight:900;letter-spacing:3px}
  .type,.module-title{font-size:20px;font-weight:900;margin:8px 0;color:white}
  .raw{color:#aabbd0}
  .status{margin-top:12px;color:#7dffb1;font-weight:900}
  .section{margin-top:38px}
  code{color:#ffb067;word-break:break-all}
</style>
</head>
<body>
<main class="wrap">
  <section class="hero">
    <div class="tag">TRANSCRIPT RUNTIME V3</div>
    <h1>Execution orchestration layer</h1>
    <div class="sub">A .trs file now produces an execution graph, session lineage, dependency map, execution trace, and continuity report across public ProofCheck modules.</div>
    <div class="flow">TRS → COMMAND GRAPH → MODULE EXECUTION → TRACE → CONTINUITY</div>
    <p><strong>Session:</strong> <code>${session.session_id}</code></p>
  </section>

  <section class="section">
    <h2>Execution graph</h2>
    <div class="grid">${nodeHtml}</div>
  </section>

  <section class="section">
    <h2>Runtime dependency map</h2>
    <div class="grid">${moduleHtml}</div>
  </section>

  <section class="section">
    <h2>Trace artifact</h2>
    <p><code>${tracePath}</code></p>
  </section>
</main>
</body>
</html>`;

  const reportPath = path.join(outputDir, "html", "runtime-visual-report-v3.html");
  writeText(reportPath, html);
  return reportPath;
}

module.exports = {
  buildExecutionGraph,
  buildDependencyMap,
  buildExecutionTrace,
  buildRuntimeVisualReport
};
