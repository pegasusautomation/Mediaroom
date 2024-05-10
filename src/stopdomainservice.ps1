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

if ($ComputerName -like "MSPBR5*") {
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


# Initialize an empty array to store data
$currentDate = Get-Date 
$receivedData = @{
   "Timelog" = $currentDate.ToString("yyyy-MM-dd HH:mm:ss")
   "User" = $username
   "Machine" = $computerName
   "Service" = $ServiceName
   "Action" = "Stopped"
   "Action History" = $Message
}

# Convert the received data to JSON format
$newJsonData = $receivedData | ConvertTo-Json -Depth 100

# Set the file path
$filePath = "C:\Mediaroom\src\loginhistory.json"

# Check if the file exists and its size
if (Test-Path $filePath -and (Get-Item $filePath).Length -eq 0) {
   # Delete the file if its size is zero
   Remove-Item $filePath -Force
}

# Initialize the variable to hold existing content
$existingContent = @()

# Check if the file exists
if (Test-Path $filePath) {
   # Read existing JSON file content
   $existingContent = Get-Content -Path $filePath -Raw

   # Trim whitespace from the beginning and end of the existing content
   $existingContent = $existingContent.Trim()

   # Check if existing content is empty or not
   if ($existingContent -ne "") {
       # Remove the leading and trailing square brackets if they exist
       if ($existingContent[0] -eq "[" -and $existingContent[-1] -eq "]") {
           $existingContent = $existingContent.Substring(1, $existingContent.Length - 2)
       }
       
       # Add a comma separator if existing content is not empty
       $existingContent += ","
   }
}

# If there's existing content, add it along with the new entry
if ($existingContent) {
   $newContent = "[" + $existingContent + $newJsonData + "]"
} else {
   # If no existing content, write the new entry without enclosing brackets
   $newContent = $newJsonData
}

# Write the updated JSON data to the file
$newContent | Out-File -FilePath $filePath