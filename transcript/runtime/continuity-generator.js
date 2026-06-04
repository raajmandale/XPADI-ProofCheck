const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function sha256File(filePath) { return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex"); }
function writeJson(filePath, data) { ensureDir(path.dirname(filePath)); fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8"); }
function writeText(filePath, data) { ensureDir(path.dirname(filePath)); fs.writeFileSync(filePath, data, "utf8"); }

function buildContinuitySummary({ workspaceRoot, outputDir, session }) {
  const continuity = {
    artifact: "TRANSCRIPT_CONTINUITY_SESSION_V3",
    runtime: "TRANSCRIPT_RUNTIME_V3",
    session_id: session.session_id,
    commands_executed: session.events.length,
    modules: session.modules,
    lineage: session.lineage,
    proof: session.modules.some(m => m.status === "generated") ? "generated" : "not_generated",
    evidence: "observable",
    continuity: "observable",
    sentinel: session.sentinel,
    public_boundary: "Public execution surface only. No XPADI private mechanisms exposed.",
    generated_at: new Date().toISOString()
  };
  const continuityPath = path.join(outputDir, "continuity", "continuity-session.json");
  writeJson(continuityPath, continuity);
  return continuityPath;
}

module.exports = { ensureDir, sha256File, writeJson, writeText, buildContinuitySummary };
