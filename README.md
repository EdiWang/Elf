# Elf

The link forward service used by https://go.edi.wang. It generates static URLs for redirecting third party URLs. It's similar to, but **NOT a URL shorter**. 

- Use a static token to adapt changes to origin url.
- Track user click to generate report. (Only if DNT isn't enabled)

e.g.:

Raw URL:
```
https://www.somewebsite.com/a-very-long-and-complicated-link-that-can-also-change?with=parameters
```

will be translate to `https://yourdomain/fw/token` or `https://yourdomain/aka/name`

## Features

Forward Link, Create/Manage/Share Link, View Report.

![list](https://user-images.githubusercontent.com/3304703/211265875-6b106ab4-656f-4b2d-b215-61d8dee82f34.png)
![report](https://user-images.githubusercontent.com/3304703/164459162-74c9ad15-85a6-4015-a0f7-55f6ef8c4dcd.png)
![share](https://user-images.githubusercontent.com/3304703/164199595-4b746a3c-0cd2-412e-bfb5-7cb86acc95df.png)

## Forward Logic

![image](https://ediwang.cdn.moonglade.blog/web-assets/lf/LinkForwarder-FW.png)

## Docker Deployment

https://hub.docker.com/r/ediwang/elf

You can also follow the next section to build and run the project yourself.

## Build and Run API

Tools | Alternative
--- | ---
[.NET 7 SDK](http://dot.net) | N/A
[Visual Studio 2022](https://visualstudio.microsoft.com/) | [Visual Studio Code](https://code.visualstudio.com/)
[Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) | [SQL Server 2022](https://www.microsoft.com/en-us/sql-server/sql-server-2022) / LocalDB (Dev Only)

For a quick Azure deployment, you can use the automation script ```Azure-Deployment\Deploy.ps1``` to setup a ready-to-run Elf in a couple of minutes. (Azure CLI is required to run the script)

### Setup Database

[Create an Azure SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-single-database-get-started?WT.mc_id=AZ-MVP-5002809) or a SQL Server 2019+ database. e.g. elf

Update the connection string "**ElfDatabase**" in **appsettings.[env].json**

```json
"ConnectionStrings": {
  "ElfDatabase": "Server=(localdb)\\MSSQLLocalDB;Database=elf;Trusted_Connection=True;"
}
```
### Build Source

Build and run `./src/API/Elf.sln`

### Authentication

Register an App in **[Azure Active Directory]((https://azure.microsoft.com/en-us/services/active-directory/))**
- Set an **Application ID URI** as unique for this app
- Expose an API with name `access_as_user` and with **Admins and users** type
- Change `accessTokenAcceptedVersion` to `2` in Manifest blade
- Copy "**appId**" to set as **AzureAd:ClientId** in **appsettings.json** file

```json
"AzureAd": {
  "Domain": "{YOUR-VALUE}",
  "TenantId": "{YOUR-VALUE}",
  "ClientId": "{YOUR-VALUE}",
}
```

### Azure Cache for Redis (Optional)

To use Redis, follow these steps:

1. Create an [Azure Cache for Redis instance](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-overview?WT.mc_id=AZ-MVP-5002809)
2. Copy the connection string in "Access keys"
3. Set the connection string in `ConnectionStrings:RedisConnection` in `appsettings.json` or environment variable
4. Restart the application

## Build and Run Admin Portal

### Pre-requests

- Node.js 16.x LTS
- VSCode or any editor you like
- A valid Kendo UI license

### Configure Azure AD

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD** service.
2. Select **New registration**.
3. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `elf-admin`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Single-page application** in the combo-box and enter the following redirect URI: `http://localhost:4200/` for local debug and whatever URL you use in production.
4. Select **Register** to create the application.
5. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
6. In the app's registration screen, click on the **API permissions** blade in the left to open the page where we add access to the APIs that your application needs.
   - Click the **Add a permission** button and then,
   - Ensure that the **My APIs** tab is selected.
   - In the list of APIs, select the API you created.
   - In the **Delegated permissions** section, select the **access_as_user** in the list. Use the search box if necessary.
   - Click on the **Add permissions** button at the bottom.
   
### Configure API endpoint

Open `./src/Admin/elf-admin/src/assets/env.js`

Replace `elfApiBaseUrl`, `clientId`, `tenantId`, `applicationIdUri`, `applicationInsightKey` with your own values.

### Setup Kendo UI license

- Buy [Kendo UI for Angular](https://www.telerik.com/kendo-angular-ui)
- Refer to https://www.telerik.com/kendo-angular-ui/components/my-license/ to setup your license

### Run

```bash
cd elf-admin
npm install
ng serve
```
