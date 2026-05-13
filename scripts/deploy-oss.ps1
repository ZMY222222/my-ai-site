<#
.SYNOPSIS
  my-ai-site 阿里云 OSS 一键部署 (Windows PowerShell)
.DESCRIPTION
  用法:
    1. 复制 scripts\env.oss.example 为 scripts\env.oss 并填入你的配置
    2. .\scripts\deploy-oss.ps1

  前置依赖:
    - Node.js >= 18
    - ossutil 2.x 已安装并配置
      安装: https://help.aliyun.com/zh/oss/developer-reference/ossutil-overview
#>
param()

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir
$EnvFile = Join-Path $ScriptDir "env.oss"

if (-not (Test-Path $EnvFile)) {
  Write-Host "[ERROR] Configuration file not found: $EnvFile" -ForegroundColor Red
  Write-Host "        Copy scripts\env.oss.example to scripts\env.oss and fill in your settings"
  exit 1
}

Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+?)\s*=\s*(.+)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    Set-Item -Path "Env:$name" -Value $value
  }
}

$Bucket = $env:OSS_BUCKET
$Region = $env:OSS_REGION
$Endpoint = $env:OSS_ENDPOINT
$CacheHtml = if ($env:CACHE_CONTROL_HTML) { $env:CACHE_CONTROL_HTML } else { "no-cache" }
$CacheAssets = if ($env:CACHE_CONTROL_ASSETS) { $env:CACHE_CONTROL_ASSETS } else { "public,max-age=31536000,immutable" }
$BuildDir = Join-Path $ProjectDir "out"

if (-not $Bucket -or -not $Region -or -not $Endpoint) {
  Write-Host "[ERROR] OSS_BUCKET, OSS_REGION, OSS_ENDPOINT are required" -ForegroundColor Red
  exit 1
}

# Find ossutil
$ossutil = (Get-Command ossutil -ErrorAction SilentlyContinue).Source
if (-not $ossutil) {
  $candidates = @(
    "$env:USERPROFILE\ossutil\ossutil-2.3.0-windows-amd64\ossutil.exe",
    "$env:LOCALAPPDATA\ossutil\ossutil.exe",
    "C:\ossutil\ossutil.exe"
  )
  foreach ($c in $candidates) {
    if (Test-Path $c) {
      $ossutil = $c
      break
    }
  }
}
if (-not $ossutil) {
  Write-Host "[ERROR] ossutil not found. Download and install it first:" -ForegroundColor Red
  Write-Host "        Invoke-WebRequest -Uri 'https://gosspublic.alicdn.com/ossutil/v2/2.3.0/ossutil-2.3.0-windows-amd64.zip' -OutFile `$env:USERPROFILE\ossutil.zip"
  Write-Host "        Expand-Archive -Path `$env:USERPROFILE\ossutil.zip -DestinationPath `$env:USERPROFILE\ossutil"
  Write-Host "        & `$env:USERPROFILE\ossutil\ossutil-2.3.0-windows-amd64\ossutil.exe config"
  exit 1
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  my-ai-site -> Alibaba OSS Deploy" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ossutil:  $ossutil"
Write-Host "  Bucket:   $Bucket"
Write-Host "  Region:   $Region"
Write-Host "  Endpoint: $Endpoint"
Write-Host ""

# Step 1: Build
Write-Host "[1/4] Building static site..." -ForegroundColor Yellow
Push-Location $ProjectDir
try {
  npm ci --prefer-offline
  $env:DEPLOY_TARGET = "oss"
  npm run build

  if (-not (Test-Path $BuildDir)) {
    Write-Host "[ERROR] Build failed: out/ directory not found" -ForegroundColor Red
    exit 1
  }
  Write-Host "Build complete: $BuildDir" -ForegroundColor Green
} finally {
  Pop-Location
}

# Step 2: Upload HTML
Write-Host ""
Write-Host "[2/4] Uploading HTML (Cache-Control: $CacheHtml)..." -ForegroundColor Yellow
& $ossutil cp "$BuildDir" "oss://${Bucket}" `
  --recursive `
  --include "*.html" `
  --endpoint "$Endpoint" `
  --meta "Cache-Control:$CacheHtml" `
  --update

# Step 3: Upload static assets
Write-Host ""
Write-Host "[3/4] Uploading assets (Cache-Control: $CacheAssets)..." -ForegroundColor Yellow
& $ossutil cp "$BuildDir" "oss://${Bucket}" `
  --recursive `
  --include "*.js" --include "*.css" --include "*.woff2" `
  --include "*.woff" --include "*.ttf" --include "*.svg" `
  --include "*.png" --include "*.jpg" --include "*.jpeg" `
  --include "*.gif" --include "*.webp" --include "*.ico" `
  --include "*.json" --include "*.txt" --include "*.xml" `
  --include "*.mp4" --include "*.mp3" `
  --endpoint "$Endpoint" `
  --meta "Cache-Control:$CacheAssets" `
  --update

# Step 4: Configure static website hosting
Write-Host ""
Write-Host "[4/4] Configuring static website hosting..." -ForegroundColor Yellow
& $ossutil website "oss://${Bucket}" `
  --method put `
  --index-document index.html `
  --error-document 404.html `
  --endpoint "$Endpoint"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Deploy complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  OSS URL: http://${Bucket}.${Region}.aliyuncs.com"
Write-Host ""
Write-Host "  Next steps:"
Write-Host "  1. Bind custom domain in OSS console"
Write-Host "  2. Add SSL cert for HTTPS"
Write-Host "  3. Verify homepage and 404 page"
Write-Host ""
