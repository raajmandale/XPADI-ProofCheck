# XPADI ProofCheck™ Scoring Model

This public V1 scoring model is intentionally safe and explainable. It does **not** reveal XPADI recovery internals.

## Scores

- **Recovery Readiness**: estimated ability of data to be represented in a survivability-aware manifest.
- **Continuity Confidence**: confidence signal derived from size, object count, and fragment simulation profile.
- **Single Point Dependency**: whether one file/object creates a fragile dependency surface.
- **Reconstruction Readiness**: public-safe estimate of reconstruction posture.
- **Fragment Survivability**: estimated benefit from fragment-style representation.
- **Recovery Complexity**: rough operational complexity signal.

## Philosophy

Traditional integrity tools answer: **Did the file change?**

XPADI ProofCheck asks: **Is this data structurally ready to survive failure?**
