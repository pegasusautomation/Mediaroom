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
} else {
    # Get service name based on computer name
    $username = "MSPBE5\Raghavendra.Gandanah"
}

$password = 'Password1!' | ConvertTo-SecureString -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $password)

# Invoke-Command to stop the service on the remote computer
Invoke-Command -ComputerName $computerName -Credential $credential -ScriptBlock {
    param($serviceName)
    Stop-Service -Name $serviceName
} -ArgumentList $ServiceName
