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

$extractedData = @()

# Get the currently logged-in username and domain
$currentUsername = $env:USERNAME
# Refers to B server layout
foreach ($branch in $xml.SelectNodes("//branch")) {
    # $branchName = $branch.SelectSingleNode("@name").Value
    foreach ($zone in $branch.SelectNodes(".//zone")) {
        # $zoneName = $zone.SelectSingleNode("@name").Value
        foreach ($computer in $zone.SelectNodes(".//computer")) {
            $computerName = $computer.SelectSingleNode("@name").Value
            Write-Output($computerName)
			
            # Get service name based on computer name
            $username = "$($jsonObject.Branch)\$currentUsername"
            #  $username = 'MSPBR5\Raghavendra.Gandanah'
            $password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
            $credential = New-Object System.Management.Automation.PSCredential($username, $password)
            $remoteComputer = $computerName
            $scriptBlock = {
                # Your PowerShell command or script here
                Get-Service
            }

            $allServices = Invoke-Command -ComputerName $remoteComputer -Credential $credential -ScriptBlock $scriptBlock
            # $serviceNames = @("IptvDeliveryAgent", "IptvSched", "IptvSessionManager","NetTcpPortSharing")
            # Create an empty list to store services
            $serviceList = @()
            foreach ($service in $allServices.Name) {
                if ($service.Contains("Iptv") -or $service.Contains("IPTV") -or $service.Contains("W3SVC")) {
                    $serviceList += $service
                }
            }

            foreach ($servicedec in $allServices.DisplayName) {
                if ($servicedec.Contains("Iptv") -or $servicedec.Contains("IPTV") -or $servicedec.Contains("World Wide Web")) {
                    # Get the service with the specified display name
                    $correspondingservice = Get-Service | Where-Object { $_.DisplayName -eq $servicedec }
                    if ($correspondingservice.Name -notin $serviceList) {
                        $serviceList += $correspondingservice.Name
                    } 
                }
            }
 
            $serviceStatus = @()
            if ($serviceList) {
                foreach ($serviceName in $serviceList) {
                    try {                        
                        # Get service name based on computer name
                        $username = "$($jsonObject.Branch)\$currentUsername"
                        # $username = 'MSPBR5\Raghavendra.Gandanah'
                        $password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
                        $credential = New-Object System.Management.Automation.PSCredential($username, $password)
                        $remoteComputer = $computerName
                        $Servicename = $serviceName

                        $scriptBlock = {
                            param($ServiceName)
                            Get-Service -Name $ServiceName
                        }

                        $service = Invoke-Command -ComputerName $remoteComputer -Credential $credential -ScriptBlock $scriptBlock -ArgumentList $Servicename

                        
                        if ($service) {
                            $statusString = if ($service.Status -eq 'Running') { 'Running' } else { 'Stopped' }
                            $serviceStatus += @{
                                "Name"   = $serviceName
                                "Status" = $statusString
                            }
                        }
                        else {
                            $serviceStatus += @{
                                "Name"   = $serviceName
                                "Status" = "Service not found"
                            }
                        }
                    }
                    catch {
                        $serviceStatus += @{
                            "Name"   = $serviceName
                            "Status" = "Error: $($_.Exception.Message)"
                        }
                    }
                }
            }
            else {
                $serviceStatus += @{
                    "Name"   = "No service found"
                    "Status" = "NA"
                }
            }
           
            try {
                $result = Test-Connection -ComputerName $computerName -Count 1 -ErrorAction Stop
                if ($result) {
                    $serverStatus = "Reachable"
                }
                else {
                    $serverStatus = "Unreachable"
                }
            }
            catch {
                $serverStatus = "Error: $($_.Exception.Message)"
            }
            
            $roles = @()
            foreach ($roleNode in $computer.SelectNodes(".//role")) {
                $roleName = $roleNode.SelectSingleNode("@name").Value
                if ($roleDescriptions.ContainsKey($roleName)) {
                    $roleType = $roleDescriptions[$roleName].Type
                    $roles += @{
                        "Name" = $roleName
                        "Type" = $roleType
                    }
                }
            }
            $extractedData += @{
                "ComputerName"   = $computerName
                "Roles"          = $roles
                "ComputerStatus" = $serverStatus
                "ServiceStatus"  = $serviceStatus
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
            $username = "$($jsonObject.Aquasition)\$currentUsername"
            #  $username = 'MSPBR5\Raghavendra.Gandanah'
            $password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
            $credential = New-Object System.Management.Automation.PSCredential($username, $password)
            $remoteComputer = $computerName
            $scriptBlock = {
                # Your PowerShell command or script here
                Get-Service
            }

            $allServices = Invoke-Command -ComputerName $remoteComputer -Credential $credential -ScriptBlock $scriptBlock
            # $serviceNames = @("IptvDeliveryAgent", "IptvSched", "IptvSessionManager","NetTcpPortSharing")
            # Create an empty list to store services
            $serviceList = @()
            foreach ($service in $allServices.Name) {
                if ($service.Contains("Iptv") -or $service.Contains("IPTV") -or $service.Contains("W3SVC")) {
                    $serviceList += $service
                }
            }

            foreach ($servicedec in $allServices.DisplayName) {
                if ($servicedec.Contains("Iptv") -or $service.Contains("IPTV") -or $servicedec.Contains("World Wide Web")) {
                    # Get the service with the specified display name
                    $correspondingservice = Get-Service | Where-Object { $_.DisplayName -eq $servicedec }
                    if ($correspondingservice.Name -notin $serviceList) {
                        $serviceList += $correspondingservice.Name
                    } 
                }
            }
 
            $serviceStatus = @()
            if ($serviceList) {
                foreach ($serviceName in $serviceList) {
                    try {
                        # Get service name based on computer name
                        $username = "$($jsonObject.Aquasition)\$currentUsername"
                        # $username = 'MSPBR5\Raghavendra.Gandanah'
                        $password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
                        $credential = New-Object System.Management.Automation.PSCredential($username, $password)
                        $remoteComputer = $computerName
                        $Servicename = $serviceName

                        $scriptBlock = {
                            param($ServiceName)
                            Get-Service -Name $ServiceName
                        }

                        $service = Invoke-Command -ComputerName $remoteComputer -Credential $credential -ScriptBlock $scriptBlock -ArgumentList $Servicename

                        
                        if ($service) {
                            $statusString = if ($service.Status -eq 'Running') { 'Running' } else { 'Stopped' }
                            $serviceStatus += @{
                                "Name"   = $serviceName
                                "Status" = $statusString
                            }
                        }
                        else {
                            $serviceStatus += @{
                                "Name"   = $serviceName
                                "Status" = "Service not found"
                            }
                        }
                    }
                    catch {
                        $serviceStatus += @{
                            "Name"   = $serviceName
                            "Status" = "Error: $($_.Exception.Message)"
                        }
                    }
                }
            }
            else {
                $serviceStatus += @{
                    "Name"   = "No service found"
                    "Status" = "NA"
                }
            }
           
            try {
                $result = Test-Connection -ComputerName $computerName -Count 1 -ErrorAction Stop
                if ($result) {
                    $serverStatus = "Reachable"
                }
                else {
                    $serverStatus = "Unreachable"
                }
            }
            catch {
                $serverStatus = "Error: $($_.Exception.Message)"
            }
            
            $roles = @()
            foreach ($roleNode in $computer.SelectNodes(".//role")) {
                $roleName = $roleNode.SelectSingleNode("@name").Value
                if ($roleDescriptions_A.ContainsKey($roleName)) {
                    $roleType = $roleDescriptions_A[$roleName].Type
                    $roles += @{
                        "Name" = $roleName
                        "Type" = $roleType
                    }
                }
            }
            $extractedData += @{
                "ComputerName"   = $computerName
                "Roles"          = $roles
                "ComputerStatus" = $serverStatus
                "ServiceStatus"  = $serviceStatus
            }
        }
    }

}

$updatedJsonString = $extractedData | ConvertTo-Json -Depth 5
 
# Specify the file path where you want to save the JSON data
$filePath = "C:\Mediaroom\src\manageserver\mrserverdata.json"
 
# # # Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8
Write-Host "JSON file created: $jsonOutputFilePath"