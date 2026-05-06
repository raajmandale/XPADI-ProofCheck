param(
  [Parameter(ValueFromRemainingArguments=$true)]
  [string[]]$Args
)
$root = Split-Path -Parent $PSScriptRoot
Push-Location "$root\engine-rust"
cargo run -- @Args
Pop-Location
