param(
    [string]$SupabaseUrl = "https://irhbkkfvcawklbahivii.supabase.co",
    [string]$ApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Mzk5MDYsImV4cCI6MjA5MTQxNTkwNn0.ZwFd14KhtXXJ1iuyGhJL5iptiEzK3oS3cr9NeexB0GQ"
)

$headers = @{
    "apikey" = $ApiKey
    "Authorization" = "Bearer $ApiKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=minimal"
}

function Invoke-SupabaseQuery {
    param([string]$Sql)
    
    $body = @{
        query = $Sql
    } | ConvertTo-Json -Compress
    
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    $encoded = [Convert]::ToBase64String($bytes)
    
    try {
        $uri = "$SupabaseUrl/rest/v1/rpc/pg_catalog.pg_stat_statements_reset"
        Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -TimeoutSec 30
    } catch {
        # Try direct query approach
    }
}

function Get-CurrentProducts {
    $uri = "$SupabaseUrl/rest/v1/productos?select=id,title,price,price_num,price_type"
    $response = Invoke-RestMethod -Uri $uri -Method GET -Headers $headers -TimeoutSec 30
    return $response
}

function Get-CurrentServicios {
    $uri = "$SupabaseUrl/rest/v1/servicios?select=id,title,price,price_num,price_type"
    $response = Invoke-RestMethod -Uri $uri -Method GET -Headers $headers -TimeoutSec 30
    return $response
}

Write-Host "Fetching current data..."
$productos = Get-CurrentProducts
$servicios = Get-CurrentServicios

Write-Host "`n=== PRODUCTOS ===" -ForegroundColor Cyan
$productos | ForEach-Object { 
    Write-Host "[$($_.id)] $($_.title) - Price: '$($_.price)' Type: $($_.price_type)" 
}

Write-Host "`n=== SERVICIOS ===" -ForegroundColor Cyan
$servicios | ForEach-Object { 
    Write-Host "[$($_.id)] $($_.title) - Price: '$($_.price)' Type: $($_.price_type)" 
}
