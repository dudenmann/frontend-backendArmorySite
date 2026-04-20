$ErrorActionPreference = "Stop"

$root = "D:\codex-111"
$reportPath = Join-Path $root "practice-3-api-testing\report.md"

function To-PrettyJson {
  param([Parameter(Mandatory = $true)] $Data)
  return ($Data | ConvertTo-Json -Depth 10)
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# Practice 3 - API Testing Report")
$lines.Add("")
$lines.Add("Generated at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("")
$lines.Add("## Part 1. Testing local API from Practice 2 (3 requests)")
$lines.Add("")

$job = Start-Job -ScriptBlock {
  Set-Location "D:\codex-111"
  node "practice-2-medieval-api/server.js"
}

Start-Sleep -Seconds 2

try {
  $req1Url = "http://localhost:3000/api/products"
  $req1Res = Invoke-RestMethod -Uri $req1Url -Method Get
  $lines.Add("### 1) GET /api/products")
  $lines.Add("URL: $req1Url")
  $lines.Add('```json')
  $lines.Add((To-PrettyJson -Data $req1Res))
  $lines.Add('```')
  $lines.Add("")

  $req2Url = "http://localhost:3000/api/products"
  $req2Body = @{
    name = "Garrison Crossbow"
    price = 14300
  }
  $req2Res = Invoke-RestMethod -Uri $req2Url -Method Post -ContentType "application/json" -Body (To-PrettyJson -Data $req2Body)
  $lines.Add("### 2) POST /api/products")
  $lines.Add("URL: $req2Url")
  $lines.Add("Body:")
  $lines.Add('```json')
  $lines.Add((To-PrettyJson -Data $req2Body))
  $lines.Add('```')
  $lines.Add("Response:")
  $lines.Add('```json')
  $lines.Add((To-PrettyJson -Data $req2Res))
  $lines.Add('```')
  $lines.Add("")

  $req3Url = "http://localhost:3000/api/products/$($req2Res.id)"
  $req3Body = @{
    price = 15100
  }
  $req3Res = Invoke-RestMethod -Uri $req3Url -Method Patch -ContentType "application/json" -Body (To-PrettyJson -Data $req3Body)
  $lines.Add("### 3) PATCH /api/products/:id")
  $lines.Add("URL: $req3Url")
  $lines.Add("Body:")
  $lines.Add('```json')
  $lines.Add((To-PrettyJson -Data $req3Body))
  $lines.Add('```')
  $lines.Add("Response:")
  $lines.Add('```json')
  $lines.Add((To-PrettyJson -Data $req3Res))
  $lines.Add('```')
  $lines.Add("")
}
finally {
  Stop-Job $job -ErrorAction SilentlyContinue | Out-Null
  Receive-Job $job -ErrorAction SilentlyContinue | Out-Null
  Remove-Job $job -ErrorAction SilentlyContinue | Out-Null
}

$lines.Add("## Part 2. External API (5 requests)")
$lines.Add("Selected API: TheSportsDB")
$lines.Add("API key: 3 (public test key in URL)")
$lines.Add("")

$teams = @(
  "Arsenal",
  "Real Madrid",
  "Bayern Munich",
  "Juventus",
  "Manchester City"
)

$index = 1
foreach ($team in $teams) {
  $encodedTeam = [System.Uri]::EscapeDataString($team)
  $url = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=$encodedTeam"
  $res = Invoke-RestMethod -Uri $url -Method Get
  if ($res.teams -and $res.teams.Count -gt 0) {
    $first = @{
      strTeam = $res.teams[0].strTeam
      strCountry = $res.teams[0].strCountry
      strLeague = $res.teams[0].strLeague
    }
  } else {
    $first = @{ message = "Team not found" }
  }

  $lines.Add("### $index) GET searchteams.php?t=$team")
  $lines.Add("URL: $url")
  $lines.Add('```json')
  $lines.Add((To-PrettyJson -Data $first))
  $lines.Add('```')
  $lines.Add("")
  $index++
}

$lines.Add("## Conclusion")
$lines.Add("- 3 local CRUD requests were tested.")
$lines.Add("- 5 external API requests were executed.")
$lines.Add("- All outputs are collected in this single report file.")

Set-Content -Path $reportPath -Value $lines -Encoding UTF8
Write-Output "Report saved: $reportPath"
