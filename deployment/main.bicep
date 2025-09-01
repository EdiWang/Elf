@description('Forwarder API Name')
param forwarderApiName string = 'elf-forwarder-${uniqueString(resourceGroup().id)}'

@description('SQL Server administrator username')
param sqlAdminUsername string = 'elfadmin'

@secure()
@description('SQL Server administrator password')
param sqlAdminPassword string

@description('SQL Server Name')
param sqlServerName string = 'sqlserver${uniqueString(resourceGroup().id)}'

@description('SQL Database Name')
param sqlDbName string = 'elfdb'

@description('Service region')
param location string = resourceGroup().location

// Create App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: 'elf-plan'
  location: location
  sku: {
    name: 'S1'
    tier: 'Standard'
    capacity: 1
  }
}

// Create Forwarder API Web App
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: forwarderApiName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        // Connection string to be added later
      ]
    }
  }
}

// Create SQL Server
resource sqlServer 'Microsoft.Sql/servers@2022-02-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminUsername
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
  }
}
