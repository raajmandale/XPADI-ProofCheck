export function severityFromScore(score) {
  if (score <= 25) return 'CRITICAL';
  if (score <= 50) return 'WEAK';
  if (score <= 75) return 'MODERATE';
  return 'STRONG';
}

function safe(value) {
  return String(value ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

function normalizeManifest(manifest) {
  const sv = manifest.survivability || {};
  const profile = manifest.fragment_profile || {};
  const readiness = Number(sv.recovery_readiness?.score ?? sv.recovery_readiness ?? 0);
  const confidence = Number(sv.continuity_confidence?.score ?? sv.continuity_confidence ?? 0);
  const failureExposure = readiness <= 25 ? 'HIGH' : readiness <= 50 ? 'ELEVATED' : readiness <= 75 ? 'CONTROLLED' : 'LOW';
  const recoveryFriction = sv.recovery_complexity || sv.recovery_friction || 'LOW';
  const reasons = sv.reasons || sv.recovery_intelligence || buildReasons(manifest, readiness);
  return { sv, profile, readiness, confidence, failureExposure, recoveryFriction, reasons };
}

export function buildReasons(manifest, readiness) {
  const sv = manifest.survivability || {};
  const profile = manifest.fragment_profile || {};
  const reasons = [];
  if (sv.single_point_dependency === 'HIGH' || sv.single_point_dependency === 'High') reasons.push('Single point dependency detected');
  if (profile.diversity_signal === 'SINGLE_OBJECT_DOMINANT') reasons.push('No survivability distribution observed');
  if ((profile.simulated_fragment_count || 1) < 4) reasons.push('Fragment survivability is structurally limited');
  if (readiness < 45) reasons.push('Recovery pathway confidence is reduced');
  if (reasons.length === 0) reasons.push('Survivability posture shows distributed recovery indicators');
  return reasons;
}

export function renderProofReport(manifest) {
  const { sv, profile, readiness, confidence, failureExposure, recoveryFriction, reasons } = normalizeManifest(manifest);
  const sev = severityFromScore(readiness);
  const confSev = severityFromScore(confidence);
  const posture = sv.posture || 'UNCLASSIFIED_POSTURE';
  const subject = manifest.subject || {};
  const digest = manifest.integrity?.digest || '';
  const shortDigest = digest.length > 28 ? `${digest.slice(0, 20)}…${digest.slice(-12)}` : digest;
  const reasonItems = reasons.map(r => `<li>${safe(r)}</li>`).join('');
  const notes = (manifest.notes || []).map(n => `<li>${safe(n)}</li>`).join('');
  const manifestJson = safe(JSON.stringify(manifest, null, 2));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>XPADI ProofCheck™ Report — ${safe(subject.name || 'Proof')}</title>
<style>
:root{--bg:#05070d;--panel:rgba(14,22,36,.78);--panel2:rgba(8,14,25,.92);--line:rgba(107,224,255,.18);--cyan:#6be0ff;--blue:#7aa7ff;--orange:#ff9f43;--red:#ff4d5e;--green:#55f3a5;--text:#edf7ff;--muted:#91a4b8;--soft:#162235;}
*{box-sizing:border-box} body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;background:radial-gradient(circle at 15% 10%,rgba(58,134,255,.18),transparent 28%),radial-gradient(circle at 80% 0%,rgba(255,159,67,.16),transparent 24%),linear-gradient(135deg,#03050a 0%,#07111f 55%,#03050a 100%);color:var(--text);min-height:100vh;}
body:before{content:"";position:fixed;inset:0;background:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:36px 36px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.75),transparent);pointer-events:none}.wrap{max-width:1180px;margin:0 auto;padding:36px 22px 52px}.hero{border:1px solid var(--line);border-radius:28px;background:linear-gradient(135deg,rgba(10,20,34,.94),rgba(8,10,18,.82));box-shadow:0 0 80px rgba(107,224,255,.10),inset 0 1px 0 rgba(255,255,255,.07);padding:30px;position:relative;overflow:hidden}.hero:after{content:"";position:absolute;right:-120px;top:-160px;width:420px;height:420px;background:radial-gradient(circle,rgba(107,224,255,.20),transparent 62%);filter:blur(8px)}.kicker{letter-spacing:.18em;text-transform:uppercase;color:var(--cyan);font-size:12px;font-weight:700}.title{font-size:42px;line-height:1.02;margin:12px 0 10px;font-weight:850}.subtitle{font-size:17px;color:var(--muted);max-width:780px}.meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.chip{border:1px solid var(--line);background:rgba(107,224,255,.06);padding:9px 12px;border-radius:999px;color:#cfefff;font-size:13px}.grid{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;margin-top:18px}.card{border:1px solid var(--line);background:var(--panel);border-radius:24px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.045)}.scoreRow{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.score{background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:18px;min-height:136px}.label{color:var(--muted);font-size:13px;text-transform:uppercase;letter-spacing:.08em}.num{font-size:44px;font-weight:900;margin:8px 0}.sev{display:inline-flex;padding:6px 10px;border-radius:999px;font-weight:800;font-size:12px;letter-spacing:.06em}.CRITICAL{color:#fff;background:rgba(255,77,94,.23);border:1px solid rgba(255,77,94,.45)}.WEAK,.LOW,.ELEVATED{color:#fff4df;background:rgba(255,159,67,.22);border:1px solid rgba(255,159,67,.42)}.MODERATE,.CONTROLLED{color:#e7fbff;background:rgba(107,224,255,.17);border:1px solid rgba(107,224,255,.36)}.STRONG{color:#eaffe9;background:rgba(85,243,165,.16);border:1px solid rgba(85,243,165,.36)}h2{margin:0 0 16px;font-size:18px;letter-spacing:.05em;text-transform:uppercase}.intel li{margin:10px 0;color:#dcecff}.intel li::marker{color:var(--orange)}.kv{display:grid;grid-template-columns:210px 1fr;gap:8px 14px;font-size:14px}.kv div:nth-child(odd){color:var(--muted)}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.bar{height:10px;background:rgba(255,255,255,.08);border-radius:20px;overflow:hidden;margin-top:12px}.fill{height:100%;width:${readiness}%;background:linear-gradient(90deg,var(--red),var(--orange),var(--cyan));box-shadow:0 0 18px rgba(107,224,255,.38)}.posture{font-size:22px;font-weight:900;letter-spacing:.04em;color:#fff}.note{color:var(--muted);line-height:1.55}.manifest{white-space:pre-wrap;max-height:360px;overflow:auto;background:rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:16px;color:#d3e9ff;font-size:12px}.footer{margin-top:18px;text-align:center;color:var(--muted);font-size:13px}.watermark{position:absolute;right:26px;bottom:18px;color:rgba(255,255,255,.05);font-size:72px;font-weight:950;letter-spacing:-.08em}@media(max-width:850px){.grid,.scoreRow{grid-template-columns:1fr}.title{font-size:32px}.kv{grid-template-columns:1fr}.watermark{display:none}}
</style>
</head>
<body>
<div class="wrap">
  <section class="hero">
    <div class="kicker">XPADI ProofCheck™</div>
    <h1 class="title">Recovery Intelligence<br/> & Survivability Proof</h1>
    <p class="subtitle">Checksums prove a file did not change. XPADI ProofCheck asks whether data is structurally ready to survive failure.</p>
    <div class="meta">
      <span class="chip mono">${safe(manifest.proof_id)}</span>
      <span class="chip">${safe(manifest.proof_version)}</span>
      <span class="chip">LOCAL_SAFE_ANALYSIS</span>
    </div>
    <div class="watermark">PC</div>
  </section>

  <div class="grid">
    <section class="card">
      <h2>Survivability Posture</h2>
      <div class="scoreRow">
        <div class="score"><div class="label">Recovery Readiness</div><div class="num">${readiness}%</div><span class="sev ${sev}">${sev}</span><div class="bar"><div class="fill"></div></div></div>
        <div class="score"><div class="label">Continuity Confidence</div><div class="num">${confidence}%</div><span class="sev ${confSev}">${confSev}</span></div>
        <div class="score"><div class="label">Failure Exposure</div><div class="num" style="font-size:30px">${safe(failureExposure)}</div><span class="sev ${failureExposure}">${safe(failureExposure)}</span></div>
      </div>
    </section>

    <section class="card">
      <h2>Posture Classification</h2>
      <div class="posture">${safe(posture)}</div>
      <p class="note">This report evaluates survivability posture and recovery readiness indicators. It does not expose or perform XPADI core recovery operations.</p>
    </section>
  </div>

  <div class="grid">
    <section class="card intel">
      <h2>Recovery Intelligence</h2>
      <ul>${reasonItems}</ul>
    </section>
    <section class="card">
      <h2>Failure Surface</h2>
      <div class="kv">
        <div>Single Point Dependency</div><div class="mono">${safe(sv.single_point_dependency)}</div>
        <div>Fragment Survivability</div><div class="mono">${safe(sv.fragment_survivability)}</div>
        <div>Reconstruction Readiness</div><div class="mono">${safe(sv.reconstruction_readiness)}</div>
        <div>Recovery Friction</div><div class="mono">${safe(recoveryFriction)}</div>
        <div>Simulated Fragments</div><div class="mono">${safe(profile.simulated_fragment_count)}</div>
      </div>
    </section>
  </div>

  <div class="grid">
    <section class="card">
      <h2>Proof Layer</h2>
      <div class="kv">
        <div>Subject</div><div>${safe(subject.name)}</div>
        <div>Type</div><div>${safe(subject.subject_type)}</div>
        <div>Size</div><div class="mono">${safe(subject.size_bytes)} bytes</div>
        <div>File Count</div><div class="mono">${safe(subject.file_count)}</div>
        <div>Integrity Algorithm</div><div class="mono">${safe(manifest.integrity?.algorithm)}</div>
        <div>Digest</div><div class="mono">${safe(shortDigest)}</div>
        <div>Generated</div><div class="mono">${safe(manifest.created_at)}</div>
      </div>
    </section>
    <section class="card intel">
      <h2>Public-Safe Notes</h2>
      <ul>${notes}</ul>
    </section>
  </div>

  <section class="card" style="margin-top:18px">
    <h2>Manifest JSON</h2>
    <div class="manifest mono">${manifestJson}</div>
  </section>
  <div class="footer">XPADI ProofCheck™ evaluates survivability posture. It does not guarantee recovery.</div>
</div>
</body>
</html>`;
}
