@description('Location for all resources')
param location string = 'East Asia'

@description('Web App name - must be globally unique')
param webAppName string

@description('Deploy Linux App Service Plan with Docker?')
param useLinuxPlanWithDocker bool = true

@description('Random suffix for resource names')
param suffix string

@description('SQL Server admin password')
@secure()
param sqlServerPassword string

// Resource Names
var rsgName = 'elfgroup${suffix}'
var aspName = 'elfplan${suffix}'
var sqlServerName = 'elfsqlsvr${suffix}'
var sqlServerUsername = 'elf'
var sqlDatabaseName = 'elfdb${suffix}'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: aspName
  location: location
  sku: {
    name: 'S1'
    tier: 'Standard'
  }
  kind: useLinuxPlanWithDocker ? 'linux' : ''
  properties: useLinuxPlanWithDocker
    ? {
        reserved: true
      }
    : {}
}

// Web App
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: webAppName
  location: location
  kind: useLinuxPlanWithDocker ? 'app,linux' : 'app'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: useLinuxPlanWithDocker
      ? {
          linuxFxVersion: 'DOCKER|ediwang/elf'
          alwaysOn: true
          http20Enabled: true
          use32BitWorkerProcess: false
        }
      : {
          netFrameworkVersion: 'v8.0'
          alwaysOn: true
          http20Enabled: true
          use32BitWorkerProcess: false
        }
    httpsOnly: true
  }
}

// Azure SQL Server
resource sqlServer 'Microsoft.Sql/servers@2022-02-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlServerUsername
    administratorLoginPassword: sqlServerPassword
    version: '12.0'
  }
}

// Allow Azure services to access SQL server
resource sqlFirewallRule 'Microsoft.Sql/servers/firewallRules@2022-02-01-preview' = {
  name: 'AllowAllIps'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Azure SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-02-01-preview' = {
  name: '${sqlServer.name}/${sqlDatabaseName}'
  location: location
  sku: {
    name: 'S0'
    tier: 'Standard'
  }
  properties: {
    backupStorageRedundancy: 'Local'
  }
}

// Set connection string for Web App
resource webAppConnStr 'Microsoft.Web/sites/config@2022-03-01' = {
  name: '${webApp.name}/connectionstrings'
  properties: {
    ElfDatabase: {
      type: 'SQLAzure'
      value: 'Server=tcp:${sqlServerName}.database.windows.net,1433;Initial Catalog=${sqlDatabaseName};Persist Security Info=False;User ID=${sqlServerUsername};Password=${sqlServerPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
    }
  }
  dependsOn: [
    webApp
    sqlDatabase
  ]
}

output webAppUrl string = 'https://${webAppName}.azurewebsites.net'
