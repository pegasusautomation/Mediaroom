$roleTypeXmlFilePath = "C:\Mediaroom\Roles.xml"
$roleDescriptionsXml = [xml](Get-Content $roleTypeXmlFilePath) 

$roleTypeXmlFilePath_A = "C:\Mediaroom\ARoles.xml"
$roleDescriptionsXml_A = [xml](Get-Content $roleTypeXmlFilePath_A) 
 
$roleDescriptions = @{}
foreach ($role in $roleDescriptionsXml.SelectNodes("//machineRole")) {
    $roleName = $role.SelectSingleNode("@role").Value
    $roleType = $role.SelectSingleNode("@type").Value
    $roleDescriptions[$roleName] = @{
        "Type" = $roleType
    }
}

$roleDescriptions_A = @{}
foreach ($role in $roleDescriptionsXml_A.SelectNodes("//machineRole")) {
    $roleName = $role.SelectSingleNode("@role").Value
    $roleType = $role.SelectSingleNode("@type").Value
    $roleDescriptions_A[$roleName] = @{
        "Type" = $roleType
    }
}

$xmlFilePath = "C:\Mediaroom\serverLayout.xml"
$xml = [xml](Get-Content $xmlFilePath)

$xmlFilePath_A = "C:\Mediaroom\AserverLayout.xml"
$xml_A = [xml](Get-Content $xmlFilePath_A)

# Read domain info JSON file content
$jsonContent = Get-Content -Raw -Path 'C:\Mediaroom\config\domain.json'

# Convert domain name content to PowerShell object
$jsonObject = $jsonContent | ConvertFrom-Json

$certDetailsArray = @()

# Refers to B server layout
foreach ($branch in $xml.SelectNodes("//branch")) {
    # $branchName = $branch.SelectSingleNode("@name").Value
    foreach ($zone in $branch.SelectNodes(".//zone")) {
        # $zoneName = $zone.SelectSingleNode("@name").Value
        foreach ($computer in $zone.SelectNodes(".//computer")) {
            $computerName = $computer.SelectSingleNode("@name").Value
            Write-Output($computerName)		
            # Get service name based on computer name
            $username = "$($jsonObject.Branch)\Raghavendra.Gandanah"
            # $username = 'MSPBR5\Raghavendra.Gandanah'
            $password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
            $credential = New-Object System.Management.Automation.PSCredential($username, $password)
            $remoteComputer = $computerName
            $Servicename = $serviceName

            $scriptBlock = {
                Get-ChildItem -Path Cert:\LocalMachine\My
            }

            $personalCertificates = Invoke-Command -ComputerName $remoteComputer -Credential $credential -ScriptBlock $scriptBlock

                        
            if ($personalCertificates) {
                # Create an array to store certificate details

                # Loop through each certificate
                foreach ($cert in $personalCertificates) {
                    # Check if the certificate is not null
                    if ($cert -ne $null) {
                        # Retrieve the Subject Key Identifier extension
                        $skiExtension = $cert.Extensions | Where-Object { $_.Oid.Value -eq "2.5.29.14" }
                        if ($skiExtension) {
                            $ski = $skiExtension.Format(0)
                        }
                        else {
                            $ski = "Not available"
                        }

                        # Define the desired column order
                        $columnOrder = "Computer Name", "Issued To", "Issued By", "Expiration Date", "Valid From", "Valid To", "Subject Key Identifier"

                        # Create a custom object to store certificate details in the desired order
                        $certDetailsObject = [PSCustomObject]@{
                            "Computer Name"          = $remoteComputer
                            "Issued To"              = $cert.Subject
                            "Issued By"              = $cert.Issuer
                            "Valid From"             = $cert.NotBefore.ToString("yyyy-MM-dd HH:mm:ss")
                            "Valid To"               = $cert.NotAfter.ToString("yyyy-MM-dd HH:mm:ss")
                            "Subject Key Identifier" = $ski
                        } | Select-Object -Property $columnOrder

                        # Add the custom object to the array
                        $certDetailsArray += $certDetailsObject
                    }
                }


  
            }
        }
    }
}

# Refers to A server layout
foreach ($branch in $xml_A.SelectNodes("//branch")) {
    # $branchName = $branch.SelectSingleNode("@name").Value
    foreach ($zone in $branch.SelectNodes(".//zone")) {
        # $zoneName = $zone.SelectSingleNode("@name").Value
        foreach ($computer in $zone.SelectNodes(".//computer")) {
            $computerName = $computer.SelectSingleNode("@name").Value
            Write-Output($computerName)		
            # Get service name based on computer name
            $username = "$($jsonObject.Aquasition)\Raghavendra.Gandanah"
            # $username = 'MSPBR5\Raghavendra.Gandanah'
            $password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
            $credential = New-Object System.Management.Automation.PSCredential($username, $password)
            $remoteComputer = $computerName
            $Servicename = $serviceName

            $scriptBlock = {
                Get-ChildItem -Path Cert:\LocalMachine\My
            }

            $personalCertificates = Invoke-Command -ComputerName $remoteComputer -Credential $credential -ScriptBlock $scriptBlock

                        
            if ($personalCertificates) {
                # Create an array to store certificate details

                # Loop through each certificate
                foreach ($cert in $personalCertificates) {
                    # Check if the certificate is not null
                    if ($cert -ne $null) {
                        # Retrieve the Subject Key Identifier extension
                        $skiExtension = $cert.Extensions | Where-Object { $_.Oid.Value -eq "2.5.29.14" }
                        if ($skiExtension) {
                            $ski = $skiExtension.Format(0)
                        }
                        else {
                            $ski = "Not available"
                        }

                        # Define the desired column order
                        $columnOrder = "Computer Name", "Issued To", "Issued By", "Expiration Date", "Valid From", "Valid To", "Subject Key Identifier"

                        # Create a custom object to store certificate details in the desired order
                        $certDetailsObject = [PSCustomObject]@{
                            "Computer Name"          = $remoteComputer
                            "Issued To"              = $cert.Subject
                            "Issued By"              = $cert.Issuer
                            "Valid From"             = $cert.NotBefore.ToString("yyyy-MM-dd HH:mm:ss")
                            "Valid To"               = $cert.NotAfter.ToString("yyyy-MM-dd HH:mm:ss")
                            "Subject Key Identifier" = $ski
                        } | Select-Object -Property $columnOrder

                        # Add the custom object to the array
                        $certDetailsArray += $certDetailsObject
                    }
                }



            }
        }
    }
}

$updatedJsonString = $certDetailsArray | ConvertTo-Json -Depth 100
# Specify the file path where you want to save the JSON data
$filePath = "C:\Mediaroom\src\managecert\certdata.json"
# # # Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8
Write-Host "JSON file created: $jsonOutputFilePath"