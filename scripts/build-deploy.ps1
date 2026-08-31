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

$assetLinks = Join-Path $out ".well-known\assetlinks.json"
if (-not (Test-Path $assetLinks)) {
    Write-Error "Missing out/.well-known/assetlinks.json — Android App Links will not work."
}

Write-Host ""
Write-Host "Deploy ready:" -ForegroundColor Green
Write-Host "  Folder: $out"
Write-Host "  App Links file: $assetLinks"
Write-Host ""
Write-Host "WinSCP hides folders that start with a dot." -ForegroundColor Yellow
Write-Host "  Options -> Preferences -> Panels -> Show hidden files"
Write-Host "  Then upload the .well-known folder to the web ROOT (same level as index.html)."
Write-Host ""
Write-Host "After upload this MUST show JSON, not the Leave Request page:" -ForegroundColor Yellow
Write-Host "  https://studentuser.yocostays.com/.well-known/assetlinks.json"
Write-Host ""
Write-Host "Upload ALL files inside the out folder to the web root." -ForegroundColor Yellow
