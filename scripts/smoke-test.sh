#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../engine-rust"
cargo run -- proof ../examples/sample.txt --out ../reports/sample.xpadi-proof.json
cargo run -- verify ../examples/sample.txt ../reports/sample.xpadi-proof.json
