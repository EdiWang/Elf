# ---------------------------------------------------------------------------------------------------------
# Quick Start deployment script for running Elf on Microsoft Azure
# Author: Edi Wang
# ---------------------------------------------------------------------------------------------------------
# You need to install Azure CLI and login to Azure (run 'az login') before running this script.
# To install Azure CLI, please run:
# Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
# Reference: https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest
param(
    $regionName = "East Asia", 
    [bool] $useLinuxPlanWithDocker = 1
)

function Get-UrlStatusCode([string] $Url) {
    try {
        [System.Net.WebRequest]::Create($Url).GetResponse().StatusCode
    }
    catch [Net.WebException] {
        [int]$_.Exception.Response.StatusCode
    }
}

function Get-RandomCharacters($length, $characters) {
    $random = 1..$length | ForEach-Object { Get-Random -Maximum $characters.length }
    $private:ofs = ""
    return [String]$characters[$random]
}

function Scramble-String([string]$inputString) {     
    $characterArray = $inputString.ToCharArray()   
    $scrambledStringArray = $characterArray | Get-Random -Count $characterArray.Length     
    $outputString = -join $scrambledStringArray
    return $outputString 
}

# Subscription selection
$output = az account show -o json | ConvertFrom-Json
$subscriptionList = az account list -o json | ConvertFrom-Json 
$subscriptionList | Format-Table name, id, tenantId -AutoSize
$selectedSubscription = $output.name
Write-Host "Currently logged in to subscription """$output.name.Trim()""" in tenant " $output.tenantId
$selectedSubscription = Read-Host "Enter subscription Id ("$output.id")"
$selectedSubscription = $selectedSubscription.Trim()
if ([string]::IsNullOrWhiteSpace($selectedSubscription)) {
    $selectedSubscription = $output.id
}
else {
    az account set --subscription $selectedSubscription
    Write-Host "Changed to subscription ("$selectedSubscription")"
}

# Web App name validation
while ($true) {
    $webAppName = Read-Host -Prompt "Enter webapp name"
    $webAppName = $webAppName.Trim()
    if ($webAppName.ToLower() -match "xbox|windows|login|microsoft") {
        Write-Host "Webapp name cannot have keywords xbox,windows,login,microsoft"
        continue
    }
    $HTTP_Status = Get-UrlStatusCode('http://' + $webAppName + '.azurewebsites.net')
    if ($HTTP_Status -eq 0) {
        break
    }
    else {
        Write-Host "Webapp name taken"
    }
}

# Generate resource names and password
$rndNumber = Get-Random -Minimum 100 -Maximum 999
$suffix = "$rndNumber"
$rsgName = "elfgroup$suffix"

$password = Get-RandomCharacters -length 4 -characters 'abcdefghiklmnoprstuvwxyz'
$password += Get-RandomCharacters -length 1 -characters 'ABCDEFGHKLMNOPRSTUVWXYZ'
$password += Get-RandomCharacters -length 2 -characters '1234567890'
$password += Get-RandomCharacters -length 1 -characters '!$%&@#'
$password = Scramble-String $password

$sqlServerPassword = "e$password"

# Confirmation
Clear-Host
Write-Host "Your Elf API will be deployed to [$rsgName] in [$regionName] under Azure subscription [$selectedSubscription]. Please confirm before continue." -ForegroundColor Green
if ($useLinuxPlanWithDocker) {
    Write-Host "+ Linux App Service Plan with Docker" -ForegroundColor Cyan
}

Read-Host -Prompt "Press [ENTER] to continue, [CTRL + C] to cancel"

# Select Subscription
Write-Host "Selected Azure Subscription: " $selectedSubscription -ForegroundColor Cyan

# Resource Group
Write-Host "Preparing Resource Group" -ForegroundColor Green
$rsgExists = az group exists -n $rsgName
if ($rsgExists -eq 'false') {
    Write-Host "Creating Resource Group..."
    az group create -l $regionName -n $rsgName | Out-Null
}

# Write Bicep parameters to temp file
$tempParamFile = [System.IO.Path]::GetTempFileName() + ".json"
@{
    "$schema"        = "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#"
    "contentVersion" = "1.0.0.0"
    "parameters"     = @{
        "location"               = @{ "value" = $regionName }
        "webAppName"             = @{ "value" = $webAppName }
        "useLinuxPlanWithDocker" = @{ "value" = [bool]$useLinuxPlanWithDocker }
        "suffix"                 = @{ "value" = $suffix }
        "sqlServerPassword"      = @{ "value" = $sqlServerPassword }
    }
} | ConvertTo-Json -Depth 10 | Set-Content -Path $tempParamFile

# Deploy Bicep
Write-Host "Deploying infrastructure with Bicep..." -ForegroundColor Green
az deployment group create `
    --resource-group $rsgName `
    --template-file ./elf.bicep `
    --parameters @$tempParamFile `
    --query "properties.outputs.webAppUrl.value" `
    --output tsv

# Clean up temp param file
Remove-Item $tempParamFile

# Retrieve web app URL
$webAppUrl = "https://$webAppName.azurewebsites.net"
Write-Host "Api URL: $webAppUrl"

if (!$useLinuxPlanWithDocker) {
    Write-Host "Configuring deployment from GitHub source code..." -ForegroundColor Yellow
    az webapp deployment source config `
        --branch master `
        --manual-integration `
        --name $webAppName `
        --repo-url https://github.com/EdiWang/Elf `
        --resource-group $rsgName | Out-Null
}

# Azure AD
Write-Host ""
Write-Host "Creating Azure AD Application Registration..." -ForegroundColor Green
$clientid = $(az ad app create --display-name $webAppName --query appId --output tsv)
#$objectid=$(az ad app show --id $clientid --query objectId --output tsv)

Write-Host "Removing default API scope..."
$default_scope = (az ad app show --id $clientid | ConvertFrom-Json).oauth2Permissions
$default_scope[0].isEnabled = 'false'
$default_scope_new = ConvertTo-Json -InputObject @($default_scope)
$default_scope_new | Out-File -FilePath .\oauth2Permissionsold.json
az ad app update --id $clientid --set oauth2Permissions=@oauth2Permissionsold.json
Remove-Item oauth2Permissionsold.json
Write-Host "NOTE: You need to manually expose API with name access_as_user and set accessTokenAcceptedVersion to 2, please refer to Readme of https://github.com/EdiWang/Elf"

Write-Host "Updating Configuration for AAD" -ForegroundColor Green
if ($useLinuxPlanWithDocker) {
    az webapp config appsettings set -g $rsgName -n $webAppName --settings AzureAd__ClientId=$clientid | Out-Null
}
else {
    az webapp config appsettings set -g $rsgName -n $webAppName --settings AzureAd:ClientId=$clientid | Out-Null
}

Write-Host "NOTE: You need to manually set domain and tenantId with the AAD application, please refer to Readme of https://github.com/EdiWang/Elf"

Read-Host -Prompt "Setup is done, you should be able to run Elf API on '$webAppUrl' now, press [ENTER] to exit."