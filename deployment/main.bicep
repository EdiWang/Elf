@description('Forwarder API Name')
param forwarderApiName string = 'elf-forwarder-${uniqueString(resourceGroup().id)}'

@description('Admin UI Name')
param adminUiName string = 'elf-admin-${uniqueString(resourceGroup().id)}'

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

@allowed([
  'Local'
  'EntraID'
  'External'
])
@description('Admin authentication provider. Local uses the built-in local account + TOTP flow. EntraID uses in-app OpenID Connect. External leaves Admin protection to a reverse proxy or hosting layer.')
param adminAuthenticationProvider string = 'Local'

@description('Admin local account bootstrap username. Used only when Authentication Provider is Local and no LocalAccount exists in ElfConfiguration.')
param adminLocalBootstrapUsername string = 'admin'

@secure()
@description('Admin local account bootstrap password. Used only to initialize the first LocalAccount. Clear this app setting after first sign-in if desired.')
param adminLocalBootstrapPassword string = ''

@description('TOTP issuer name displayed by authenticator apps for the Admin local account.')
param adminTotpIssuer string = 'Elf'

@description('Microsoft Entra ID authority instance for Admin in-app OpenID Connect.')
param adminEntraInstance string = environment().authentication.loginEndpoint

@description('Microsoft Entra ID tenant ID for Admin in-app OpenID Connect. Use a tenant ID or common.')
param adminEntraTenantId string = ''

@description('Microsoft Entra ID application client ID for Admin in-app OpenID Connect.')
param adminEntraClientId string = ''

@secure()
@description('Microsoft Entra ID application client secret for Admin in-app OpenID Connect.')
param adminEntraClientSecret string = ''

@description('Microsoft Entra ID redirect callback path for Admin in-app OpenID Connect.')
param adminEntraCallbackPath string = '/signin-oidc'

@description('Optional list of allowed Entra users for Admin. Values are matched against name, email, UPN, or preferred_username claims. Empty allows any authenticated tenant user.')
param adminEntraAllowedUsers array = []

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
resource forwarderApp 'Microsoft.Web/sites@2024-11-01' = {
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

// Create Admin UI Web App
resource adminApp 'Microsoft.Web/sites@2024-11-01' = {
  name: adminUiName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|ediwang/elf-admin:latest'
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
var connectionString = 'Server=tcp:${sqlServer.name}.${environment().suffixes.sqlServerHostname},1433;Initial Catalog=${sqlDatabase.name};Persist Security Info=False;User ID=${sqlAdminUsername};Password=${sqlAdminPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'

var adminBaseAppSettings = {
  ForwarderBaseUrl: 'https://${forwarderApp.properties.defaultHostName}'
  Authentication__Provider: adminAuthenticationProvider
  Authentication__Local__BootstrapUsername: adminLocalBootstrapUsername
  Authentication__Local__BootstrapPassword: adminLocalBootstrapPassword
  Authentication__Totp__Issuer: adminTotpIssuer
  Authentication__EntraID__Instance: adminEntraInstance
  Authentication__EntraID__TenantId: adminEntraTenantId
  Authentication__EntraID__ClientId: adminEntraClientId
  Authentication__EntraID__ClientSecret: adminEntraClientSecret
  Authentication__EntraID__CallbackPath: adminEntraCallbackPath
  Authentication__EntraID__AllowedUsers__0: length(adminEntraAllowedUsers) > 0 ? adminEntraAllowedUsers[0] : ''
  Authentication__EntraID__AllowedUsers__1: length(adminEntraAllowedUsers) > 1 ? adminEntraAllowedUsers[1] : ''
  Authentication__EntraID__AllowedUsers__2: length(adminEntraAllowedUsers) > 2 ? adminEntraAllowedUsers[2] : ''
  Authentication__EntraID__AllowedUsers__3: length(adminEntraAllowedUsers) > 3 ? adminEntraAllowedUsers[3] : ''
  Authentication__EntraID__AllowedUsers__4: length(adminEntraAllowedUsers) > 4 ? adminEntraAllowedUsers[4] : ''
}

// Add the connection string to the Web App's application settings
resource forwarderConnectionString 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: forwarderApp
  name: 'connectionstrings'
  properties: {
    ElfDatabase: {
      value: connectionString
      type: 'SQLAzure'
    }
  }
}

resource adminConnectionString 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: adminApp
  name: 'connectionstrings'
  properties: {
    ElfDatabase: {
      value: connectionString
      type: 'SQLAzure'
    }
  }
}

resource adminAppSettings 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: adminApp
  name: 'appsettings'
  properties: adminBaseAppSettings
}

output forwarderAppUrl string = forwarderApp.properties.defaultHostName
output adminAppUrl string = adminApp.properties.defaultHostName
output sqlServerName string = sqlServer.name
output sqlDbName string = sqlDatabase.name
