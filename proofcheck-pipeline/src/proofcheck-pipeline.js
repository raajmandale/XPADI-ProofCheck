const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const inputFile = path.join(ROOT, 'input', 'sample.txt');
const outProof = path.join(ROOT, 'output', 'proofs', 'proof.json');
const outEvidence = path.join(ROOT, 'output', 'evidence', 'evidence.md');
const outHtml = path.join(ROOT, 'output', 'html', 'report.html');
const outBenchmark = path.join(ROOT, 'output', 'benchmarks', 'benchmark.json');
const outLog = path.join(ROOT, 'output', 'logs', 'run.log');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function proofId(hash) {
  return `XPD-PROOF-${hash.slice(0, 12).toUpperCase()}`;
}

function htmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const started = process.hrtime.bigint();

if (!fs.existsSync(inputFile)) {
  console.error(`Missing input file: ${inputFile}`);
  process.exit(1);
}

const buffer = fs.readFileSync(inputFile);
const fileHash = sha256(buffer);
const generatedAt = new Date().toISOString();
const sizeBytes = buffer.length;
const lineCount = buffer.toString('utf8').split(/\r?\n/).length;
const id = proofId(fileHash);

const proof = {
  artifact: 'REAL_PROOFCHECK_PIPELINE_V1',
  proof_id: id,
  generated_at: generatedAt,
  input: {
    file: 'proofcheck-pipeline/input/sample.txt',
    name: 'sample.txt',
    size_bytes: sizeBytes,
    line_count: lineCount,
    sha256: fileHash
  },
  observation: {
    status: 'PUBLIC_PROOF_GENERATED',
    proof_type: 'file-hash-evidence',
    evidence_mode: 'public-safe',
    continuity_signal: 'observable',
    integrity_state: 'hash-recorded'
  },
  benchmark: {
    duration_ms: 0,
    files_processed: 1,
    bytes_processed: sizeBytes,
    hash_algorithm: 'SHA-256',
    disclosure_mode: 'PUBLIC_SAFE_SURFACE_ONLY'
  },
  boundaries: [
    'No Recovery Graph internals exposed.',
    'No Authority Model internals exposed.',
    'No Fragment Logic exposed.',
    'No Reconstruction Engine exposed.',
    'Only public file hashing, proof metadata, evidence markdown, and HTML reporting are demonstrated.'
  ]
};

const durationMs = Number((process.hrtime.bigint() - started) / 1000000n);
proof.benchmark.duration_ms = durationMs;

