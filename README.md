# Link Forwarder

[![Build status](https://dev.azure.com/ediwang/EdiWang-GitHub-Builds/_apis/build/status/LinkForwarder-CI)](https://dev.azure.com/ediwang/EdiWang-GitHub-Builds/_build/latest?definitionId=57)

The link forward service used by https://go.edi.wang. 

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

Update the connection string "**MoongladeDatabase**" in **appsettings.[env].json** according to your database configuration.

Example:
```json
"ConnectionStrings": {
  "LinkForwarderDatabase": "Server=(localdb)\\MSSQLLocalDB;Database=linkforwarder-dev;Trusted_Connection=True;"
}
```

### Build Source

1. Create an "**appsettings.Development.json**" under "**src\\LinkForwarder**", this file defines development time settings like db connections. It is by default ignored by git, so you will need to manange it on your own.

2. Build and run **LinkForwarder.sln**

