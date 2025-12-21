$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$source = Join-Path $PSScriptRoot 'build-android-apk.yml'
$workflowsDir = Join-Path $repoRoot '.github\workflows'
$target = Join-Path $workflowsDir 'build-android-apk.yml'

New-Item -ItemType Directory -Force -Path $workflowsDir | Out-Null
Copy-Item -Force -Path $source -Destination $target

Write-Host "Copied workflow to: $target"
