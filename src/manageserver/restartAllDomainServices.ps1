param (
    [string]$ComputerName,  # Accept the computer name as a parameter
    [string]$Message  # Accept the message as a parameter
)

# Check if the computer name is provided
if (-not $ComputerName) {
    Write-Host "Error: Computer name not provided."
    exit 1
}

# Check if the message is provided
if (-not $Message) {
    Write-Host "Error: Message not provided."
    exit 1
}

# Get the currently logged-in username and domain
$currentUsername = $env:USERNAME
$currentDomain = $env:USERDOMAIN

if ($ComputerName -like "MSPBR5*") {
    # Set username based on computer name pattern
    $username = "$currentDomain\$currentUsername"
} else {
    # Set username for other cases
    $username = "MSPBE5\$currentUsername"
}

$password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $password)

# Define the script block to stop services and get their statuses
$stopServiceScriptBlock = {
    param($serviceName)
    Restart-Service -Name $serviceName -Force
    Start-Sleep -Seconds 5
    Get-Service -Name $serviceName
}

# Path to the JSON file
$jsonPath = "C:\Mediaroom\src\manageserver\mrserverdata.json"

# Read the JSON file
$jsonContent = Get-Content -Path $jsonPath -Raw
$data = $jsonContent | ConvertFrom-Json

# Find the entry for the specified computer
$computerEntry = $data | Where-Object { $_.ComputerName -eq $ComputerName }

if (-not $computerEntry) {
    Write-Host "Error: No entry found for computer: $ComputerName"
    exit 1
}

# Loop through each service in the ServiceStatus array and update its status
foreach ($service in $computerEntry.ServiceStatus) {
    $serviceName = $service.Name
    $serviceResult = Invoke-Command -ComputerName $ComputerName -Credential $credential -ScriptBlock $stopServiceScriptBlock -ArgumentList $serviceName
    $service.Status = $serviceResult.Status
    Write-Host "Updated status for service: $serviceName to $($serviceResult.Status)"  # Debugging output
}

# Convert the updated data back to JSON
$jsonUpdated = $data | ConvertTo-Json -Depth 100

# Output the updated JSON for debugging
Write-Host "Updated JSON:"
$jsonUpdated

# Write the updated JSON back to the file
$jsonUpdated | Set-Content -Path $jsonPath -Encoding UTF8
Write-Host "JSON file updated with service statuses."

# Prepare log data
$currentDate = Get-Date
$logEntry = @{
    Timelog = $currentDate.ToString("yyyy-MM-dd HH:mm:ss")
    User = $username
    Machine = $ComputerName
    Service = "AdminService.exe /action=restart"
    Action = "Running"
    ActionHistory = $Message
}

# Path to the log JSON file
$logFilePath = "C:\Mediaroom\src\pages\UserLogonevents.json"

# Read existing log file content
if (Test-Path $logFilePath) {
    $existingLog = Get-Content -Path $logFilePath -Raw | ConvertFrom-Json
    if ($existingLog -isnot [array]) {
        $existingLog = @($existingLog)
    }
} else {
    $existingLog = @()
}

# Append the new log entry
$existingLog += $logEntry

# Convert the updated log entries back to JSON
$updatedLogJson = $existingLog | ConvertTo-Json -Depth 100

# Write the updated log JSON back to the file
$updatedLogJson | Set-Content -Path $logFilePath -Encoding UTF8

Write-Host "Data added to JSON file: $logFilePath"
