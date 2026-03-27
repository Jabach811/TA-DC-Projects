param(
  [string]$SourceFolder = "$env:USERPROFILE\Downloads",
  [string]$TargetFolder = ".\updates"
)

$ErrorActionPreference = "Stop"

$source = Resolve-Path -LiteralPath $SourceFolder
if (-not (Test-Path -LiteralPath $TargetFolder)) {
  New-Item -ItemType Directory -Path $TargetFolder | Out-Null
}
$target = Resolve-Path -LiteralPath $TargetFolder

$files = Get-ChildItem -LiteralPath $source -Filter "dc-growth-sync-*.json" -File
if (-not $files) {
  Write-Host "No sync files found in $source"
  exit 0
}

$published = 0
foreach ($file in $files) {
  try {
    $json = Get-Content -LiteralPath $file.FullName -Raw | ConvertFrom-Json
    if ($json.type -ne "dc-growth-employee-sync") { continue }
    $profileId = [string]$json.profileId
    if (-not $profileId) { continue }
    $dest = Join-Path $target "$profileId.json"
    Copy-Item -LiteralPath $file.FullName -Destination $dest -Force
    $published++
    Write-Host "Published $($file.Name) -> $dest"
  } catch {
    Write-Host "Skipped invalid file: $($file.Name)"
  }
}

Write-Host "Done. Published $published file(s)."
