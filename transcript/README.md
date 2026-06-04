# TRANSCRIPT Surface Examples

TRANSCRIPT examples in this repository are public-facing survivability intent examples.

They are designed to show how XPADI-related survivability operations can be expressed in a human-readable form.

They do **not** expose the private TRANSCRIPT runtime, parser, adapters, execution engine, or XPADI internal mechanisms.

## Examples

| File | Purpose |
|---|---|
| `examples/verify_archive.trs` | Express archive verification intent. |
| `examples/prove_state.trs` | Express evidence-state proof intent. |
| `examples/check_continuity.trs` | Express continuity-check intent. |
| `examples/observe_recovery.trs` | Express recovery observation intent. |

## Boundary

Public surface only.

No runtime core.
No XPADI adapter.
No reconstruction logic.
No authority logic.
