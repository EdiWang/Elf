# Elf

[![Docker for API](https://github.com/EdiWang/Elf/actions/workflows/docker-api.yml/badge.svg)](https://github.com/EdiWang/Elf/actions/workflows/docker-api.yml)

The link forward service used by https://go.edi.wang. It generates static URLs for redirecting third party URLs. It's similar to, but **NOT a URL shorter**. 

- Use a static token to adapt changes to origin url.
- Track user click to generate report.

e.g.:

Raw URL:
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

## Development Prerequisites

Tools | Alternative
--- | ---
[.NET 9 SDK](http://dot.net) | N/A
[Visual Studio 2022](https://visualstudio.microsoft.com/) | [Visual Studio Code](https://code.visualstudio.com/)
[Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) | [SQL Server 2022](https://www.microsoft.com/en-us/sql-server/sql-server-2022) / LocalDB (Dev Only)

## Forwarder API

### Setup Database

[Create an Azure SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-single-database-get-started?WT.mc_id=AZ-MVP-5002809) or a SQL Server 2019+ database. e.g. elf

Update the connection string "**ElfDatabase**" in **appsettings.[env].json**

```json
"ConnectionStrings": {
  "ElfDatabase": "Server=(localdb)\\MSSQLLocalDB;Database=elf;Trusted_Connection=True;"
}
```
### Build and Run

Build `./src/Elf.sln` and run `Elf.Api` project.

### Optional: Azure Cache for Redis

To use Redis, follow these steps:

1. Create an [Azure Cache for Redis instance](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-overview?WT.mc_id=AZ-MVP-5002809)
2. Copy the connection string in "Access keys"
3. Set the connection string in `ConnectionStrings:RedisConnection` in `appsettings.json` or environment variable
4. Restart the application

## Admin Portal

> NOTE: A new version of Admin Portal is under development, please stay tuned.