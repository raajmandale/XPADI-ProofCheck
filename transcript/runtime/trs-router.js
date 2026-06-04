const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const {
  ensureDir,
  sha256File,
  writeJson,
  writeText,
  buildContinuitySummary
} = require("./continuity-generator");

function rel(root, p) {
  return path.relative(root, p).replace(/\\/g, "/");
}

function runNodeScript(workspaceRoot, scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: workspaceRoot,
    encoding: "utf8"
  });
  return {
    status: result.status === 0 ? "generated" : "failed",
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    exitCode: result.status
  };
}

function resolveFileTarget(workspaceRoot, target) {
  const direct = path.resolve(workspaceRoot, target);
  if (fs.existsSync(direct)) return direct;
  const pipelineInput = path.resolve(workspaceRoot, "proofcheck-pipeline", "input", target);
  if (fs.existsSync(pipelineInput)) return pipelineInput;
  throw new Error(`Target file not found: ${target}`);
}

function buildSingleFileProof({ workspaceRoot, targetFile, outputDir }) {
  const stat = fs.statSync(targetFile);
  const proof = {
    artifact: "TRANSCRIPT_FILE_PROOF_V3",
    runtime: "TRANSCRIPT_RUNTIME_V3",
    target: rel(workspaceRoot, targetFile),
    file_name: path.basename(targetFile),
    size_bytes: stat.size,
    hash_algorithm: "SHA-256",
    sha256: sha256File(targetFile),
    proof_state: "PUBLIC_PROOF_GENERATED",
    generated_at: new Date().toISOString(),
    boundary: "No XPADI private mechanism exposed."
  };
  const proofPath = path.join(outputDir, "proofs", "file-proof.json");
  writeJson(proofPath, proof);
  const evidencePath = path.join(outputDir, "evidence", "file-evidence.md");
  writeText(evidencePath, `# Transcript File Evidence\n\nTarget: ${proof.target}\n\nState: ${proof.proof_state}\n\nSHA-256:\n\n\`${proof.sha256}\`\n\nContinuity: Observable\n`);
  const reportPath = path.join(outputDir, "html", "file-report.html");
  writeText(reportPath, `<!doctype html><html><head><meta charset="utf-8"><title>Transcript File Proof</title><style>body{background:#07111d;color:white;font-family:Segoe UI,Arial;padding:48px}code{color:#ff9b45;word-break:break-all}.card{border:1px solid #ff9b45;border-radius:20px;padding:28px;background:#101b2b}</style></head><body><div class="card"><h1>Transcript File Proof</h1><p>Target: ${proof.target}</p><p>Continuity: Observable</p><code>${proof.sha256}</code></div></body></html>`);
  return { proofPath, evidencePath, reportPath };
}

function buildRuntimeLog({ outputDir, session }) {
  const logPath = path.join(outputDir, "logs", "runtime-session.log");
  writeText(logPath, ["TRANSCRIPT_RUNTIME_V3 SESSION", `Session: ${session.session_id}`, `Generated: ${new Date().toISOString()}`, "", ...session.events].join("\n"));
  return logPath;
}

