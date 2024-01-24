$vm_list = Get-Content "C:\manageserver\vmlist.txt" #txt file with the vm list

$servername_list = New-Object System.Collections.Generic.List[string]
$serveid_list = New-Object System.Collections.Generic.List[string]
$serverstatus_list = New-Object System.Collections.Generic.List[string]
foreach ($vm in $vm_list)
{
$vms = Get-VM -Name  $vm
# Write-Output($vms)
$servername_list.Add($vms.VMName) 
$serveid_list.Add($vms.VMId)  
$serverstatus_list.Add($vms.State)
}


# Example JSON data with multiple objects
$data = @(
    [PSCustomObject]@{
        ServerName	 = $servername_list[0]
        ServerID = $serveid_list[0]
        Status = $serverstatus_list[0]
    },
    [PSCustomObject]@{
        ServerName	 = $servername_list[1]
        ServerID = $serveid_list[1]
        Status = $serverstatus_list[1]
    },
    [PSCustomObject]@{
        ServerName	 = $servername_list[2]
        ServerID = $serveid_list[2]
        Status = $serverstatus_list[2]
    })

# Convert the updated array to JSON
$updatedJsonString = $data | ConvertTo-Json

# Specify the file path where you want to save the JSON data
$filePath = "C:\Mediaroom\src\manageserver\cerdet.json"

# Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8