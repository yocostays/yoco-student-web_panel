# Rebuild and assemble the deploy folder for WinSCP / server upload.
# Run from project root:  .\scripts\build-deploy.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "Building Next.js (standalone)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$standaloneNext = Join-Path $root ".next\standalone\.next"
$staticSrc = Join-Path $root ".next\static"
$buildIdFile = Join-Path $root ".next\BUILD_ID"

if (-not (Test-Path $standaloneNext)) {
    Write-Error "Missing .next\standalone\.next - check output: standalone in next.config.mjs"
}
if (-not (Test-Path $staticSrc)) {
    Write-Error "Missing .next\static - build failed to produce static assets"
}

$deploy = Join-Path $root "deploy"
if (Test-Path $deploy) {
    Write-Host "Removing old deploy folder..." -ForegroundColor Yellow
    Remove-Item $deploy -Recurse -Force
}

Write-Host "Assembling deploy folder..." -ForegroundColor Cyan
New-Item $deploy -ItemType Directory | Out-Null
Copy-Item (Join-Path $root ".next\standalone\*") $deploy -Recurse

New-Item (Join-Path $deploy ".next\static") -ItemType Directory -Force | Out-Null
Copy-Item "$staticSrc\*" (Join-Path $deploy ".next\static") -Recurse -Force

if (Test-Path (Join-Path $root "public")) {
    Copy-Item (Join-Path $root "public") (Join-Path $deploy "public") -Recurse -Force
}

$envFile = Join-Path $root ".env.local"
if (-not (Test-Path $envFile)) {
    $envFile = Join-Path $root ".env"
}
if (Test-Path $envFile) {
    Copy-Item $envFile (Join-Path $deploy ".env.local") -Force
    Write-Host "Copied env file to deploy/.env.local" -ForegroundColor Cyan
}

$rootBuildId = (Get-Content $buildIdFile -Raw).Trim()
$deployBuildId = (Get-Content (Join-Path $deploy ".next\BUILD_ID") -Raw).Trim()
if ($rootBuildId -ne $deployBuildId) {
    Write-Error "BUILD_ID mismatch! Root=$rootBuildId Deploy=$deployBuildId"
}

$deployPkg = Join-Path $deploy "package.json"
if (Test-Path $deployPkg) {
    $pkg = Get-Content $deployPkg -Raw | ConvertFrom-Json
    $pkg.scripts.start = "node server.js"
    $pkg | ConvertTo-Json -Depth 10 | Set-Content $deployPkg -Encoding UTF8
}

$chunkCount = (Get-ChildItem (Join-Path $deploy ".next\static\chunks") -File -ErrorAction SilentlyContinue).Count
$builtAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$buildInfo = "BUILD_ID=$deployBuildId`nCHUNKS=$chunkCount`nBUILT=$builtAt"
Set-Content (Join-Path $deploy "BUILD_INFO.txt") $buildInfo

Write-Host ""
Write-Host "Deploy ready:" -ForegroundColor Green
Write-Host "  Folder:   $deploy"
Write-Host "  BUILD_ID: $deployBuildId"
Write-Host "  Chunks:   $chunkCount"
Write-Host ""
Write-Host "Upload ALL files inside the deploy folder, then start with:" -ForegroundColor Yellow
Write-Host "  node server.js"
