# Supabase Migration Script
$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc5MTYwMH0.qF1Lg2h2l8P6X8aJvJzXJZJ9dIYz9L-g便民7Q6xT_Zk"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc5MTYwMH0.qF1Lg2h2l8P6X8aJvJzXJZJ9dIYz9L-g便民7Q6xT_Zk"
    "Content-Type" = "application/json"
}

$body = @{
    "sql" = "ALTER TABLE productos ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo'"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://irhbkkfvcawklbahivii.supabase.co/rest/v1/rpc/rpc" -Method POST -Headers $headers -Body $body -TimeoutSec 60
    Write-Host "Step 1 completed"
} catch {
    Write-Host "Step 1 error: $($_.Exception.Message)"
}

Start-Sleep -Seconds 1

$body2 = @{
    "sql" = "ALTER TABLE servicios ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo'"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://irhbkkfvcawklbahivii.supabase.co/rest/v1/rpc/rpc" -Method POST -Headers $headers -Body $body2 -TimeoutSec 60
    Write-Host "Step 2 completed"
} catch {
    Write-Host "Step 2 error: $($_.Exception.Message)"
}

Write-Host "Migration script finished"
