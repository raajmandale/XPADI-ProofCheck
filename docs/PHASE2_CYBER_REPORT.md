# XPADI ProofCheck™ — PHASE-2 Cyber HTML Proof Report

## Purpose

The Cyber HTML Proof Report is the screenshot-ready surface for **Recovery Intelligence & Survivability Proof**.

It converts a machine-readable XPADI manifest into a local, standalone, investor-readable, developer-testable report.

## Public-safe boundaries

This report does not expose XPADI recovery logic, KAVACH internals, XRecony mechanisms, Authority Disk logic, or hidden survivability methods.

## Run

```bash
cd api-node
npm install
npm start
```

Open:

```txt
http://localhost:8787/surface-report/
```

## API endpoints

```txt
POST /v1/proof/create   -> JSON manifest
POST /v1/proof/html     -> direct HTML report from uploaded file
POST /v1/proof/render   -> HTML report from manifest JSON
```

## Screenshot rule

The report must make a viewer ask:

> What is survivability posture?

That is the PHASE-2 objective.
