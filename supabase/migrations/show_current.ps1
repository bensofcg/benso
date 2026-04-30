param(
    [string]$SupabaseUrl = "https://irhbkkfvcawklbahivii.supabase.co",
    [string]$ApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Mzk5MDYsImV4cCI6MjA5MTQxNTkwNn0.ZwFd14KhtXXJ1iuyGhJL5iptiEzK3oS3cr9NeexB0GQ"
)

$headers = @{
    "apikey" = $ApiKey
    "Authorization" = "Bearer $ApiKey"
    "Content-Type" = "application/json"
}

Write-Host "=== Fetching current data ===" -ForegroundColor Cyan

# Get productos
$productosUri = "$SupabaseUrl/rest/v1/productos?select=id,title,price,price_num,price_type"
$productos = Invoke-RestMethod -Uri $productosUri -Method GET -Headers $headers -TimeoutSec 30

# Get servicios
$serviciosUri = "$SupabaseUrl/rest/v1/servicios?select=id,title,price,price_num,price_type"
$servicios = Invoke-RestMethod -Uri $serviciosUri -Method GET -Headers $headers -TimeoutSec 30

Write-Host "`n=== PRODUCTOS ===" -ForegroundColor Yellow
$productos | ForEach-Object { 
    Write-Host "[$($_.id)] $($_.title) - Price: '$($_.price)' Type: $($_.price_type)" 
}

Write-Host "`n=== SERVICIOS ===" -ForegroundColor Yellow
$servicios | ForEach-Object { 
    Write-Host "[$($_.id)] $($_.title) - Price: '$($_.price)' Type: $($_.price_type)" 
}

Write-Host "`n=== CORRECTIONS NEEDED ===" -ForegroundColor Cyan
Write-Host "The data above shows the current broken prices."
Write-Host "To fix these, you need to run this SQL in Supabase SQL Editor:"
Write-Host ""
Write-Host "UPDATE productos SET price = '100.00', price_num = 100 WHERE id = 11;"
Write-Host "UPDATE productos SET price = '150.00', price_num = 150 WHERE id = 12;"
Write-Host "-- ... etc for all products and services"
Write-Host ""
Write-Host "Or use the fix_prices.sql file in supabase/migrations/"
