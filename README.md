<p align="center">
  <img src="assets/xpadi-proofcheck-banner.svg" width="100%" alt="XPADI ProofCheck™ — Recovery Intelligence & Survivability Proof" />
</p>

<h1 align="center">XPADI ProofCheck™</h1>

<p align="center">
  <strong>Recovery Intelligence & Survivability Proof</strong>
</p>

<p align="center">
  Checksums prove change.<br/>
  <strong>XPADI ProofCheck asks whether data is structurally ready to survive failure.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-public--signal--artifact-2563eb?style=for-the-badge" />
  <img src="https://img.shields.io/badge/core-Rust-f97316?style=for-the-badge" />
  <img src="https://img.shields.io/badge/web-local--browser--demo-38bdf8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/mode-local--safe--analysis-22c55e?style=for-the-badge" />
</p>

---

# What Is XPADI ProofCheck™?

XPADI ProofCheck™ is a **local-first survivability intelligence artifact**.

It is designed to ask a different question from traditional tools:

> **If failure happens tomorrow — is recovery structurally believable?**

Most systems check whether a file exists, was copied, or changed.  
XPADI ProofCheck™ explores whether the data has a **survivability posture**.

This is not a full recovery engine.  
This is not backup software.  
This is not antivirus.

It is a public-safe proof surface for a bigger idea:

> **Recovery should become measurable before failure happens.**

---

# Why This Matters

Backups can exist and still fail operationally.

A file may be copied.  
A checksum may be valid.  
A cloud account may show data is present.

But recovery can still become fragile if:

- all continuity depends on one account
- all backup paths depend on one location
- recovery assumptions are not tested
- corruption spreads silently
- deletion removes the only usable path
- recovery friction becomes too high during a real event

XPADI ProofCheck™ introduces a simple but uncomfortable question:

> **Can your data survive failure, or does it only appear safe?**

---

# Traditional Systems vs XPADI ProofCheck™

| Traditional System | Main Question | XPADI ProofCheck™ Question |
|---|---|---|
| Checksum | Did the file change? | Is recovery structurally believable? |
| Backup | Was the file copied? | Can continuity survive failure? |
| Cloud Sync | Is the file accessible? | Is survivability concentrated? |
| RAID | Is redundancy available? | Is recovery posture strong or fragile? |
| Security Tool | Was access blocked? | What survives after failure? |

---

# Core Output

XPADI ProofCheck™ produces a public-safe survivability report.

Example:

```txt
XPADI ProofCheck™

Recovery Intelligence & Survivability Proof

SURVIVABILITY POSTURE

Recovery Readiness      19%   CRITICAL
Continuity Confidence   25%   LOW
Failure Exposure        HIGH
Recovery Friction       HIGH

RECOVERY INTELLIGENCE

⚠ Single Point Dependency detected
⚠ Structural survivability concentration observed
⚠ Recovery pathway confidence reduced

STATE: FRAGILE_RECOVERY_POSTURE
```

---

# Human Meaning

When XPADI ProofCheck™ says:

```txt
FRAGILE_RECOVERY_POSTURE
```

It means:

> The data may exist, but recovery confidence appears structurally weak under failure conditions.

Simple example:

```txt
Backup exists.
But all continuity depends on one cloud account.
Failure exposure concentrated.
Recovery posture fragile.
```

---

# Key Terms

| Term | Simple Meaning |
|---|---|
| Recovery Readiness | How prepared the data appears for recovery |
| Survivability Posture | Overall structural recovery condition |
| Continuity Confidence | Confidence that recoverability can remain intact |
| Failure Exposure | How fragile recovery becomes under dependency failure |
| Recovery Friction | Operational difficulty of restoring continuity |
| Survivability Diversity | Spread and flexibility of recovery paths |
| Manifest Intelligence | Proof metadata rendered as operational telemetry |

---

# Project Structure

```txt
xpadi-proofcheck/
│
├── engine-rust/
│   └── Rust CLI proof engine
│
├── api-node/
│   └── Local Node API / surface server
│
├── web-demo/
│   └── Browser-based local file demo
│
├── surface-report/
│   └── Narrative report surface
│
├── assets/
│   └── SVG banners and launch visuals
│
├── docs/
│   └── launch notes, scoring notes, positioning
│
├── proof-output/
│   └── sample manifest and proof report
│
└── README.md
```

---

# Requirements

You need:

## 1. Rust

Download and install Rust:

```txt
https://rustup.rs
```

After install, verify:

```bash
rustc --version
cargo --version
```

Expected:

```txt
rustc 1.x.x
cargo 1.x.x
```

---

## 2. Node.js

Download and install Node.js LTS:

```txt
https://nodejs.org
```

After install, verify:

```bash
node -v
npm -v
```

Expected:

```txt
v20.x or later
npm 10.x or later
```

---

# How to Run

## Option 1 — Test the Rust CLI

Open terminal inside the repo:

```bash
cd engine-rust
cargo run
```

This runs the local proof engine demo.

