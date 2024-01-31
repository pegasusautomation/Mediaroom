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
       $subj = "CERTIFICATE ALERT"
       $body = "<h2>CERTIFICATE DETAILS</h2> <h3>VMs are not active and we are restarting it</h3><br>" + $html

       $smtpPort = 587
       $smtpServer = "smtp.office365.com" 
       $receiverEmail = "raghavendra.ga9@outlook.com"
       $senderEmail = "raghavendra.ga9@outlook.com"
       $password = "Rathna@123"
       $SecurePassword = ConvertTo-SecureString -string $password -AsPlainText -Force
       $Cred = New-Object System.Management.Automation.PSCredential -argumentlist $senderEmail, $SecurePassword
           
       Send-MailMessage -From $senderEmail -To $receiverEmail -Subject $subj -Body $body -BodyAsHtml -SmtpServer $smtpServer -Port $smtpPort -UseSsl -Credential (Get-Credential -Credential $Cred)

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
        Cert_Name	 = $servername_list[0]
        Server_Name = $serveid_list[0]
        Issue_Date = $serverstatus_list[0]
        Expiry_Date = "2033"
        Cert_Template = "template"
        Cert_CA = "digicert"
    },
    [PSCustomObject]@{
        Cert_Name	 = $servername_list[1]
        Server_Name = $serveid_list[1]
        Issue_Date = $serverstatus_list[1]
        Expiry_Date = "2033"
        Cert_Template = "template"
        Cert_CA = "digicert"
    },
    [PSCustomObject]@{
        Cert_Name	 = $servername_list[2]
        Server_Name = $serveid_list[2]
        Issue_Date = $serverstatus_list[2]
        Expiry_Date = "2033"
        Cert_Template = "template"
        Cert_CA = "digicert"
    })

# Convert the updated array to JSON
$updatedJsonString = $data | ConvertTo-Json

# Specify the file path where you want to save the JSON data
$filePath = "C:\Mediaroom\src\CertData.json"

# Write the JSON data to a file
$updatedJsonString | Out-File -FilePath $filePath -Encoding UTF8