# Replace "RemoteComputerName" with the actual name or IP address of the remote computer
$remoteComputer = "192.168.1.37"

# Specify the certificate store (e.g., 'Cert:\LocalMachine\My' for the Personal store)
$certStore = \\$remoteComputer\c$\ProgramData\Microsoft\Crypto\RSA\MachineKeys

# Get certificate details from the remote computer
$certificates = Get-ChildItem -Path $certStore

# Display certificate details
foreach ($cert in $certificates) {
    $certThumbprint = $cert.Thumbprint
    $certSubject = $cert.Subject
    $certIssuer = $cert.Issuer
    $certNotBefore = $cert.NotBefore
    $certNotAfter = $cert.NotAfter

    Write-Host "Thumbprint: $certThumbprint"
    Write-Host "Subject: $certSubject"
    Write-Host "Issuer: $certIssuer"
    Write-Host "Not Before: $certNotBefore"
    Write-Host "Not After: $certNotAfter"
    Write-Host "----------------------"
}