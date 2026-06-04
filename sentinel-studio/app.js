function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

async function loadJson(path) {
  const res = await fetch(path + "?t=" + Date.now());
  if (!res.ok) throw new Error(path);
  return res.json();
}

const scenarioText = {
  "deletion": "Deletion tests whether a recovery posture remains explainable after expected data loss.",
  "corruption": "Corruption tests whether evidence and continuity signals remain useful when integrity becomes uncertain.",
  "ransomware": "Ransomware tests whether recovery confidence can be discussed without claiming attack prevention.",
  "credential-loss": "Credential loss tests whether continuity confidence can be evaluated when access becomes the failure point.",
  "device-loss": "Device loss tests whether recovery posture depends too heavily on one physical endpoint."
};

function bindScenario() {
  const selector = document.getElementById("scenario");
  const meaning = document.getElementById("scenarioMeaning");
  if (!selector || !meaning) return;

  selector.addEventListener("change", () => {
    meaning.textContent = scenarioText[selector.value] || scenarioText.deletion;
  });
}

async function boot() {
  const base = "../transcript/output";

  const decision = await loadJson(`${base}/final/xpadi-final-decision.json`);

  let validation = {};
  let explanation = {};
  let reasoning = {};

  try { validation = await loadJson(`${base}/final/xpadi-validation.json`); } catch {}
  try { explanation = await loadJson(`${base}/final/xpadi-decision-explanation.json`); } catch {}
  try { reasoning = await loadJson(`${base}/reasoning/final-state.json`); } catch {}

  setText("decision", decision.decision || "UNKNOWN");
  setText("decisionOrb", decision.decision || "UNKNOWN");
  setText("risk", `Risk: ${decision.risk || "UNKNOWN"}`);
  setText("score", `${decision.composite_score ?? 0}%`);
  setText("continuity", `${decision.continuity ?? 0}%`);
  setText("recoverability", `${decision.recoverability ?? reasoning.recoverability_score ?? 0}%`);
  setText("confidence", `${decision.confidence ?? reasoning.confidence_score ?? 0}%`);
  setText("proofIntegrity", `${decision.proof_integrity ?? 0}%`);
  setText("reasoningState", reasoning.state || decision.runtime_state || "UNKNOWN");

  setText("validation", decision.validation_state || validation.validation_state || "UNKNOWN");

  const summary = decision.validation_summary || validation.summary || {};
  setText(
    "validationCounts",
    `PASS ${summary.pass ?? 0} · WARN ${summary.warn ?? 0} · FAIL ${summary.fail ?? 0}`
  );

  setText(
    "explanation",
    explanation.explanation || decision.human_meaning || "No explanation available."
  );

  const signals = document.getElementById("signals");
  if (signals) {
    signals.innerHTML = "";
    const items = [
      ...(explanation.strongest_signals || []),
      ...(explanation.review_signals || [])
    ];
    (items.length ? items : ["Live Runtime Data"]).forEach(s => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.textContent = s;
      signals.appendChild(chip);
    });
  }

  const checks = document.getElementById("checks");
  if (checks) {
    checks.innerHTML = "";
    const list = validation.checks || [];
    list.forEach(check => {
      const row = document.createElement("div");
      row.className = "check";
      row.innerHTML =
        `<span>${check.check || "check"}<br><small>${check.reason || ""}</small></span>` +
        `<strong class="${String(check.status || "").toLowerCase()}">${check.status || "UNKNOWN"}</strong>`;
      checks.appendChild(row);
    });
  }

  console.log("SENTINEL PUBLIC DEMO DATA BOUND", decision);
}

bindScenario();

boot().catch(err => {
  document.body.innerHTML =
    `<pre style="color:#ff7a7a;background:#07111d;padding:30px;font-size:18px;">SENTINEL PUBLIC DEMO DATA BINDING FAILED\n${err}</pre>`;
});
