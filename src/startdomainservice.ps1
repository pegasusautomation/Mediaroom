param (
    [string]$ServiceName, # Accept the service name as a parameter
    [string]$computerName  # Accept the computer name as a parameter
)

# Check if the service name is provided
if (-not $ServiceName) {
    Write-Host "Error: Service name not provided."
    exit 1
}

# Check if the computer name is provided
if (-not $computerName) {
    Write-Host "Error: Computer name not provided."
    exit 1
}

if ($computerName -like "MSPBR5*") {
    # Get service name based on computer name
    $username = "MSPBR5\Raghavendra.Gandanah"
}
else {
    # Get service name based on computer name
    $username = "MSPBE5\Raghavendra.Gandanah"
}

$password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $password)

# Invoke-Command to stop the service on the remote computer
Invoke-Command -ComputerName $computerName -Credential $credential -ScriptBlock {
    param($serviceName)
    Start-Service -Name $serviceName
} -ArgumentList $ServiceName

# Invoke-Command to get the service status on the remote computer
$servicename = $ServiceName

$scriptBlock = {
    param($serviceName)
    Get-Service $serviceName
}

$service1 = Invoke-Command -ComputerName $computerName -Credential $credential -ScriptBlock $scriptBlock -ArgumentList $ServiceName

$jsonpath = "C:\Mediaroom\src\manageserver\mrserverdata.json"
$json = Get-Content -Path $jsonpath -Raw

# Convert JSON to PowerShell objects
$data = $json | ConvertFrom-Json

# Find the entry for the computer "MSPBR5DSERV103"
$computerEntry = $data | Where-Object { $_.ComputerName -eq $computerName }

# Update the status of the "IptvDeliveryAgent" service to the retrieved status
$computerEntry.ServiceStatus | Where-Object { $_.Name -eq $ServiceName } | ForEach-Object { $_.Status = $service1.Status }

# Convert PowerShell objects back to JSON
$jsonUpdated = $data | ConvertTo-Json -Depth 100

# Output the updated JSON for debugging
Write-Host "Updated JSON:"
$jsonUpdated

# Write the JSON data to a file
$jsonUpdated | Out-File -FilePath $jsonpath -Encoding UTF8
Write-Host "JSON file created: $jsonUpdated"
