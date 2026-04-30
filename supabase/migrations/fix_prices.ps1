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

function Update-Producto {
    param([int]$Id, [hashtable]$Data)
    
    $uri = "$SupabaseUrl/rest/v1/productos?id=eq.$Id"
    $body = $Data | ConvertTo-Json -Compress
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Method PATCH -Headers $headers -Body $body -TimeoutSec 30
        Write-Host "Updated producto $Id" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Error updating producto $Id : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Update-Servicio {
    param([int]$Id, [hashtable]$Data)
    
    $uri = "$SupabaseUrl/rest/v1/servicios?id=eq.$Id"
    $body = $Data | ConvertTo-Json -Compress
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Method PATCH -Headers $headers -Body $body -TimeoutSec 30
        Write-Host "Updated servicio $Id" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Error updating servicio $Id : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "=== CORRECTING PRODUCTOS ===" -ForegroundColor Cyan

# Corrected prices for productos (based on context)
$productoCorrections = @{
    # Stickers y Pegatinas
    11 = @{ price = "100.00"; price_num = 100; price_type = "fijo" }  # Stickers 5x5 cm
    12 = @{ price = "150.00"; price_num = 150; price_type = "fijo" }  # Pegatinas grandes
    # Posters
    13 = @{ price = "200.00"; price_num = 200; price_type = "fijo" }  # Posters 21x14
    14 = @{ price = "250.00"; price_num = 250; price_type = "fijo" }  # Posters 20x20
    15 = @{ price = "350.00"; price_num = 350; price_type = "fijo" }  # Posters 40x20
    16 = @{ price = "500.00"; price_num = 500; price_type = "fijo" }  # Posters 50x30
    17 = @{ price = "350.00"; price_num = 350; price_type = "fijo" }  # Posters 60x40
    # Cuadros
    18 = @{ price = "200.00"; price_num = 200; price_type = "fijo" }  # Cuadros 10x15
    19 = @{ price = "300.00"; price_num = 300; price_type = "fijo" }  # Cuadros 21x14
    20 = @{ price = "1000.00"; price_num = 1000; price_type = "fijo" } # Cuadros 20x20
    21 = @{ price = "1600.00"; price_num = 1600; price_type = "fijo" } # Cuadros 30x20
    22 = @{ price = "1150.00"; price_num = 1150; price_type = "fijo" } # Cuadros 35x25
    # Tarjetas
    23 = @{ price = "50.00"; price_num = 50; price_type = "fijo" }   # Tarjetas 1 cara Cartulina
    24 = @{ price = "80.00"; price_num = 80; price_type = "fijo" }   # Tarjetas 2 caras Cartulina
    25 = @{ price = "100.00"; price_num = 100; price_type = "fijo" }  # Tarjetas 1 cara Mica
    26 = @{ price = "150.00"; price_num = 150; price_type = "fijo" }  # Tarjetas 2 caras Mica
    27 = @{ price = "60.00"; price_num = 60; price_type = "fijo" }   # Invitaciones
    # Lonas
    28 = @{ price = "500.00"; price_num = 500; price_type = "fijo" }  # Lonas 20x15
    29 = @{ price = "800.00"; price_num = 800; price_type = "fijo" }  # Lonas 20x20
    30 = @{ price = "1000.00"; price_num = 1000; price_type = "fijo" } # Lonas 20x25
    31 = @{ price = "2500.00"; price_num = 2500; price_type = "fijo" } # Lonas 60x40
    # Otros
    32 = @{ price = "1100.00"; price_num = 1100; price_type = "fijo" } # Ampliacion 1.30x90
    33 = @{ price = "50.00"; price_num = 50; price_type = "fijo" }     # Credenciales
    34 = @{ price = "100.00"; price_num = 100; price_type = "fijo" }   # Porta Celular
    35 = @{ price = "200.00"; price_num = 200; price_type = "fijo" }   # Cartas QR PVC
}

foreach ($id in $productoCorrections.Keys) {
    Update-Producto -Id $id -Data $productoCorrections[$id]
    Start-Sleep -Milliseconds 100
}

Write-Host "`n=== CORRECTING SERVICIOS ===" -ForegroundColor Cyan

# Corrected prices for servicios
$servicioCorrections = @{
    10 = @{ price = "500.00"; price_num = 500; price_type = "fijo" }   # Taller Negociacion
    11 = @{ price = "500.00"; price_num = 500; price_type = "fijo" }   # Taller Marketing
    1  = @{ price = "60.00"; price_num = 60; price_type = "desde" }   # Consultoria Experta
    2  = @{ price = "5000.00"; price_num = 5000; price_type = "desde" } # Marketing Digital
    3  = @{ price = "5000.00"; price_num = 5000; price_type = "desde" } # Automatizacion
    7  = @{ price = "500.00"; price_num = 500; price_type = "desde" }   # Asesoramiento Tecnico
    8  = @{ price = "800.00"; price_num = 800; price_type = "desde" }   # Sistemas Contabilidad
    9  = @{ price = "1000.00"; price_num = 1000; price_type = "desde" } # Automatizacion Procesos
}

foreach ($id in $servicioCorrections.Keys) {
    Update-Servicio -Id $id -Data $servicioCorrections[$id]
    Start-Sleep -Milliseconds 100
}

Write-Host "`n=== CORRECTION COMPLETE ===" -ForegroundColor Green
