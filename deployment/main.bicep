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
  'OpenIdConnect'
  'External'
])
@description('Admin authentication provider. Local uses the built-in local account + TOTP flow. OpenIdConnect uses a standards-based in-app OIDC client. External leaves Admin protection to a reverse proxy or hosting layer.')
param adminAuthenticationProvider string = 'Local'

@description('Admin local account bootstrap username. Used only when Authentication Provider is Local and no LocalAccount exists in ElfConfiguration.')
param adminLocalBootstrapUsername string = 'admin'

@secure()
@description('Admin local account bootstrap password. Used only to initialize the first LocalAccount. Clear this app setting after first sign-in if desired.')
param adminLocalBootstrapPassword string = ''

@description('TOTP issuer name displayed by authenticator apps for the Admin local account.')
param adminTotpIssuer string = 'Elf'

@description('HTTPS discovery authority for the Admin OpenID Connect provider.')
param adminOidcAuthority string = ''

@description('OpenID Connect confidential web client ID for Admin.')
param adminOidcClientId string = ''

@secure()
@description('OpenID Connect confidential web client secret for Admin.')
param adminOidcClientSecret string = ''

@description('OpenID Connect sign-in callback path for Admin.')
param adminOidcCallbackPath string = '/signin-oidc'

@description('OpenID Connect signed-out callback path for Admin.')
param adminOidcSignedOutCallbackPath string = '/signout-callback-oidc'

@description('OIDC claim used as the display name for the signed-in Admin user.')
param adminOidcNameClaimType string = 'name'

@description('OIDC scopes requested during Admin sign-in. Must include openid.')
param adminOidcScopes array = [
  'openid'
  'profile'
  'email'
]

@description('Exact OIDC subject identifiers allowed to administer Elf. Empty denies all OIDC users until an administrator is bootstrapped through /auth/identity.')
param adminOidcAllowedSubjects array = []

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
  Authentication__OpenIdConnect__Authority: adminOidcAuthority
  Authentication__OpenIdConnect__ClientId: adminOidcClientId
  Authentication__OpenIdConnect__ClientSecret: adminOidcClientSecret
  Authentication__OpenIdConnect__CallbackPath: adminOidcCallbackPath
  Authentication__OpenIdConnect__SignedOutCallbackPath: adminOidcSignedOutCallbackPath
  Authentication__OpenIdConnect__NameClaimType: adminOidcNameClaimType
}

var adminOidcScopeSettings = reduce(range(0, length(adminOidcScopes)), {}, (settings, index) => union(settings, {
  'Authentication__OpenIdConnect__Scopes__${index}': adminOidcScopes[index]
}))

var adminOidcAllowedSubjectSettings = reduce(range(0, length(adminOidcAllowedSubjects)), {}, (settings, index) => union(settings, {
  'Authentication__OpenIdConnect__AllowedSubjects__${index}': adminOidcAllowedSubjects[index]
}))

var combinedAdminAppSettings = union(
  adminBaseAppSettings,
  adminOidcScopeSettings,
  adminOidcAllowedSubjectSettings
)

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
  properties: combinedAdminAppSettings
}

output forwarderAppUrl string = forwarderApp.properties.defaultHostName
output adminAppUrl string = adminApp.properties.defaultHostName
output sqlServerName string = sqlServer.name
output sqlDbName string = sqlDatabase.name
