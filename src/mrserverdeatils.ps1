$roleTypeXmlFilePath = ".\Roles.xml"
$roleDescriptionsXml = [xml](Get-Content $roleTypeXmlFilePath)
 
 
$roleDescriptions = @{}
foreach ($role in $roleDescriptionsXml.SelectNodes("//machineRole")) {
    $roleName = $role.SelectSingleNode("@role").Value
    $roleType = $role.SelectSingleNode("@type").Value
    $roleDescriptions[$roleName] = @{
        "Type" = $roleType
    }
}
$xmlFilePath = ".\serverLayout.xml"
$xml = [xml](Get-Content $xmlFilePath)
 
$extractedData = @()
 
 
foreach ($branch in $xml.SelectNodes("//branch")) {
    $branchName = $branch.SelectSingleNode("@name").Value
    foreach ($zone in $branch.SelectNodes(".//zone")) {
        $zoneName = $zone.SelectSingleNode("@name").Value
        foreach ($computer in $zone.SelectNodes(".//computer")) {
            $computerName = $computer.SelectSingleNode("@name").Value
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
            }
        }
    }
}
 

$updatedJsonString = $extractedData | ConvertTo-Json -Depth 5
 
# Specify the file path where you want to save the JSON data
$filePath = ".\mrserverdata.json"
 
# Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8
Write-Host "JSON file created: $jsonOutputFilePath"