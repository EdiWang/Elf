# Elf

[![Docker for API](https://github.com/EdiWang/Elf/actions/workflows/docker-api.yml/badge.svg)](https://github.com/EdiWang/Elf/actions/workflows/docker-api.yml)

The link forward service used by https://go.edi.wang. It generates static URLs for redirecting third party URLs. It's similar to, but **NOT a URL shorter**. 

- Use a static token to adapt changes to origin url.
- Track user click to generate report.

e.g.:

```
https://www.somewebsite.com/a-very-long-and-complicated-link-that-can-also-change?with=parameters
```

will be translate to `https://yourdomain/fw/token` or `https://yourdomain/aka/name`

## Features

Forward Link, Create/Manage/Share Link, View Report.

![list](https://github.com/EdiWang/Elf/assets/3304703/2f3f3691-fa24-4d24-9a8f-562b0cab8261)

![report](https://github.com/EdiWang/Elf/assets/3304703/09eab5b0-0749-4d41-a4a9-56da4eb5aeb5)

## Forward Logic

![image](https://cdn.edi.wang/web-assets/lf/LinkForwarder-FW.png)

## Deployment

### Setup Database

[Create an Azure SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-single-database-get-started?WT.mc_id=AZ-MVP-5002809) or a SQL Server 2019+ database on premises.

### Docker Deployment (Recommended)

#### Quick Deploy on Azure

> If you use Azure, we provides an automatic deployment script.

TODO

#### Manually Deploy Forwarder API

```bash
docker run -d -p 8080:80 -e "ConnectionStrings__ElfDatabase=Server=tcp:<your_server>.database.windows.net,1433;Initial Catalog=<your_database>.....;" --name elf-api ediwang/elf:latest
```

#### Manually Deploy Admin UI

> This image is not ready yet. It will be available soon in RC release.

```bash
docker run -d -p 8081:80 -e "ConnectionStrings__ElfDatabase=Server=tcp:<your_server>.database.windows.net,1433;Initial Catalog=<your_database>.....;" --name elf-admin ediwang/elf-admin:latest
```

### Code Deployment

Update the connection string "**ElfDatabase**" in **Elf.Api/appsettings.json** and **Elf.Admin/appsettings.json**. Example:

```json
"ConnectionStrings": {
  "ElfDatabase": "Server=(localdb)\\MSSQLLocalDB;Database=elf;Trusted_Connection=True;"
}
```

Build `./src/Elf.sln`, deploy both `Elf.Api` and `Elf.Admin` project.

### Setup Authentication

Typically, `Elf.Api` should be publicly accessible, while `Elf.Admin` should be protected.

`Elf.Admin` does not have authentication out of box. It is up to you to setup authentication in front of them. You can use, but not limited to:

- Azure App Service Authentication
- Azure Container Apps Authentication
- Azure API Management

#### Example: Azure App Service Authentication

1. Create an [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore?WT.mc_id=AZ-MVP-5002809)
2. Deploy `Elf.Admin` to the App Service
3. Enable [App Service Authentication](https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization?WT.mc_id=AZ-MVP-5002809)
4. Choose an identity provider, e.g. Microsoft
5. Configure the authentication settings to allow only authenticated users
6. Access the Elf Admin site, login with the identity provider

### Optional: Azure Cache for Redis

To use Redis, follow these steps:

1. Create an [Azure Cache for Redis instance](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-overview?WT.mc_id=AZ-MVP-5002809)
2. Copy the connection string in "Access keys"
3. Set the connection string in `ConnectionStrings:RedisConnection` in `Elf.Api/appsettings.json` or environment variable
4. Restart the application

## Development

Tools | Alternative
--- | ---
[.NET 9 SDK](http://dot.net) | N/A
[Visual Studio 2022](https://visualstudio.microsoft.com/) | [Visual Studio Code](https://code.visualstudio.com/)
[Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) | [SQL Server 2022](https://www.microsoft.com/en-us/sql-server/sql-server-2022) / LocalDB (Dev Only)
