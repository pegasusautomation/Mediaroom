# Get the current time
$currentTime = Get-Date -Format "HH:mm:ss"

# Specify the path of the text file
$filePath = "C:\Automation Details\servicename.txt"

# Write the current time to the text file
$currentTime | Out-File -FilePath $filePath