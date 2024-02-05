$vm_list = Get-Content "C:\Mediaroom\src\manageserver\vmlist.txt" #txt file with the vm list

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
foreach ($vm in $vm_list)
{
$vms = Get-VM -Name  $vm
Write-Output($vms)
$row = $table.NewRow()
$row.ServerName = $vms.VMName
$row.ServerId = $vms.VMId
$row.ServerStatus = $vms.State
$table.Rows.Add($row)
}

# Create an HTML version of the DataTable
 $html = @"
 <style>
 table {         
    border-collapse: collapse;         
    width: 100%;     
}   
  th, td 
  {         
    border: 1px solid #dddddd;         
    text-align: left;         
    padding: 8px;     }    
 th {         
    background-color: #f2f2f2;     
}
h2 {
    color:red;
}
</style>
<table><tr><th>SERVER NAME</th><th>SERVER STATUS</th><th>SERVER ID</th></tr> 
"@
 foreach ($row in $table.Rows)
 { 
     $html += "<tr><td>" + $row[0] + "</td><td>" + $row[2] + "</td><td>" + $row[1] + "</td></tr>"
 }
 $html += "</table>"
        $subj = "SERVER STATUS ALERT"
        $body = "<h2>SERVER STATUS</h2> <h3>VMs are not active and we are restarting it</h3><br>" + $html

foreach($vm in $vm_list)
{
    $vms = Get-VM -Name $vm
    if($vms.State -eq "off"){
        $smtpPort = 587
        $smtpServer = "smtp.office365.com" 
        $receiverEmail = "raghavendra.ga9@outlook.com"
        $senderEmail = "raghavendra.ga9@outlook.com"
        $password = "Rathna@123"
        $SecurePassword = ConvertTo-SecureString -string $password -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential -argumentlist $senderEmail, $SecurePassword
            
        Send-MailMessage -From $senderEmail -To $receiverEmail -Subject $subj -Body $body -BodyAsHtml -SmtpServer $smtpServer -Port $smtpPort -UseSsl -Credential (Get-Credential -Credential $Cred)
        break
    }
}
# Check server health status and restart if it is not active
Write-Output("SERVER HEALTH STATUS")
foreach ($vm in $vm_list) {
    $vms = Get-VM -Name  $vm
    if ($vms.State -eq "Running") {
        Write-Output("The virtual machine " + $vm + " is " + $vms.State)
    }
    elseif ($vms.State -eq "off") { 
        Start-VM $vm #<replace this with any of the above commands to suit your need>
    }
    else {
        Restart-VM $vm -Force #<replace this with any of the above commands to suit your need>
    }   
}

# # Code to get server status and save it in json file
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


# # Example JSON data with multiple objects
$data = @(
    [PSCustomObject]@{
        Server_Name	 = $servername_list[0]
        ISS_Status = "Running"
        Server_ID = $serveid_list[0]
        Server_Status = $serverstatus_list[0]
        Static_Snapshot = "NA"
    },
    [PSCustomObject]@{
        Server_Name	 = $servername_list[1]
        ISS_Status = "Running"
        Server_ID = $serveid_list[1]
        Server_Status = $serverstatus_list[1]
        Static_Snapshot = "NA"
    },
    [PSCustomObject]@{
        Server_Name	 = $servername_list[2]
        ISS_Status = "Running"  
        Server_ID = $serveid_list[2]
        Server_Status = $serverstatus_list[2]
        Static_Snapshot = "NA"
    })

# Convert the updated array to JSON
$updatedJsonString = $data | ConvertTo-Json

# Specify the file path where you want to save the JSON data
$filePath = "C:\Mediaroom\src\manageserver\ServerData.json"

# Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8