If your engine supports file input, use:

```bash
cargo run -- proof ../README.md
```

Expected result:

```txt
XPADI ProofCheck™

Recovery Intelligence & Survivability Proof

SURVIVABILITY POSTURE
Recovery Readiness      19%   CRITICAL
Continuity Confidence   25%   LOW
Failure Exposure        HIGH
Recovery Friction       HIGH
```

---

## Option 2 — Run the Node Surface Server

Open terminal:

```bash
cd api-node
npm install
npm start
```

Then open:

```txt
http://localhost:8787/surface-report/
```

This opens the narrative report surface.

---

## Option 3 — Run the Browser Demo

Open this file directly in browser:

```txt
web-demo/index.html
```

Or use VS Code Live Server.

The browser demo supports:

- Select File
- Drop File
- local analysis surface
- report tab
- manifest tab
- meaning tab

No upload required.

Everything runs locally in the browser.

---

# Browser Demo Flow

## Step 1 — Open Demo

```txt
web-demo/index.html
```

## Step 2 — Select or Drop File

Use:

```txt
Select File
```

or drag a file into:

```txt
Drop File Here
```

## Step 3 — View Result

The demo shows:

- Recovery Readiness
- Continuity Confidence
- Failure Exposure
- Recovery Friction
- Survivability Posture

## Step 4 — Check Tabs

Use:

```txt
Report
Manifest
Meaning
```

### Report
Shows operational output.

### Manifest
Shows public-safe proof metadata.

### Meaning
Explains the result in simple language.

---

# What “Local-First” Means

XPADI ProofCheck™ is designed as a local-first artifact.

That means:

- no login
- no cloud upload
- no account
- no remote dependency
- no server-side file storage

The visible demo runs locally.

---

# What This Is NOT

XPADI ProofCheck™ is not:

- backup software
- cloud storage
- antivirus
- ransomware decryptor
- EDR
- SIEM
- full XPADI recovery engine
- guaranteed restoration system

It does not claim to restore data.

It evaluates survivability posture.

---

# Public-Safe Boundary

The visible project intentionally exposes only:

- survivability telemetry
- public-safe manifest structure
- local proof surface
- reasoning output
- recovery posture language

It intentionally does not expose:

- XPADI recovery internals
- reconstruction logic
- authority mechanics
- private survivability architecture
- future system-level enforcement layers

This repo is the visible edge, not the full core.

---

# Why It Looks Different

XPADI ProofCheck™ is built to feel like:

```txt
future infrastructure telemetry
```

not:

```txt
another checksum utility
```

The surface includes:

- operational posture
- recovery intelligence
- continuity confidence
- survivability reasoning
- manifest intelligence
- human result mode

The goal is not just to show data.

The goal is to create a new question.

---

# Demo Screenshots to Capture

Before public release, capture:

```txt
1. FRAGILE_RECOVERY_POSTURE hero
2. Drop File Here surface
3. Recovery Intelligence output
4. Manifest tab
5. Meaning tab
6. Rust CLI terminal output
```

Put screenshots here:

```txt
assets/screenshots/
```

Then update README image links if needed.

---

# Suggested GitHub Description

Use this for the GitHub repo description:

```txt
XPADI ProofCheck™ — Recovery Intelligence & Survivability Proof. A local-first survivability intelligence artifact exploring whether recovery itself can become measurable before failure happens.
```

---

# Suggested GitHub Topics

```txt
xpadi
recovery-intelligence
survivability
data-resilience
cybersecurity
rust
blake3
local-first
deeptech
continuity
proof-engine
```

---

# Release Tag

Suggested version:

```txt
v0.3.0
```

Suggested release title:

```txt
XPADI ProofCheck™ v0.3.0 — Recovery Intelligence & Survivability Proof
```

---

# Launch Positioning

Correct public positioning:

```txt
A local-first survivability intelligence artifact.
```

Correct category:

```txt
Recovery Intelligence & Survivability Proof.
```

Correct hook:

```txt
Checksums prove change.
XPADI ProofCheck asks whether data is structurally ready to survive failure.
```

Avoid:

```txt
revolutionary cyber platform
guaranteed recovery engine
AI-powered universal protection system
military-grade recovery
```

Credibility matters more than hype.

---

# Core Philosophy

Most tools measure whether data changed.

XPADI ProofCheck™ explores whether recovery itself is structurally believable.

That is the shift:

```txt
Integrity → Survivability
Backup → Continuity
Storage → Recovery Readiness
File proof → Survivability Posture
```

---

# Current Maturity

XPADI ProofCheck™ is currently best understood as:

```txt
a public signal artifact
```

It is intentionally:

- small
- local-first
- public-safe
- technical
- visual
- category-oriented

It is not yet positioned as a full commercial platform.

That restraint is intentional.

---

## Built as a lightweight public survivability intelligence surface inspired by the broader XPADI survivability research direction.
---

# Final Question

> Can recovery itself become measurable before failure happens?

That is the question behind XPADI ProofCheck™.
