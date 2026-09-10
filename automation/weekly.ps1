$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$privateDir = Join-Path $env:LOCALAPPDATA 'CholbeiAutomation'
New-Item -ItemType Directory -Force -Path $privateDir | Out-Null
$settings = Get-Content -LiteralPath (Join-Path $privateDir 'settings.json') -Raw | ConvertFrom-Json
$logPath = Join-Path $privateDir ('run-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.log')
Set-Location -LiteralPath $projectRoot
& $settings.nodePath (Join-Path $PSScriptRoot 'run.mjs') --publish *> $logPath
exit $LASTEXITCODE
