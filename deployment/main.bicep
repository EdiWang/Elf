@description('Forwarder API Name')
param forwarderApiName string = 'elf-forwarder-${uniqueString(resourceGroup().id)}'

@description('SQL Server administrator username')
param sqlAdminUsername string = 'elf'

@secure()
@description('SQL Server administrator password')
param sqlAdminPassword string

@description('SQL Server Name')
param sqlServerName string = 'elf-sql-${uniqueString(resourceGroup().id)}'

@description('SQL Database Name')
param sqlDbName string = 'elfdb'

@description('Service region')
param location string = resourceGroup().location

// Create App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: 'elf-plan-${uniqueString(resourceGroup().id)}'
  location: location
  kind: 'app,linux,container'
  properties: {
    reserved: true
  }
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
      linuxFxVersion: 'DOCKER|ediwang/elf:latest'
      acrUseManagedIdentityCreds: false
      alwaysOn: true
      http20Enabled: true
      ftpsState: 'Disabled'
    }
    clientAffinityEnabled: false
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
resource sqlServer 'Microsoft.Sql/servers@2024-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminUsername
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    restrictOutboundNetworkAccess: 'Disabled'
  }
}

// Create SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-02-01-preview' = {
  parent: sqlServer
  name: sqlDbName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
    capacity: 10
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 1073741824
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: false
    readScale: 'Disabled'
    requestedBackupStorageRedundancy: 'Geo'
    isLedgerOn: false
  }
}

// Allow Azure Services to access SQL Server (firewall rule)
resource allowAzureServices 'Microsoft.Sql/servers/firewallRules@2024-11-01-preview' = {
  name: 'AllowAzureServices'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Build database connection string
var connectionString = 'Server=tcp:${sqlServer.name}.database.windows.net,1433;Initial Catalog=${sqlDatabase.name};Persist Security Info=False;User ID=${sqlAdminUsername};Password=${sqlAdminPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'

// Add the connection string to the Web App's application settings
resource webAppConnectionString 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: webApp
  name: 'connectionstrings'
  properties: {
    ElfDatabase: {
      value: connectionString
      type: 'SQLAzure'
    }
  }
}

output webAppUrl string = webApp.properties.defaultHostName
output sqlServerName string = sqlServer.name
output sqlDbName string = sqlDatabase.name
