# Rebuild the static `out` folder for Apache / WinSCP upload.
# Run from project root:  .\scripts\build-deploy.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "Building Next.js (static export -> out/)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$out = Join-Path $root "out"
if (-not (Test-Path $out)) {
    Write-Error "Missing out folder - check output: export in next.config.mjs"
}

Write-Host ""
Write-Host "Deploy ready:" -ForegroundColor Green
Write-Host "  Folder: $out"
Write-Host ""
Write-Host "Upload ALL files inside the out folder to the web root." -ForegroundColor Yellow
