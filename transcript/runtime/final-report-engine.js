const path = require("path");
const { writeJson, writeText } = require("./continuity-generator");

function buildFinalReport({ outputDir, session, decision, reasoning, explanation }) {
  const finalState = {
    artifact: "XPADI_FINAL_STATE_V1",
    session_id: session.session_id,
    decision: decision.decision,
    risk: decision.risk,
    score: decision.composite_score,
    recoverability: decision.recoverability,
    confidence: decision.confidence,
    proof_integrity: decision.proof_integrity,
    continuity: decision.continuity,
    state: reasoning?.finalState?.state || "SURVIVABILITY_REVIEWED",
    explanation: explanation?.explanation || decision.human_meaning,
    recommendation: explanation?.recommendation || "Review final report.",
    generated_at: new Date().toISOString(),
    public_boundary: "Final state is public-safe. No XPADI private mechanisms exposed."
  };

  const finalStatePath = path.join(outputDir, "final", "xpadi-final-state.json");
  writeJson(finalStatePath, finalState);

  const factors = explanation.factors.map((factor) => `
    <div class="factor">
      <div><strong>${factor.name}</strong><span>${factor.meaning}</span></div>
      <div class="factorScore">${factor.score}%</div>
    </div>
  `).join("");

  const reviewSignals = explanation.review_signals.length ? explanation.review_signals.join(", ") : "None";
  const strongSignals = explanation.strongest_signals.length ? explanation.strongest_signals.join(", ") : "None";

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>XPADI ProofCheck — Final Decision Report</title>
<style>
:root{--bg:#07111d;--panel:#0d1928;--orange:#ff9b45;--green:#7dffb1;--blue:#8bd3ff;--text:#f7fbff;--muted:#bfd0e2;--line:rgba(255,255,255,.13)}
body{margin:0;background:radial-gradient(circle at top right,#123659 0,#07111d 42%,#050b12 100%);color:var(--text);font-family:Segoe UI,Arial,sans-serif}
.wrap{max-width:1180px;margin:auto;padding:54px 26px}
.hero{border:1px solid rgba(255,155,69,.46);border-radius:34px;padding:38px;background:linear-gradient(135deg,rgba(16,31,51,.96),rgba(7,17,29,.96));box-shadow:0 24px 70px rgba(0,0,0,.35)}
.tag{color:var(--orange);font-size:13px;font-weight:900;letter-spacing:5px}
h1{font-size:52px;margin:14px 0 10px;line-height:1.03}
.sub{color:var(--muted);font-size:20px;line-height:1.5;max-width:940px}
.decision{font-size:64px;color:var(--green);font-weight:950;margin-top:22px}
.flow{margin:28px 0;padding:18px;border-radius:18px;background:#0e1b2b;color:var(--orange);font-weight:900;font-size:21px;text-align:center}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:16px;margin-top:24px}
.card{border:1px solid var(--line);border-radius:22px;background:rgba(13,25,40,.92);padding:20px}
.card h3{margin:0 0 12px;color:var(--blue);font-size:16px}.score{font-size:42px;color:var(--green);font-weight:950}
.section{margin-top:28px}.meaning{font-size:18px;color:var(--muted);line-height:1.65}
.factor{display:flex;justify-content:space-between;gap:18px;border-top:1px solid var(--line);padding:16px 0}
.factor:first-child{border-top:0}.factor strong{display:block;color:#fff;font-size:17px}.factor span{display:block;color:var(--muted);margin-top:5px;line-height:1.45}.factorScore{font-size:28px;color:var(--green);font-weight:950}
.footer{margin-top:30px;color:#8eb6d6;font-size:13px}
</style>
</head>
<body>
<main class="wrap">
<section class="hero">
  <div class="tag">XPADI PROOFCHECK FINAL DECISION</div>
  <h1>Evidence becomes a public continuity decision.</h1>
  <div class="sub">One execution path converts proof artifacts, continuity chains, runtime intelligence, deterministic reasoning, and decision explanation into a final public-safe package.</div>
  <div class="decision">${decision.decision}</div>
  <div class="flow">INPUT → PROOF → EVIDENCE → REASONING → DECISION → EXPLANATION → FINAL STATE</div>
</section>

<section class="grid">
  <div class="card"><h3>Composite Score</h3><div class="score">${decision.composite_score}%</div></div>
  <div class="card"><h3>Recoverability</h3><div class="score">${decision.recoverability}%</div></div>
  <div class="card"><h3>Confidence</h3><div class="score">${decision.confidence}%</div></div>
  <div class="card"><h3>Risk</h3><div class="score">${decision.risk}</div></div>
</section>

<section class="card section"><h3>Why this decision?</h3><div class="meaning">${explanation.explanation}</div></section>
<section class="card section"><h3>Decision Basis</h3>${factors}</section>

<section class="grid section">
  <div class="card"><h3>Strongest Signals</h3><div class="meaning">${strongSignals}</div></div>
  <div class="card"><h3>Signals to Review</h3><div class="meaning">${reviewSignals}</div></div>
</section>

<section class="card section"><h3>Public Recommendation</h3><div class="meaning">${explanation.recommendation}</div></section>
<section class="card section"><h3>Public Boundary</h3><div class="meaning">This report uses public ProofCheck evidence only. It does not disclose XPADI authority, reconstruction, recovery, crypto, or private survivability mechanisms.</div></section>
<div class="footer">Session: ${session.session_id}</div>
</main>
</body>
</html>`;

  const reportPath = path.join(outputDir, "final", "xpadi-final-report.html");
  writeText(reportPath, html);
  return { finalState, finalStatePath, finalReportPath: reportPath };
}

module.exports = { buildFinalReport };
