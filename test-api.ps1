add-type @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustAll : ICertificatePolicy {
    public bool CheckValidationResult(ServicePoint sp, X509Certificate cert, WebRequest req, int problem) { return true; }
}
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAll
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

Write-Host "=== REGISTER ===" -ForegroundColor Green
$r = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"demo@gmail.com","password":"demo123"}'
$r

Write-Host "=== LOGIN ===" -ForegroundColor Green
$res = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"demo@gmail.com","password":"demo123"}'
$token = $res.token
Write-Host "Token OK" -ForegroundColor Yellow

Write-Host "=== CREATE TASK ===" -ForegroundColor Green
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body '{"title":"Demo task","status":"pending"}'

Write-Host "=== GET TASKS ===" -ForegroundColor Green
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method GET -Headers @{Authorization="Bearer $token"}

Write-Host "=== NO TOKEN ===" -ForegroundColor Red
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method GET