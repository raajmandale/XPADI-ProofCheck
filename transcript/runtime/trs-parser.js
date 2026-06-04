const fs = require("fs");

function parseTRS(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`TRS file not found: ${filePath}`);
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#"));

  const commands = lines.map((line, index) => {
    const upper = line.toUpperCase();
    if (upper.startsWith("PROVE FILE ")) return { type: "PROVE_FILE", target: line.slice("PROVE FILE ".length).trim(), sourceLine: index + 1, raw: line };
    if (upper.startsWith("PROVE MULTI")) return { type: "PROVE_MULTI", target: line.slice("PROVE MULTI".length).trim() || "multi-file-proof-suite/input", sourceLine: index + 1, raw: line };
    if (upper.startsWith("PROVE FOLDER")) return { type: "PROVE_FOLDER", target: line.slice("PROVE FOLDER".length).trim() || "folder-proof-audit/input/sample-folder", sourceLine: index + 1, raw: line };
    if (upper === "GENERATE EVIDENCE") return { type: "GENERATE_EVIDENCE", sourceLine: index + 1, raw: line };
    if (upper === "GENERATE REPORT") return { type: "GENERATE_REPORT", sourceLine: index + 1, raw: line };
    if (upper === "GENERATE CONTINUITY") return { type: "GENERATE_CONTINUITY", sourceLine: index + 1, raw: line };
    if (upper === "OPEN SENTINEL") return { type: "OPEN_SENTINEL", sourceLine: index + 1, raw: line };
    return { type: "UNKNOWN", sourceLine: index + 1, raw: line };
  });

  return { runtime: "TRANSCRIPT_RUNTIME_V3", filePath, commandCount: commands.length, commands };
}

module.exports = { parseTRS };
