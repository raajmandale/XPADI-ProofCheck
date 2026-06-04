const path = require("path");
const { writeText } = require("./continuity-generator");

function buildRuntimeIntelligenceReport({
  outputDir,
  session,
  consequenceGraph,
  relationships,
  runtimeState,
  proofChain,
  continuityChain
}) {
  const consequenceRows = consequenceGraph.edges.map((edge) => `
    <tr><td>${edge.from}</td><td>${edge.to}</td><td>${edge.consequence}</td></tr>
  `).join("");

  const relationRows = relationships.relationships.map((r) => `
    <tr><td>${r.source}</td><td>${r.relation}</td><td>${r.targets.join(", ")}</td></tr>
  `).join("");

  const proofRows = proofChain.chain.map((s) => `
    <div class="step"><strong>${s.step}. ${s.name}</strong><span>${s.meaning}</span></div>
  `).join("");

  const continuityRows = continuityChain.chain.map((s) => `
    <div class="step"><strong>${s.stage}</strong><span>${s.state} → ${s.survives_as}</span></div>
  `).join("");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>TRANSCRIPT Runtime V4 — Execution Intelligence</title>
<style>
body{margin:0;background:#07111d;color:white;font-family:Segoe UI,Arial,sans-serif}
.wrap{max-width:1180px;margin:auto;padding:54px 26px}
.hero{border:1px solid rgba(255,155,69,.45);border-radius:30px;padding:34px;background:linear-gradient(135deg,#121f31,#07111d)}
.tag{color:#ff9b45;font-size:13px;font-weight:900;letter-spacing:5px}
h1{font-size:48px;margin:12px 0 8px}.sub{color:#cbd8e5;font-size:19px;line-height:1.5}
.state{font-size:42px;color:#7dffb1;font-weight:900;margin-top:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:24px}
.card,.step{border:1px solid rgba(255,255,255,.12);border-radius:20px;background:#0d1928;padding:18px}
.card h3{margin-top:0;color:#ffb067}
.step{margin:10px 0}.step strong{display:block;color:#ffb067}.step span{color:#cbd8e5}
table{width:100%;border-collapse:collapse;margin-top:14px;background:#0d1928;border-radius:18px;overflow:hidden}
th,td{padding:14px;border-bottom:1px solid rgba(255,255,255,.1);text-align:left;vertical-align:top}
th{color:#ffb067}
.section{margin-top:38px}
.flow{margin:26px 0;padding:18px;border-radius:18px;background:#0e1b2b;color:#ffb067;font-weight:900;font-size:22px;text-align:center}
code{color:#ffb067}
</style>
</head>
<body>
<main class="wrap">
<section class="hero">
<div class="tag">TRANSCRIPT RUNTIME V4</div>
<h1>Execution Intelligence Layer</h1>
<div class="sub">Transcript now explains what happened, what was produced, what depends on it, and what remains observable as continuity.</div>
<div class="state">${runtimeState.state}</div>
<div class="flow">INPUT → IDENTITY → INTEGRITY → EVIDENCE → OBSERVABILITY → CONTINUITY</div>
<p><strong>Session:</strong> <code>${session.session_id}</code></p>
</section>

<section class="section">
<h2>Consequence graph</h2>
<table><thead><tr><th>From</th><th>To</th><th>Consequence</th></tr></thead><tbody>${consequenceRows}</tbody></table>
</section>

<section class="section">
<h2>Artifact relationships</h2>
<table><thead><tr><th>Source</th><th>Relation</th><th>Targets</th></tr></thead><tbody>${relationRows}</tbody></table>
</section>

<section class="section">
<h2>Proof chain</h2>
<div class="grid">${proofRows}</div>
</section>

<section class="section">
<h2>Continuity chain</h2>
<div class="grid">${continuityRows}</div>
</section>
</main>
</body>
</html>`;

  const reportPath = path.join(outputDir, "html", "runtime-intelligence-report-v4.html");
  writeText(reportPath, html);
  return reportPath;
}

module.exports = { buildRuntimeIntelligenceReport };
