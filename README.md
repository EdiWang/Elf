# Link Forwarder (Preview)

[![Build status](https://dev.azure.com/ediwang/EdiWang-GitHub-Builds/_apis/build/status/LinkForwarder-CI)](https://dev.azure.com/ediwang/EdiWang-GitHub-Builds/_build/latest?definitionId=57)

The link forward service used by https://go.edi.wang. 

Generate static URLs for redirecting third party URLs. It's similar to, but NOT a URL shorter. 

> E.g.: Make "https://www.somewebsite.com/a-very-long-and-complicated-link-that-can-also-change?with=parameters" into "https://yourdomain/fw/token".

Main purposes:

- Use a static token to adapt changes to origin url.
- Track user click by User-Agent and IP Address.

## Features

Forward Link, Create/Manage/Share Link, View Report

![image](https://raw.githubusercontent.com/EdiWang/LinkForwarder/master/docs/images/sc-report.png)

![image](https://raw.githubusercontent.com/EdiWang/LinkForwarder/master/docs/images/sc-manage-link.png)

![image](https://raw.githubusercontent.com/EdiWang/LinkForwarder/master/docs/images/sc-edit-link.png)

![image](https://raw.githubusercontent.com/EdiWang/LinkForwarder/master/docs/images/sc-share-link.png)

## Forward Logic

![image](https://raw.githubusercontent.com/EdiWang/LinkForwarder/master/docs/images/LinkForwarder-FW.png)

## Build and Run

> The following tools are required for development.

Tools | Alternative
--- | ---
[.NET Core 2.2 SDK](http://dot.net) | N/A
[Visual Studio 2019](https://visualstudio.microsoft.com/) | [Visual Studio Code](https://code.visualstudio.com/)
[Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) | [SQL Server 2017](https://www.microsoft.com/en-us/sql-server/sql-server-2017) / LocalDB (Dev Only)


### Setup Database

#### 1. Create Database 

##### For Development (Light Weight, Recommended for Windows)

Create an [SQL Server 2017 LocalDB](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-2017) database. e.g. linkforwarder-dev

##### For Production

[Create an Azure SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-single-database-get-started) or a SQL Server 2017+ database. e.g. linkforwarder-dev

#### 2. Set Connection String

Update the connection string "**LinkForwarderDatabase**" in **appsettings.[env].json** according to your database configuration.

Example:
```json
"ConnectionStrings": {
  "LinkForwarderDatabase": "Server=(localdb)\\MSSQLLocalDB;Database=linkforwarder-dev;Trusted_Connection=True;"
}
```

### Build Source

1. Create an "**appsettings.Development.json**" under "**src\\LinkForwarder**", this file defines development time settings like db connections. It is by default ignored by git, so you will need to manange it on your own.

2. Build and run **LinkForwarder.sln**

## Configuration

> Below section discuss system settings in **appsettings.[env].json**. 

### Authentication

Configure how to sign in to admin portal.

#### Preferred: [Azure Active Directory]((https://azure.microsoft.com/en-us/services/active-directory/))

Register an App in **Azure Active Directory**
- Set Redirection URI to **"https://yourdomain/signin-oidc"**
  - For local debugging, set URL to https://localhost:5001/signin-oidc
- Copy "**appId**" to set as **AzureAd:ClientId** in **appsettings.[env].json** file

```json
"Authentication": {
  "Provider": "AzureAD",
  "AzureAd": {
    "Domain": "{YOUR-VALUE}",
    "TenantId": "{YOUR-VALUE}",
    "ClientId": "{YOUR-VALUE}",
  }
}
```

#### Alternative: Local Account

Set **Authentication:Provider** to **"Local"** and assign a pair of username and password. 

*Currently password is not encrypted, use it at your own risk.*

```json
"Authentication": {
  "Provider": "Local",
  "Local": {
    "Username": "{YOUR-VALUE}",
    "Password": "{YOUR-VALUE}",
  }
}
```