const evidence = `# XPADI ProofCheck — Real Proof Pipeline Evidence\n\n` +
`## Proof Summary\n\n` +
`- Proof ID: ${id}\n` +
`- Input File: sample.txt\n` +
`- Size: ${sizeBytes} bytes\n` +
`- Lines: ${lineCount}\n` +
`- SHA-256: ${fileHash}\n` +
`- Generated At: ${generatedAt}\n` +
`- Result: PUBLIC_PROOF_GENERATED\n\n` +
`## What This Demonstrates\n\n` +
`This artifact converts a real file into public-safe proof evidence. It demonstrates file hashing, proof metadata generation, evidence output, HTML reporting, and benchmark recording without exposing XPADI private mechanisms.\n\n` +
`## Public Safety Boundary\n\n` +
`- No Recovery Graph internals exposed.\n` +
`- No Authority Model internals exposed.\n` +
`- No Fragment Logic exposed.\n` +
`- No Reconstruction Engine exposed.\n` +
`- This is a public ProofCheck evidence surface only.\n`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>XPADI ProofCheck — Real Proof Pipeline</title>
<style>
  body{margin:0;background:#06101f;color:#f8fbff;font-family:Inter,Segoe UI,Arial,sans-serif;}
  .wrap{max-width:1120px;margin:0 auto;padding:48px 24px;}
  .hero{background:linear-gradient(135deg,#0d2449,#0b1730);border:1px solid #284a7a;border-radius:24px;padding:34px;margin-bottom:28px;}
  .eyebrow{color:#7ec3ff;letter-spacing:.16em;text-transform:uppercase;font-weight:800;font-size:13px;}
  h1{font-size:42px;margin:18px 0 12px;}
  p{font-size:18px;line-height:1.65;color:#d8e8ff;}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:26px 0;}
  .card{background:#0c1b32;border:1px solid #233e65;border-radius:16px;padding:20px;}
  .big{font-size:28px;font-weight:900;color:#8dffbf;}
  .label{color:#a9c9ef;margin-top:8px;}
  pre{white-space:pre-wrap;word-break:break-word;background:#071426;border:1px solid #1d3557;border-radius:16px;padding:20px;color:#9dffd1;}
  table{width:100%;border-collapse:collapse;background:#0c1b32;border-radius:16px;overflow:hidden;margin-top:12px;}
  th,td{text-align:left;border-bottom:1px solid #1d3557;padding:14px;}
  th{color:#9cd2ff;background:#102545;}
  .warn{background:#140f19;border:1px solid #5a3440;border-radius:18px;padding:24px;margin-top:28px;}
  code{color:#9dffd1;}
</style>
</head>
<body>
<div class="wrap">
  <section class="hero">
    <div class="eyebrow">XPADI-ProofCheck · Public Evidence Surface</div>
    <h1>Real Proof Pipeline</h1>
    <p>Converts a real file into proof JSON, evidence markdown, HTML reporting, and benchmark output without exposing XPADI internals.</p>
  </section>

  <div class="grid">
    <div class="card"><div class="big">${sizeBytes}</div><div class="label">Bytes Processed</div></div>
    <div class="card"><div class="big">1</div><div class="label">File Processed</div></div>
    <div class="card"><div class="big">${durationMs}ms</div><div class="label">Observed Runtime</div></div>
    <div class="card"><div class="big">SHA-256</div><div class="label">Hash Algorithm</div></div>
  </div>

  <h2>Proof Summary</h2>
  <table>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>Proof ID</td><td>${htmlEscape(id)}</td></tr>
    <tr><td>Input File</td><td>sample.txt</td></tr>
    <tr><td>SHA-256</td><td><code>${htmlEscape(fileHash)}</code></td></tr>
    <tr><td>Status</td><td>PUBLIC_PROOF_GENERATED</td></tr>
    <tr><td>Generated</td><td>${htmlEscape(generatedAt)}</td></tr>
  </table>

  <h2>Input Preview</h2>
  <pre>${htmlEscape(buffer.toString('utf8'))}</pre>

  <section class="warn">
    <h2>Public Safety Boundary</h2>
    <ul>
      ${proof.boundaries.map(x => `<li>${htmlEscape(x)}</li>`).join('\n      ')}
    </ul>
  </section>
</div>
</body>
</html>`;

const benchmark = {
  artifact: 'REAL_PROOFCHECK_PIPELINE_V1_BENCHMARK',
  generated_at: generatedAt,
  files_processed: 1,
  bytes_processed: sizeBytes,
  duration_ms: durationMs,
  hash_algorithm: 'SHA-256',
  output_files: [
    'proofcheck-pipeline/output/proofs/proof.json',
    'proofcheck-pipeline/output/evidence/evidence.md',
    'proofcheck-pipeline/output/html/report.html',
    'proofcheck-pipeline/output/benchmarks/benchmark.json'
  ],
  disclosure_mode: 'PUBLIC_SAFE_SURFACE_ONLY'
};

for (const file of [outProof, outEvidence, outHtml, outBenchmark, outLog]) ensureDir(file);
fs.writeFileSync(outProof, JSON.stringify(proof, null, 2));
fs.writeFileSync(outEvidence, evidence);
fs.writeFileSync(outHtml, html);
fs.writeFileSync(outBenchmark, JSON.stringify(benchmark, null, 2));
fs.writeFileSync(outLog, `[${generatedAt}] ${id} generated for sample.txt (${sizeBytes} bytes) in ${durationMs}ms\n`);

console.log('XPADI Real ProofCheck Pipeline complete');
console.log('Proof:', outProof);
console.log('Evidence:', outEvidence);
console.log('HTML:', outHtml);
console.log('Benchmark:', outBenchmark);
