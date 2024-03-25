# Retrieve personal certificates from the local computer
$personalCertificates = Get-ChildItem -Path Cert:\LocalMachine\My

# Create an array to store certificate details
$certDetailsArray = @()

# Loop through each certificate
foreach ($cert in $personalCertificates) {
    # Check if the certificate is not null
    if ($cert -ne $null) {
        # Retrieve the Subject Key Identifier extension
        $skiExtension = $cert.Extensions | Where-Object { $_.Oid.Value -eq "2.5.29.14" }
        if ($skiExtension) {
            $ski = $skiExtension.Format(0)
        } else {
            $ski = "Not available"
        }

        # Create a hashtable to store certificate details
        $certDetails = @{
            "Subject" = $cert.Subject
            "IssuedTo" = $cert.Subject
            "IssuedBy" = $cert.Issuer
            "ExpirationDate" = $cert.GetExpirationDateString()
            "ValidFrom" = $cert.NotBefore.ToString("yyyy-MM-dd HH:mm:ss")
            "ValidTo" = $cert.NotAfter.ToString("yyyy-MM-dd HH:mm:ss")
            "SubjectKeyIdentifier" = $ski
        }

        # Add the hashtable to the array
        $certDetailsArray += $certDetails
    }
}

$updatedJsonString = $certDetailsArray | ConvertTo-Json -Depth 5
# Specify the file path where you want to save the JSON data
$filePath = "C:\Mediaroom\src\managecert\certdata.json"
# # # Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8
Write-Host "JSON file created: $jsonOutputFilePath"
