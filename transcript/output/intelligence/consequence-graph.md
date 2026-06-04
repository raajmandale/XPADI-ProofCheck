# TRANSCRIPT Consequence Graph V4

This file records what each public runtime action produced.

- module:PROVE_FILE → artifact:file-proof: creates file identity baseline
- artifact:file-proof → artifact:file-evidence: makes identity and integrity explainable
- artifact:file-evidence → artifact:file-report: makes result reviewable
- module:PROVE_MULTI → artifact:multi-suite: turns multiple files into a shared evidence baseline
- module:PROVE_FOLDER → artifact:folder-suite: turns a folder into an observable baseline
- artifact:file-proof → artifact:continuity-session: file proof contributes to continuity state
- artifact:multi-suite → artifact:continuity-session: multi-file proof contributes to continuity state
- artifact:folder-suite → artifact:continuity-session: folder audit contributes to continuity state