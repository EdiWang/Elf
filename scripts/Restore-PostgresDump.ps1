<#
.SYNOPSIS
Restores a PostgreSQL custom-format dump into a target database.

.DESCRIPTION
This script uses the official PostgreSQL Docker image for psql and pg_restore,
so the local machine does not need PostgreSQL client tools installed.

The target database is created when it does not exist. If it already exists,
the script stops unless -DropExisting is specified.

.EXAMPLE
.\scripts\Restore-PostgresDump.ps1 `
  -DumpPath 'N:\autopostgredump\backups\production-elfprod-2026-07-24-09-24-22.dump' `
  -ConnectionString 'Host=xxx;Port=5432;Database=elfdev;Username=xxx;SslMode=Disable;'

.EXAMPLE
$env:ELF_RESTORE_CONNECTION_STRING='Host=xxx;Port=5432;Database=elfdev;Username=xxx;Password=...;SslMode=Disable;'
.\scripts\Restore-PostgresDump.ps1 -DumpPath 'N:\backups\production.dump' -DropExisting
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$DumpPath,

    [ValidateNotNullOrEmpty()]
    [string]$ConnectionString = $env:ELF_RESTORE_CONNECTION_STRING,

    [ValidateNotNullOrEmpty()]
    [string]$DockerImage = "postgres:18-alpine",

    [ValidateNotNullOrEmpty()]
    [string]$MaintenanceDatabase = "postgres",

    [switch]$DropExisting,

    [switch]$PullLatest,

    [switch]$SkipVerification
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function ConvertFrom-PgConnectionString {
    param([Parameter(Mandatory = $true)][string]$Value)

    $result = @{}
    foreach ($segment in $Value.Split(";", [System.StringSplitOptions]::RemoveEmptyEntries)) {
        $parts = $segment.Split("=", 2)
        if ($parts.Count -ne 2) {
            throw "Invalid connection string segment: $segment"
        }

        $key = $parts[0].Trim().Replace(" ", "")
        $val = $parts[1].Trim()
        if ($key.Length -gt 0) {
            $result[$key.ToLowerInvariant()] = $val
        }
    }

    return $result
}

function Get-RequiredValue {
    param(
        [Parameter(Mandatory = $true)][hashtable]$Map,
        [Parameter(Mandatory = $true)][string[]]$Keys,
        [Parameter(Mandatory = $true)][string]$DisplayName
    )

    foreach ($key in $Keys) {
        $lookup = $key.ToLowerInvariant().Replace(" ", "")
        if ($Map.ContainsKey($lookup) -and -not [string]::IsNullOrWhiteSpace($Map[$lookup])) {
            return $Map[$lookup]
        }
    }

    throw "Connection string is missing required value: $DisplayName"
}

function ConvertTo-PlainText {
    param([Parameter(Mandatory = $true)][securestring]$SecureValue)

    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

function Quote-PgIdentifier {
    param([Parameter(Mandatory = $true)][string]$Value)
    return '"' + $Value.Replace('"', '""') + '"'
}

function Quote-PgLiteral {
    param([Parameter(Mandatory = $true)][string]$Value)
    return "'" + $Value.Replace("'", "''") + "'"
}

function Invoke-DockerCapture {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    $output = & docker @Arguments 2>&1
    $exitCode = $LASTEXITCODE
    $text = ($output | Out-String).Trim()
    if ($exitCode -ne 0) {
        throw "Docker command failed with exit code $exitCode.`n$text"
    }

    return $text
}

function Invoke-DockerStream {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    & docker @Arguments
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        throw "Docker command failed with exit code $exitCode."
    }
}

function New-DockerPostgresArgs {
    param(
        [Parameter(Mandatory = $true)][string]$EnvFile,
        [Parameter(Mandatory = $true)][string[]]$Command,
        [string]$BackupDirectory
    )

    $args = @("run", "--rm", "--env-file", $EnvFile)
    if (-not [string]::IsNullOrWhiteSpace($BackupDirectory)) {
        $args += @("-v", "${BackupDirectory}:/backup:ro")
    }

    $args += $DockerImage
    $args += $Command
    return $args
}

