$ErrorActionPreference = "Stop"

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("Smoke check run at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")

# Task 2 API check
$job2 = Start-Job -ScriptBlock {
  Set-Location "D:\codex-111"
  node "practice-2-medieval-api/server.js"
}
Start-Sleep -Seconds 2
try {
  $r = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
  $lines.Add("Task 2 API: OK, products count = $($r.Count)")
}
finally {
  Stop-Job $job2 -ErrorAction SilentlyContinue | Out-Null
  Receive-Job $job2 -ErrorAction SilentlyContinue | Out-Null
  Remove-Job $job2 -ErrorAction SilentlyContinue | Out-Null
}

# Task 4 fullstack check
$job4b = Start-Job -ScriptBlock {
  Set-Location "D:\codex-111"
  node "practice-4-fullstack/backend/server.js"
}
$job4f = Start-Job -ScriptBlock {
  Set-Location "D:\codex-111"
  node "practice-4-fullstack/frontend/server.js"
}
Start-Sleep -Seconds 3
try {
  $api = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
  $front = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -UseBasicParsing
  $lines.Add("Task 4 backend: OK, products count = $($api.Count)")
  $lines.Add("Task 4 frontend: OK, status = $($front.StatusCode)")
}
finally {
  Stop-Job $job4b,$job4f -ErrorAction SilentlyContinue | Out-Null
  Receive-Job $job4b,$job4f -ErrorAction SilentlyContinue | Out-Null
  Remove-Job $job4b,$job4f -ErrorAction SilentlyContinue | Out-Null
}

# Task 5 Swagger check
$job5 = Start-Job -ScriptBlock {
  Set-Location "D:\codex-111"
  node "practice-5-swagger/server.js"
}
Start-Sleep -Seconds 3
try {
  $docs = Invoke-WebRequest -Uri "http://localhost:3000/api-docs" -Method Get -UseBasicParsing
  $lines.Add("Task 5 Swagger: OK, status = $($docs.StatusCode)")
}
finally {
  Stop-Job $job5 -ErrorAction SilentlyContinue | Out-Null
  Receive-Job $job5 -ErrorAction SilentlyContinue | Out-Null
  Remove-Job $job5 -ErrorAction SilentlyContinue | Out-Null
}

$output = "D:\codex-111\practice-6-smoke-check.txt"
Set-Content -Path $output -Value $lines -Encoding UTF8
Write-Output "Saved: $output"
