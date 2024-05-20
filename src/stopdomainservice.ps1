 param (
     [string]$ServiceName, # Accept the service name as a parameter
    [string]$ComputerName,  # Accept the computer name as a parameter
     [string]$Message  # Accept the message as a parameter
 )
 
# Check if the service name is provided
if (-not $ServiceName) {
    Write-Host "Error: Service name not provided."
    exit 1
}

# Check if the computer name is provided
if (-not $ComputerName) {
    Write-Host "Error: Computer name not provided."
    exit 1
}

# Check if the message is provided
if (-not $Message) {
	console.log(message)
    Write-Host "Error: Message not provided."
    exit 1
}

# Get the currently logged-in username and domain
$currentUsername = $env:USERNAME
$currentDomain = $env:USERDOMAIN
if ($computerName -like "MSPBR5*") {
    # Get service name based on computer name
    $username = "$currentDomain\$currentUsername"
}
else {
    # Get service name based on computer name
    $username = "MSPBE5\$currentUsername"
}

$password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $password)

# Invoke-Command to stop the service on the remote computer
Invoke-Command -ComputerName $ComputerName -Credential $credential -ScriptBlock {
    param($serviceName)
    Stop-Service -Name $serviceName
} -ArgumentList $ServiceName

# Invoke-Command to get the service status on the remote computer
$servicename = $ServiceName

$scriptBlock = {
    param($serviceName)
    Get-Service $serviceName
}

$service1 = Invoke-Command -ComputerName $ComputerName -Credential $credential -ScriptBlock $scriptBlock -ArgumentList $ServiceName

$jsonpath = "C:\Mediaroom\src\manageserver\mrserverdata.json"
$json = Get-Content -Path $jsonpath -Raw

# Convert JSON to PowerShell objects
$data = $json | ConvertFrom-Json

# Find the entry for the computer "MSPBR5DSERV103"
$computerEntry = $data | Where-Object { $_.ComputerName -eq $ComputerName }

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


# Store data in a PowerShell hashtable
$currentDate = Get-Date
$serviceData = @{
    "Timelog" = $currentDate.ToString("yyyy-MM-dd HH:mm:ss")
   "User" = $username
   "Machine" = $computerName
   "Service" = $ServiceName
   "Action" = "Stopped"
   "ActionHistory" = $Message
}

# Convert the hashtable to JSON format
$newJsonData = $serviceData | ConvertTo-Json

# Set the file path for the JSON file
$jsonFilePath = "C:\Mediaroom\src\pages\UserLogonevents.json"

# Read existing JSON file content
if (Test-Path $jsonFilePath) {
    $existingJson = Get-Content -Path $jsonFilePath -Raw | ConvertFrom-Json
} else {
    $existingJson = @()
}

# Append the new data to the existing JSON array
$existingJson += $serviceData

# Convert the updated array back to JSON format
$updatedJson = $existingJson | ConvertTo-Json -Depth 100

# Write the updated JSON data to the file
$updatedJson | Set-Content -Path $jsonFilePath -Encoding UTF8

Write-Host "Data added to JSON file: $jsonFilePath"