if ([string]::IsNullOrWhiteSpace($ConnectionString)) {
    throw "Pass -ConnectionString or set ELF_RESTORE_CONNECTION_STRING."
}

$resolvedDump = Resolve-Path -LiteralPath $DumpPath
$dumpItem = Get-Item -LiteralPath $resolvedDump.Path
if ($dumpItem.Length -le 0) {
    throw "Dump file is empty: $($dumpItem.FullName)"
}

$connection = ConvertFrom-PgConnectionString -Value $ConnectionString
$hostName = Get-RequiredValue -Map $connection -Keys @("host", "server") -DisplayName "Host"
$port = if ($connection.ContainsKey("port") -and -not [string]::IsNullOrWhiteSpace($connection["port"])) { $connection["port"] } else { "5432" }
$database = Get-RequiredValue -Map $connection -Keys @("database", "dbname") -DisplayName "Database"
$username = Get-RequiredValue -Map $connection -Keys @("username", "user id", "userid", "user") -DisplayName "Username"
$sslMode = if ($connection.ContainsKey("sslmode") -and -not [string]::IsNullOrWhiteSpace($connection["sslmode"])) { $connection["sslmode"].ToLowerInvariant() } else { "disable" }

$password = $null
if ($connection.ContainsKey("password") -and -not [string]::IsNullOrWhiteSpace($connection["password"])) {
    $password = $connection["password"]
}
elseif (-not [string]::IsNullOrWhiteSpace($env:PGPASSWORD)) {
    $password = $env:PGPASSWORD
}
else {
    $securePassword = Read-Host "Password for PostgreSQL user '$username'" -AsSecureString
    $password = ConvertTo-PlainText -SecureValue $securePassword
}

if ([string]::IsNullOrWhiteSpace($password)) {
    throw "Password is required. Include it in the connection string, set PGPASSWORD, or enter it when prompted."
}

if ($DropExisting -and @("postgres", "template0", "template1") -contains $database.ToLowerInvariant()) {
    throw "Refusing to drop protected database: $database"
}

Write-Step "Checking Docker"
$dockerVersion = Invoke-DockerCapture -Arguments @("version", "--format", "{{.Server.Version}}")
Write-Host "Docker server: $dockerVersion"

if ($PullLatest) {
    Write-Step "Pulling Docker image $DockerImage"
    Invoke-DockerStream -Arguments @("pull", $DockerImage)
}
else {
    $imageExists = $true
    try {
        [void](Invoke-DockerCapture -Arguments @("image", "inspect", $DockerImage, "--format", "{{.Id}}"))
    }
    catch {
        $imageExists = $false
    }

    if (-not $imageExists) {
        Write-Step "Docker image $DockerImage is missing; pulling it"
        Invoke-DockerStream -Arguments @("pull", $DockerImage)
    }
}

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("elf-restore-" + [System.Guid]::NewGuid().ToString("N"))
$envFile = Join-Path $tempRoot "postgres.env"
$backupDirectory = Join-Path $tempRoot "backup"
$backupFileName = $dumpItem.Name
$backupCopy = Join-Path $backupDirectory $backupFileName

