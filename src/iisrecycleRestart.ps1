param (
    [string]$computerName,  # Accept the computer name as a parameter
    [string]$Message  # Accept the message as a parameter
)

# Check if the computer name is provided
if (-not $computerName) {
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

if ($computerName -like "MSPBR5*") {
    # Set username based on computer name pattern
    $username = "$currentDomain\$currentUsername"
} else {
    # Set username for other cases
    $username = "MSPBE5\$currentUsername"
}

$password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $password)

# Define the script block to stop IIS using iisreset
$scriptBlock = {
    try {
        # Check if the IIS service exists
        $iisService = Get-Service -Name "W3SVC" -ErrorAction SilentlyContinue
        if ($null -eq $iisService) {
            throw "IIS service does not exist on this server."
        }
        
        # Use cmd.exe to run iisreset /stop
        $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c iisreset /restart" -Wait -NoNewWindow -PassThru
        
        # Check if the process exited successfully
        if ($process.ExitCode -eq 0) {
            Write-Output "IIS reset successfully."
        } else {
            throw "IIS reset failed with exit code $($process.ExitCode)."
        }
    } catch {
        # Capture and output any errors
        Write-Output "Error stopping IIS: $_"
    }
}

# Invoke the command on the remote computer
Invoke-Command -ComputerName $computerName -Credential $credential -ScriptBlock $scriptBlock

# Prepare data to store in the JSON file
$servicecmd = "IISReset /restart"
$currentDate = Get-Date
$serviceData = @{
    "Timelog" = $currentDate.ToString("yyyy-MM-dd HH:mm:ss")
    "User" = $username
    "Machine" = $computerName
    "Service" = $servicecmd
    "Action" = "IIS Restarted"
    "ActionHistory" = $Message
}

# Convert the hashtable to JSON format
$newJsonData = $serviceData | ConvertTo-Json

# Set the file path for the JSON file
$jsonFilePath = "C:\Mediaroom\src\pages\UserLogonevents.json"

# Read existing JSON file content
if (Test-Path $jsonFilePath) {
    $existingJson = Get-Content -Path $jsonFilePath -Raw | ConvertFrom-Json
    # Ensure existingJson is treated as an array
    if ($existingJson -isnot [array]) {
        $existingJson = @($existingJson)
    }
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
