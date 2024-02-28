$roleTypeXmlFilePath = "C:\Mediaroom\Roles.xml"
$roleDescriptionsXml = [xml](Get-Content $roleTypeXmlFilePath)
 
 
$roleDescriptions = @{}
foreach ($role in $roleDescriptionsXml.SelectNodes("//machineRole")) {
    $roleName = $role.SelectSingleNode("@role").Value
    $roleType = $role.SelectSingleNode("@type").Value
    $roleDescriptions[$roleName] = @{
        "Type" = $roleType
    }
}
$xmlFilePath = "C:\Mediaroom\serverLayout.xml"
$xml = [xml](Get-Content $xmlFilePath)

$serviceNames = @("IptvDeliveryAgent", "IptvSched", "IptvSessionManager","NetTcpPortSharing")
$extractedData = @()
 
 
foreach ($branch in $xml.SelectNodes("//branch")) {
    # $branchName = $branch.SelectSingleNode("@name").Value
    foreach ($zone in $branch.SelectNodes(".//zone")) {
        # $zoneName = $zone.SelectSingleNode("@name").Value
        foreach ($computer in $zone.SelectNodes(".//computer")) {
            $computerName = $computer.SelectSingleNode("@name").Value
            # if ($computerName -eq "MSPBE5BEDB001\LIVEDB" -or `
            # $computerName -eq "MSPBE5MDB001" -or `
            # $computerName -eq "MSPBE5VCRT001" -or `
            # $computerName -eq "MSPBE5VCTRL001") {
                # Get service status for local machine
                # $services = Get-Service -Name "iphlpsvc"| Select-Object -Property Name, Status
            #     $serviceStatus = Get-Service

            #     #  $serviceStatus =$service.Status
            #     # foreach ($service in $services) {
            #     #     $service.Status
            #     # }
            # if ($serviceStatus.Name -eq "iphlpsvc" -or $serviceStatus.Name -eq "AppMgmt" -or $serviceStatus.Name -eq "AppXSvc" -or $serviceStatus.Name -eq "BDESVC" ) {
            #         $iptvServiceStatus = $serviceStatus.Status
            #         if ($iptvServiceStatus -eq "Running") {
            #             $iptvServiceStatus = "Running"
            #         } else {
            #             $iptvServiceStatus = "Stopped"
            #         }
            #     } else {
            #         $iptvServiceStatus = "Service Not Found"
            #     }
            # } 
            $serviceStatus = @()
            foreach ($serviceName in $serviceNames) {
                try {
                    $service = Get-Service -Name $serviceName
                    if ($service) {
                        $statusString = if ($service.Status -eq 'Running') { 'Running' } else { 'Stopped' }
                        $serviceStatus += @{
                            "Name" = $serviceName
                            "Status" = $statusString
                        }
                    } else {
                        $serviceStatus += @{
                            "Name" = $serviceName
                            "Status" = "Service not found"
                        }
                    }
                } catch {
                    $serviceStatus += @{
                        "Name" = $serviceName
                        "Status" = "Error: $($_.Exception.Message)"
                    }
                }
            }
           
            try {
                $result = Test-Connection -ComputerName $computerName -Count 1 -ErrorAction Stop
                if ($result) {
                    $serverStatus = "Reachable"
                } else {
                    $serverStatus = "Unreachable"
                }
            } catch {
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
                "ComputerName" = $computerName
                "Roles" = $roles
                "ServerStatus" = $serverStatus
                "ServiceStatus" = $serviceStatus
            }
        }
    }

}

$updatedJsonString = $extractedData | ConvertTo-Json -Depth 5
 
# Specify the file path where you want to save the JSON data
$filePath = "C:\Mediaroom\src\manageserver\mrserverdata.json"
 
# Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8
Write-Host "JSON file created: $jsonOutputFilePath"