try {
    New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null
    Copy-Item -LiteralPath $dumpItem.FullName -Destination $backupCopy -Force

    @(
        "PGPASSWORD=$password"
        "PGSSLMODE=$sslMode"
        "PGCONNECT_TIMEOUT=15"
    ) | Set-Content -LiteralPath $envFile -Encoding ASCII

    Write-Step "Inspecting dump"
    $listArgs = New-DockerPostgresArgs -EnvFile $envFile -BackupDirectory $backupDirectory -Command @(
        "pg_restore",
        "-l",
        "/backup/$backupFileName"
    )
    $dumpList = Invoke-DockerCapture -Arguments $listArgs
    ($dumpList -split "`n" | Select-Object -First 12) | ForEach-Object { Write-Host $_ }

    Write-Step "Checking target database"
    $existsSql = "SELECT 1 FROM pg_database WHERE datname = $(Quote-PgLiteral -Value $database);"
    $existsArgs = New-DockerPostgresArgs -EnvFile $envFile -Command @(
        "psql",
        "-h", $hostName,
        "-p", $port,
        "-U", $username,
        "-d", $MaintenanceDatabase,
        "-v", "ON_ERROR_STOP=1",
        "-tAc", $existsSql
    )
    $databaseExists = (Invoke-DockerCapture -Arguments $existsArgs).Trim() -eq "1"

    if ($databaseExists -and -not $DropExisting) {
        throw "Database '$database' already exists. Re-run with -DropExisting to drop and recreate it."
    }

    if ($databaseExists -and $DropExisting) {
        Write-Step "Dropping existing database $database"
        $dropSql = "DROP DATABASE IF EXISTS $(Quote-PgIdentifier -Value $database) WITH (FORCE);"
        $dropArgs = New-DockerPostgresArgs -EnvFile $envFile -Command @(
            "psql",
            "-h", $hostName,
            "-p", $port,
            "-U", $username,
            "-d", $MaintenanceDatabase,
            "-v", "ON_ERROR_STOP=1",
            "-c", $dropSql
        )
        Invoke-DockerStream -Arguments $dropArgs
    }

    Write-Step "Creating database $database"
    $createSql = "CREATE DATABASE $(Quote-PgIdentifier -Value $database) OWNER $(Quote-PgIdentifier -Value $username);"
    $createArgs = New-DockerPostgresArgs -EnvFile $envFile -Command @(
        "psql",
        "-h", $hostName,
        "-p", $port,
        "-U", $username,
        "-d", $MaintenanceDatabase,
        "-v", "ON_ERROR_STOP=1",
        "-c", $createSql
    )
    Invoke-DockerStream -Arguments $createArgs

    Write-Step "Restoring dump into $database"
    $restoreArgs = New-DockerPostgresArgs -EnvFile $envFile -BackupDirectory $backupDirectory -Command @(
        "pg_restore",
        "--host", $hostName,
        "--port", $port,
        "--username", $username,
        "--dbname", $database,
        "--no-owner",
        "--no-acl",
        "--single-transaction",
        "--exit-on-error",
        "--verbose",
        "/backup/$backupFileName"
    )
    Invoke-DockerStream -Arguments $restoreArgs

    if (-not $SkipVerification) {
        Write-Step "Verifying restored public tables"
        $tablesSql = "SELECT table_schema || E'\t' || table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"
        $tablesArgs = New-DockerPostgresArgs -EnvFile $envFile -Command @(
            "psql",
            "-h", $hostName,
            "-p", $port,
            "-U", $username,
            "-d", $database,
            "-v", "ON_ERROR_STOP=1",
            "-tAc", $tablesSql
        )
        $tableLines = @((Invoke-DockerCapture -Arguments $tablesArgs) -split "\r?\n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

        if ($tableLines.Count -eq 0) {
            Write-Host "No public tables found."
        }
        else {
            foreach ($line in $tableLines) {
                $schemaName, $tableName = $line -split "`t", 2
                $countSql = "SELECT count(*) FROM $(Quote-PgIdentifier -Value $schemaName).$(Quote-PgIdentifier -Value $tableName);"
                $countArgs = New-DockerPostgresArgs -EnvFile $envFile -Command @(
                    "psql",
                    "-h", $hostName,
                    "-p", $port,
                    "-U", $username,
                    "-d", $database,
                    "-v", "ON_ERROR_STOP=1",
                    "-tAc", $countSql
                )
                $rowCount = (Invoke-DockerCapture -Arguments $countArgs).Trim()
                "{0}.{1}: {2}" -f $schemaName, $tableName, $rowCount
            }
        }
    }

    Write-Step "Restore completed"
    Write-Host "Database: $database"
    Write-Host "Server:   ${hostName}:$port"
}
finally {
    if (Test-Path -LiteralPath $tempRoot) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }

    if ($null -ne $password) {
        $password = $null
    }
}