async function routeCommands({ workspaceRoot, parsed }) {
  const outputDir = path.join(workspaceRoot, "transcript", "output");
  ensureDir(outputDir);

  const session = {
    session_id: `TRS-${Date.now()}`,
    runtime: "TRANSCRIPT_RUNTIME_V3",
    events: [],
    modules: [],
    lineage: [],
    sentinel: "not_opened"
  };

  let previous = "SESSION_START";

  function addLineage(module, status) {
    session.lineage.push({ from: previous, to: module, status, at: new Date().toISOString() });
    previous = module;
  }

  for (const cmd of parsed.commands) {
    if (cmd.type === "UNKNOWN") throw new Error(`Unknown TRS command at line ${cmd.sourceLine}: ${cmd.raw}`);

    if (cmd.type === "PROVE_FILE") {
      const targetFile = resolveFileTarget(workspaceRoot, cmd.target);
      const artifacts = buildSingleFileProof({ workspaceRoot, targetFile, outputDir });
      session.events.push(`✓ PROVE FILE ${cmd.target} → ${rel(workspaceRoot, artifacts.proofPath)}`);
      session.modules.push({ module: "PROVE_FILE", target: cmd.target, status: "generated" });
      addLineage("PROVE_FILE", "generated");
    }

    if (cmd.type === "PROVE_MULTI") {
      const r = runNodeScript(workspaceRoot, path.join(workspaceRoot, "multi-file-proof-suite", "src", "multi-file-proof-suite.js"));
      session.events.push(`${r.status === "generated" ? "✓" : "✗"} PROVE MULTI → multi-file-proof-suite/output`);
      session.modules.push({ module: "PROVE_MULTI", target: cmd.target, status: r.status, exitCode: r.exitCode });
      addLineage("PROVE_MULTI", r.status);
    }

    if (cmd.type === "PROVE_FOLDER") {
      const r = runNodeScript(workspaceRoot, path.join(workspaceRoot, "folder-proof-audit", "src", "folder-proof-audit.js"));
      session.events.push(`${r.status === "generated" ? "✓" : "✗"} PROVE FOLDER → folder-proof-audit/output`);
      session.modules.push({ module: "PROVE_FOLDER", target: cmd.target, status: r.status, exitCode: r.exitCode });
      addLineage("PROVE_FOLDER", r.status);
    }

    if (cmd.type === "GENERATE_EVIDENCE") {
      session.events.push("✓ GENERATE EVIDENCE → aggregated evidence state observable");
      session.modules.push({ module: "GENERATE_EVIDENCE", status: "observable" });
      addLineage("GENERATE_EVIDENCE", "observable");
    }

    if (cmd.type === "GENERATE_REPORT") {
      const reportPath = path.join(outputDir, "html", "runtime-session-report.html");
      writeText(reportPath, `<!doctype html><html><head><meta charset="utf-8"><title>Transcript Runtime V3 Session</title><style>body{margin:0;background:#07111d;color:white;font-family:Segoe UI,Arial}.wrap{max-width:1000px;margin:auto;padding:56px}.hero{border:1px solid #ff9b45;border-radius:26px;padding:30px;background:#101b2b}.event{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.12)}.orange{color:#ff9b45}</style></head><body><main class="wrap"><section class="hero"><h1>TRANSCRIPT Runtime V3</h1><h2 class="orange">Proof → Evidence → Continuity</h2>${session.events.map(e=>`<div class="event">${e}</div>`).join("")}</section></main></body></html>`);
      session.events.push(`✓ GENERATE REPORT → ${rel(workspaceRoot, reportPath)}`);
      session.modules.push({ module: "GENERATE_REPORT", status: "generated" });
      addLineage("GENERATE_REPORT", "generated");
    }

    if (cmd.type === "GENERATE_CONTINUITY") {
      const continuityPath = buildContinuitySummary({ workspaceRoot, outputDir, session });
      session.events.push(`✓ GENERATE CONTINUITY → ${rel(workspaceRoot, continuityPath)}`);
      session.modules.push({ module: "GENERATE_CONTINUITY", status: "generated" });
      addLineage("GENERATE_CONTINUITY", "generated");
    }

    if (cmd.type === "OPEN_SENTINEL") {
      session.sentinel = "available_at_http://localhost:8080";
      session.events.push("✓ OPEN SENTINEL → run npm run sentinel to view studio");
      session.modules.push({ module: "OPEN_SENTINEL", status: "declared" });
      addLineage("OPEN_SENTINEL", "declared");
    }
  }

  const sessionArtifactPath = path.join(outputDir, "sessions", "runtime-session.json");
  writeJson(sessionArtifactPath, session);
  const logPath = buildRuntimeLog({ outputDir, session });

  return {
    runtime: "TRANSCRIPT_RUNTIME_V3",
    events: session.events,
    session,
    outputs: {
      session: sessionArtifactPath,
      log: logPath,
      continuity: path.join(outputDir, "continuity", "continuity-session.json")
    }
  };
}

module.exports = { routeCommands };
