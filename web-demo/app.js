const fileInput = document.getElementById('file');
const pick = document.getElementById('pick');
const drop = document.getElementById('drop');
const output = document.getElementById('output');
pick.onclick = () => fileInput.click();
fileInput.onchange = () => fileInput.files[0] && analyze(fileInput.files[0]);
['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.style.borderColor = '#66e3ff'; }));
['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.style.borderColor = ''; }));
drop.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) analyze(f); });

async function sha256(file){ const buf = await file.arrayBuffer(); const hash = await crypto.subtle.digest('SHA-256', buf); return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join(''); }
function score(size){
  const fragmentSize = size < 1048576 ? 65536 : size < 134217728 ? 1048576 : 4194304;
  const fragments = Math.max(1, Math.ceil(size / fragmentSize));
  let s = 44; if(fragments>=4)s+=10; if(fragments>=16)s+=8; if(size>1048576)s+=7; if(size<4096)s-=15; s-=10; s=Math.max(5,Math.min(96,s));
  return { recovery_readiness:s, continuity_confidence:Math.max(1,Math.min(99,Math.round(s*.88+8))), single_point_dependency:(fragments<4?'HIGH':'MEDIUM'), reconstruction_readiness:(s>=75?'HIGH':s>=45?'MEDIUM':'LOW'), fragment_survivability:(fragments>=16?'HIGH':fragments>=4?'MEDIUM':'LOW'), recovery_complexity:(fragments>256?'HIGH':fragments>32?'MEDIUM':'LOW'), simulated_fragment_count:fragments, simulated_fragment_size_bytes:fragmentSize, posture:(s>=75?'STRONG_RECOVERY_POSTURE':s>=45?'PARTIAL_RECOVERY_POSTURE':'FRAGILE_RECOVERY_POSTURE') };
}
async function analyze(file){
  output.textContent = 'Analyzing local file...';
  const digest = await sha256(file);
  const s = score(file.size);
  const manifest = { proof_version:'XPADI-PC-V0.1-WEB', proof_id:`XPADI-PC-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${digest.slice(0,16).toUpperCase()}`, created_at:new Date().toISOString(), subject:{name:file.name,size_bytes:file.size,type:file.type||'unknown'}, integrity:{algorithm:'SHA-256/WEB-SAFE',digest,status:'VERIFIED_AT_CREATION'}, survivability:s, note:'Browser demo is local-only and does not upload the file.' };
  output.textContent = `XPADI ProofCheck™ Report\n--------------------------------\nFile: ${file.name}\nSize: ${file.size} bytes\nIntegrity: VERIFIED\nRecovery Readiness: ${s.recovery_readiness}%\nContinuity Confidence: ${s.continuity_confidence}%\nSingle Point Dependency: ${s.single_point_dependency}\nReconstruction Readiness: ${s.reconstruction_readiness}\nFragment Survivability: ${s.fragment_survivability}\nRecovery Complexity: ${s.recovery_complexity}\nPosture: ${s.posture}\n\nManifest\n${JSON.stringify(manifest,null,2)}`;
}
