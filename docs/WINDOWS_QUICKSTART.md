# Windows Quickstart

## Rust engine

```powershell
cd engine-rust
cargo run -- proof ../examples/sample.txt --out ../reports/sample.xpadi-proof.json
cargo run -- verify ../examples/sample.txt ../reports/sample.xpadi-proof.json
```

## PowerShell wrapper

```powershell
./cli/xpadi.ps1 proof ./examples/sample.txt --out ./reports/sample.xpadi-proof.json
```

## Browser demo

Open:

```txt
web-demo/index.html
```

## Local API

```powershell
cd api-node
npm install
npm start
```

Open:

```txt
http://localhost:8787
```
