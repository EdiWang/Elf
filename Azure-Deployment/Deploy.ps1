# ---------------------------------------------------------------------------------------------------------
# Quick Start deployment script for running Elf on Microsoft Azure
# Author: Edi Wang
# ---------------------------------------------------------------------------------------------------------
# You need to install Azure CLI and login to Azure (run 'az login') before running this script.
# To install Azure CLI, please run:
# Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
# Reference: https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest

param(
    $subscriptionName = "Microsoft MVP", 
    $regionName = "East Asia", 
    [bool] $useLinuxPlanWithDocker = 1
)

# Start script
$rndNumber = Get-Random -Minimum 100 -Maximum 999
$rsgName = "elfgroup$rndNumber"
$webAppName = "elfweb$rndNumber"
$aspName = "elfplan$rndNumber"
$sqlServerName = "elfsqlsvr$rndNumber"
$sqlServerUsername = "elf"
$sqlDatabaseName = "elfdb$rndNumber"

function Get-RandomCharacters($length, $characters) {
    $random = 1..$length | ForEach-Object { Get-Random -Maximum $characters.length }
    $private:ofs=""
    return [String]$characters[$random]
}
 
function Scramble-String([string]$inputString){     
    $characterArray = $inputString.ToCharArray()   
    $scrambledStringArray = $characterArray | Get-Random -Count $characterArray.Length     
    $outputString = -join $scrambledStringArray
    return $outputString 
}

$password = Get-RandomCharacters -length 4 -characters 'abcdefghiklmnoprstuvwxyz'
$password += Get-RandomCharacters -length 1 -characters 'ABCDEFGHKLMNOPRSTUVWXYZ'
$password += Get-RandomCharacters -length 2 -characters '1234567890'
$password += Get-RandomCharacters -length 1 -characters '!$%&@#'
$password = Scramble-String $password

$sqlServerPassword = "e$password"

function Check-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

if (Check-Command -cmdname 'az') {
    Write-Host "Azure CLI is found..."
}
else {
    Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
    Write-Host "Please run 'az-login' and re-execute this script"
    return
}

# Confirmation
Clear-Host
Write-Host "Your Elf will be deployed to [$rsgName] in [$regionName] under Azure subscription [$subscriptionName]. Please confirm before continue." -ForegroundColor Green
if ($useLinuxPlanWithDocker) {
    Write-Host "+ Linux App Service Plan with Docker" -ForegroundColor Cyan
}

Read-Host -Prompt "Press [ENTER] to continue, [CTRL + C] to cancel"

# Select Subscription
$echo = az account set --subscription $subscriptionName
Write-Host "Selected Azure Subscription: " $subscriptionName -ForegroundColor Cyan

# Resource Group
Write-Host "Preparing Resource Group" -ForegroundColor Green
$rsgExists = az group exists -n $rsgName
if ($rsgExists -eq 'false') {
    Write-Host "Creating Resource Group..."
    $echo = az group create -l $regionName -n $rsgName
}

# App Service Plan
Write-Host ""
Write-Host "Preparing App Service Plan" -ForegroundColor Green
$planCheck = az appservice plan list --query "[?name=='$aspName']" | ConvertFrom-Json
$planExists = $planCheck.Length -gt 0
if (!$planExists) {
    Write-Host "Creating App Service Plan..."
    if ($useLinuxPlanWithDocker){
        $echo = az appservice plan create -n $aspName -g $rsgName --is-linux --sku S1 --location $regionName
    }
    else {
        $echo = az appservice plan create -n $aspName -g $rsgName --sku S1 --location $regionName
    }
}

# Web App
Write-Host ""
Write-Host "Preparing Web App..." -ForegroundColor Green
$appCheck = az webapp list --query "[?name=='$webAppName']" | ConvertFrom-Json
$appExists = $appCheck.Length -gt 0
if (!$appExists) {
    Write-Host "Creating Web App"
    if ($useLinuxPlanWithDocker) {
        Write-Host "Using Linux Plan with Docker image from 'ediwang/elf', this deployment will be ready to run."
        $echo = az webapp create -g $rsgName -p $aspName -n $webAppName --deployment-container-image-name ediwang/elf
    }
    else {
        Write-Host "Using Windows Plan with deployment from GitHub source code."
        $echo = az webapp create -g $rsgName -p $aspName -n $webAppName --runtime "DOTNET |5.0"
    }
    $echo = az webapp config set -g $rsgName -n $webAppName --always-on true --use-32bit-worker-process false --http20-enabled true 
}

$createdApp = az webapp list --query "[?name=='$webAppName']" | ConvertFrom-Json
$createdExists = $createdApp.Length -gt 0
if ($createdExists) {
    $webAppUrl = "https://" + $createdApp.defaultHostName
    Write-Host "Web App URL: $webAppUrl"
}

# Azure SQL
Write-Host ""
Write-Host "Preparing Azure SQL" -ForegroundColor Green
$sqlServerCheck = az sql server list --query "[?name=='$sqlServerName']" | ConvertFrom-Json
$sqlServerExists = $sqlServerCheck.Length -gt 0
if (!$sqlServerExists) {
    Write-Host "Creating SQL Server..."
    $echo = az sql server create --name $sqlServerName --resource-group $rsgName --location $regionName --admin-user $sqlServerUsername --admin-password $sqlServerPassword

    Write-Host "Setting Firewall to Allow Azure Connection"
    # When both starting IP and end IP are set to 0.0.0.0, the firewall is only opened for other Azure resources.
    $echo = az sql server firewall-rule create --resource-group $rsgName --server $sqlServerName --name AllowAllIps --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
}

$sqlDbCheck = az sql db list --resource-group $rsgName --server $sqlServerName --query "[?name=='$sqlDatabaseName']" | ConvertFrom-Json
$sqlDbExists = $sqlDbCheck.Length -gt 0
if (!$sqlDbExists) {
    Write-Host "Creating SQL Database"
    $echo = az sql db create --resource-group $rsgName --server $sqlServerName --name $sqlDatabaseName --service-objective S0 --backup-storage-redundancy Local
    Write-Host "SQL Server Password: $sqlServerPassword" -ForegroundColor Yellow
}

# Configuration Update
Write-Host ""
Write-Host "Updating Configuration" -ForegroundColor Green

Write-Host "Setting SQL Database Connection String"
$sqlConnStrTemplate = az sql db show-connection-string -s $sqlServerName -n $sqlDatabaseName -c ado.net --auth-type SqlPassword
$sqlConnStr = $sqlConnStrTemplate.Replace("<username>", $sqlServerUsername).Replace("<password>", $sqlServerPassword)
$echo = az webapp config connection-string set -g $rsgName -n $webAppName -t SQLAzure --settings ElfDatabase=$sqlConnStr

if (!$useLinuxPlanWithDocker){
    Write-Host "Pulling source code and run build on Azure (this takes time, please wait)..."
    $echo = az webapp deployment source config --branch master --manual-integration --name $webAppName --repo-url https://github.com/EdiWang/Elf --resource-group $rsgName
}

Read-Host -Prompt "Setup is done, you should be able to run Elf on '$webAppUrl' now, press [ENTER] to exit."