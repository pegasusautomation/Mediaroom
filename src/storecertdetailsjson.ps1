$vm_list = Get-Content "C:\Mediaroom\src\thumbprints.txt" #txt file with the vm list

# Snippet to send alert
# Create a DataTable
$table = New-Object system.Data.DataTable "TestTable"
$col1 = New-Object system.Data.DataColumn ServerName,([string])
$col2 = New-Object system.Data.DataColumn ServerId,([string])
$col3 = New-Object system.Data.DataColumn ServerStatus,([string])
$table.columns.add($col1)
$table.columns.add($col2)
$table.columns.add($col3)
# Add content to the DataTable
foreach ($thumbprint in $vm_list)
{
$vms = Get-ChildItem Cert:\\LocalMachine\\root\\$thumbprint | Select-Object -ExpandProperty NotAfter
$row = $table.NewRow()
$row.ServerName = $vms.Date
$row.ServerId = $vms.Year
$row.ServerStatus = $vms.Day
$table.Rows.Add($row)
}

# Code to get server status and save it in json file
$servername_list = New-Object System.Collections.Generic.List[string]
$serveid_list = New-Object System.Collections.Generic.List[string]
$serverstatus_list = New-Object System.Collections.Generic.List[string]
foreach ($thumbprint in $vm_list)
{
$vms = Get-ChildItem Cert:\\LocalMachine\\root\\$thumbprint | Select-Object -ExpandProperty NotAfter
# Write-Output($vms)
$servername_list.Add($vms.Date) 
$serveid_list.Add($vms.Day)  
$serverstatus_list.Add($vms.Year)
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
$filePath = "C:\Mediaroom\src\certdata.json"

# Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8