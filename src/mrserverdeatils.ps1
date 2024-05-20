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

function Get-RemoteServiceStatus {
    param (
        [string]$ComputerName,
        [string]$Username,
        [string]$Password
    )
    
    $credential = New-Object System.Management.Automation.PSCredential($Username, (ConvertTo-SecureString -String $Password -AsPlainText -Force))
    $scriptBlock = {
        Get-Service | Where-Object { $_.Name -like '*Iptv*' -or $_.DisplayName -like '*Iptv*' -or $_.Name -eq 'W3SVC' -or $_.DisplayName -like '*World Wide Web*' }
    }
    
    $services = Invoke-Command -ComputerName $ComputerName -Credential $credential -ScriptBlock $scriptBlock
    return $services
}

function Get-ServiceStatus {
    param (
        [string]$ComputerName,
        [PSCredential]$Credential,
        [string[]]$ServiceList
    )

    $serviceStatus = @()
    
    foreach ($serviceName in $ServiceList) {
        try {
            $scriptBlock = {
                param($ServiceName)
                Get-Service -Name $ServiceName
            }

            $service = Invoke-Command -ComputerName $ComputerName -Credential $Credential -ScriptBlock $scriptBlock -ArgumentList $serviceName

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
    
    return $serviceStatus
}

# Define the branches to process
$branches = @($xml, $xml_A)
$domains = @($jsonObject.Branch, $jsonObject.Aquasition)

for ($i = 0; $i -lt $branches.Count; $i++) {
    $branch = $branches[$i]
    $domain = $domains[$i]

    foreach ($zone in $branch.SelectNodes("//branch//zone")) {
        foreach ($computer in $zone.SelectNodes(".//computer")) {
            $computerName = $computer.SelectSingleNode("@name").Value
            Write-Output($computerName)
            
            $username = "$domain\$currentUsername"
            $password = 'Password1!'
            
            $services = Get-RemoteServiceStatus -ComputerName $computerName -Username $username -Password $password
            
            $serviceList = $services | Select-Object -ExpandProperty Name
            $credential = New-Object System.Management.Automation.PSCredential($username, (ConvertTo-SecureString -String $password -AsPlainText -Force))
            $serviceStatus = Get-ServiceStatus -ComputerName $computerName -Credential $credential -ServiceList $serviceList

            try {
                $result = Test-Connection -ComputerName $computerName -Count 1 -ErrorAction Stop
                $serverStatus = if ($result) { "Reachable" } else { "Unreachable" }
            }
            catch {
                $serverStatus = "Error: $($_.Exception.Message)"
            }
            
            $roles = @()
            foreach ($roleNode in $computer.SelectNodes(".//role")) {
                $roleName = $roleNode.SelectSingleNode("@name").Value
                $roleType = if ($i -eq 0) { $roleDescriptions[$roleName].Type } else { $roleDescriptions_A[$roleName].Type }
                $roles += @{
                    "Name" = $roleName
                    "Type" = $roleType
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
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8
Write-Host "JSON file created: $filePath"
