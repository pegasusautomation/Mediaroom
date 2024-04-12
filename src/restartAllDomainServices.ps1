param (
    [string]$computerName  # Accept the computer name as a parameter
)

# Check if the computer name is provided
if (-not $computerName) {
    Write-Host "Error: Computer name not provided."
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
$scriptBlock = {
    Start-Process -FilePath "C:\Program Files\Microsoft IPTV Services\InstallTools\AdminService.exe" -ArgumentList "/action=Restart" -Wait -NoNewWindow
}

Invoke-Command -ComputerName $computerName -Credential $credential -ScriptBlock $scriptBlock

# $jsonpath = "C:\Mediaroom\src\manageserver\mrserverdata.json"
# $json = Get-Content -Path $jsonpath -Raw

# # Convert JSON to PowerShell objects
# $data = $json | ConvertFrom-Json

# # Find the entry for the computer "MSPBR5DSERV103"
# $computerEntry = $data | Where-Object { $_.ComputerName -eq $computerName }

# # Update the status of the "IptvDeliveryAgent" service to the retrieved status
# $computerEntry.ServiceStatus | Where-Object { $_.Name -eq $ServiceName } | ForEach-Object { $_.Status = $service1.Status }

# # Convert PowerShell objects back to JSON
# $jsonUpdated = $data | ConvertTo-Json -Depth 100

# # Output the updated JSON for debugging
# Write-Host "Updated JSON:"
# $jsonUpdated

# # Write the JSON data to a file
# $jsonUpdated | Out-File -FilePath $jsonpath -Encoding UTF8
# Write-Host "JSON file created: $jsonUpdated"

# # Receive data dynamically (you can replace this with your actual data source)
# $currentDate = Get-Date 
# $receivedData = @{
#    "Timelog" = $currentDate.ToString("yyyy-MM-dd HH:mm:ss")
#                     "User" = $username
#                     "Machine" = $computerName
#                     "Service" = $ServiceName
#                     "Action" = "Stopped"
# }

# # Convert the received data to JSON format
# $newJsonData = $receivedData | ConvertTo-Json -Depth 100

# # Set the file path
# $filePath = "C:\Mediaroom\src\loginhistory.json"

# # Check if the file exists and its size
# if (Test-Path $filePath -and (Get-Item $filePath).Length -eq 0) {
#     # Delete the file if its size is zero
#     Remove-Item $filePath -Force
# }

# # Initialize the variable to hold existing content
# $existingContent = @()

# # Check if the file exists
# if (Test-Path $filePath) {
#     # Read existing JSON file content
#     $existingContent = Get-Content -Path $filePath -Raw

#     # Trim whitespace from the beginning and end of the existing content
#     $existingContent = $existingContent.Trim()
    
#     # Check if existing content is empty or not
#     if ($existingContent -ne "") {
#         # Remove the leading and trailing square brackets if they exist
#         if ($existingContent[0] -eq "[" -and $existingContent[-1] -eq "]") {
#             $existingContent = $existingContent.Substring(1, $existingContent.Length - 2)
#         }
#         # Add a comma separator if existing content is not empty
#         $existingContent += ","
#     }
# }

# # Combine existing content with new data and square brackets
# $newContent = "[" + $existingContent + $newJsonData + "]"

# # Write the updated JSON data to the file
# $newContent | Out-File -FilePath $filePath