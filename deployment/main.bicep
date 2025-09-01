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
resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: 'elf-plan'
  location: location
  kind: 'linux'
  sku: {
    name: 'P0v3'
    tier: 'Premium0V3'
    size: 'P0v3'
    family: 'Pv3'
    capacity: 1
  }
}

// Create Forwarder API Web App
resource webApp 'Microsoft.Web/sites@2024-11-01' = {
  name: forwarderApiName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      numberOfWorkers: 1
      linuxFxVersion: 'DOCKER|ediwang/elf:latest'
      acrUseManagedIdentityCreds: false
      alwaysOn: true
      http20Enabled: true
      functionAppScaleLimit: 0
      minimumElasticInstanceCount: 1
    }
    httpsOnly: true
    ipMode: 'IPv4AndIPv6'
    containerSize: 0
    dailyMemoryTimeQuota: 0
    endToEndEncryptionEnabled: false
    redundancyMode: 'None'
    publicNetworkAccess: 'Enabled'
    sshEnabled: true
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
