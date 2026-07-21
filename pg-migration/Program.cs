using System.Data.Common;
using Microsoft.Data.SqlClient;
using Npgsql;
using NpgsqlTypes;

const string SourceVariable = "SQLSERVER_CONNECTION_STRING";
const string TargetVariable = "POSTGRES_CONNECTION_STRING";
var verifyOnly = args.Contains("--verify-only", StringComparer.OrdinalIgnoreCase);

var sourceConnectionString = Environment.GetEnvironmentVariable(SourceVariable)
    ?? @"Server=(localdb)\MSSQLLocalDB;Database=elf;Trusted_Connection=True;";
var targetConnectionString = Environment.GetEnvironmentVariable(TargetVariable);

if (string.IsNullOrWhiteSpace(targetConnectionString))
{
    Console.Error.WriteLine($"Set {TargetVariable} before running the migrator.");
    return 2;
}

var tables = new[]
{
    new TableSpec(
        "Link",
        """SELECT [Id], [OriginUrl], [FwToken], [Note], [IsEnabled], [UpdateTimeUtc], [AkaName], [TTL] FROM [dbo].[Link] ORDER BY [Id]""",
        """SELECT "Id", "OriginUrl", "FwToken", "Note", "IsEnabled", "UpdateTimeUtc", "AkaName", "TTL" FROM "Link" ORDER BY "Id" """,
        """INSERT INTO "Link" ("Id", "OriginUrl", "FwToken", "Note", "IsEnabled", "UpdateTimeUtc", "AkaName", "TTL") VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7)""",
        [NpgsqlDbType.Integer, NpgsqlDbType.Varchar, NpgsqlDbType.Varchar, NpgsqlDbType.Text, NpgsqlDbType.Boolean, NpgsqlDbType.TimestampTz, NpgsqlDbType.Varchar, NpgsqlDbType.Integer]),
    new TableSpec(
        "Tag",
        """SELECT [Id], [Name] FROM [dbo].[Tag] ORDER BY [Id]""",
        """SELECT "Id", "Name" FROM "Tag" ORDER BY "Id" """,
        """INSERT INTO "Tag" ("Id", "Name") VALUES (@p0, @p1)""",
        [NpgsqlDbType.Integer, NpgsqlDbType.Varchar]),
    new TableSpec(
        "LinkTag",
        """SELECT [LinkId], [TagId] FROM [dbo].[LinkTag] ORDER BY [LinkId], [TagId]""",
        """SELECT "LinkId", "TagId" FROM "LinkTag" ORDER BY "LinkId", "TagId" """,
        """INSERT INTO "LinkTag" ("LinkId", "TagId") VALUES (@p0, @p1)""",
        [NpgsqlDbType.Integer, NpgsqlDbType.Integer]),
    new TableSpec(
        "LinkTracking",
        """SELECT [Id], [LinkId], [UserAgent], [IpAddress], [RequestTimeUtc], [IPCountry], [IPRegion], [IPCity], [IPASN], [IPOrg] FROM [dbo].[LinkTracking] ORDER BY CONVERT(varchar(36), [Id])""",
        """SELECT "Id", "LinkId", "UserAgent", "IpAddress", "RequestTimeUtc", "IPCountry", "IPRegion", "IPCity", "IPASN", "IPOrg" FROM "LinkTracking" ORDER BY "Id"::text """,
        """INSERT INTO "LinkTracking" ("Id", "LinkId", "UserAgent", "IpAddress", "RequestTimeUtc", "IPCountry", "IPRegion", "IPCity", "IPASN", "IPOrg") VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9)""",
        [NpgsqlDbType.Uuid, NpgsqlDbType.Integer, NpgsqlDbType.Varchar, NpgsqlDbType.Varchar, NpgsqlDbType.TimestampTz, NpgsqlDbType.Varchar, NpgsqlDbType.Varchar, NpgsqlDbType.Varchar, NpgsqlDbType.Varchar, NpgsqlDbType.Varchar]),
    new TableSpec(
        "ElfConfiguration",
        """SELECT [CfgKey], [CfgValue], [LastModifiedTimeUtc] FROM [dbo].[ElfConfiguration] ORDER BY [CfgKey]""",
        """SELECT "CfgKey", "CfgValue", "LastModifiedTimeUtc" FROM "ElfConfiguration" ORDER BY "CfgKey" """,
        """INSERT INTO "ElfConfiguration" ("CfgKey", "CfgValue", "LastModifiedTimeUtc") VALUES (@p0, @p1, @p2)""",
        [NpgsqlDbType.Varchar, NpgsqlDbType.Text, NpgsqlDbType.TimestampTz])
};

await using var source = new SqlConnection(sourceConnectionString);
await using var target = new NpgsqlConnection(targetConnectionString);
await source.OpenAsync();
await target.OpenAsync();

Console.WriteLine($"Source: {source.Database} on {source.DataSource}");
Console.WriteLine($"Target: {target.Database} on {target.Host}:{target.Port}");

if (!verifyOnly)
{
    foreach (var table in tables)
    {
        await using var countCommand = new NpgsqlCommand($"SELECT COUNT(*) FROM \"{table.Name}\"", target);
        var count = Convert.ToInt64(await countCommand.ExecuteScalarAsync());
        if (count != 0)
        {
            throw new InvalidOperationException($"Target table {table.Name} is not empty ({count} rows). Migration stopped without changing data.");
        }
    }

    await using var transaction = await target.BeginTransactionAsync();
    try
    {
        await using (var timezone = new NpgsqlCommand("SET LOCAL TIME ZONE 'UTC'", target, transaction))
        {
            await timezone.ExecuteNonQueryAsync();
        }

        foreach (var table in tables)
        {
            var copied = await CopyTableAsync(source, target, transaction, table);
            Console.WriteLine($"Copied {table.Name}: {copied:N0} rows");
        }

        const string resetSequences = """
            SELECT setval(pg_get_serial_sequence('"Link"', 'Id'), COALESCE(MAX("Id"), 1), COUNT(*) > 0) FROM "Link";
            SELECT setval(pg_get_serial_sequence('"Tag"', 'Id'), COALESCE(MAX("Id"), 1), COUNT(*) > 0) FROM "Tag";
            """;
        await using (var sequenceCommand = new NpgsqlCommand(resetSequences, target, transaction))
        {
            await sequenceCommand.ExecuteNonQueryAsync();
        }

        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}

foreach (var table in tables)
{
    var verified = await VerifyTableAsync(source, target, table);
    Console.WriteLine($"Verified {table.Name}: {verified:N0} rows, every column matches");
}

Console.WriteLine("Migration and full row-by-row verification completed successfully.");
return 0;

static async Task<long> CopyTableAsync(
    SqlConnection source,
    NpgsqlConnection target,
    NpgsqlTransaction transaction,
    TableSpec table)
{
    await using var select = new SqlCommand(table.SourceQuery, source) { CommandTimeout = 120 };
    await using var reader = await select.ExecuteReaderAsync();
    await using var insert = new NpgsqlCommand(table.InsertSql, target, transaction) { CommandTimeout = 120 };

    for (var i = 0; i < table.Types.Length; i++)
    {
        insert.Parameters.Add(new NpgsqlParameter($"p{i}", table.Types[i]));
    }

    await insert.PrepareAsync();
    long count = 0;
    while (await reader.ReadAsync())
    {
        for (var i = 0; i < reader.FieldCount; i++)
        {
            insert.Parameters[i].Value = GetPortableValue(reader, i);
        }

        await insert.ExecuteNonQueryAsync();
        count++;
    }

    return count;
}

static async Task<long> VerifyTableAsync(SqlConnection source, NpgsqlConnection target, TableSpec table)
{
    await using var sourceCommand = new SqlCommand(table.SourceQuery, source) { CommandTimeout = 120 };
    await using var targetCommand = new NpgsqlCommand(table.TargetQuery, target) { CommandTimeout = 120 };
    await using var sourceReader = await sourceCommand.ExecuteReaderAsync();
    await using var targetReader = await targetCommand.ExecuteReaderAsync();

    long row = 0;
    while (true)
    {
        var hasSource = await sourceReader.ReadAsync();
        var hasTarget = await targetReader.ReadAsync();
        if (hasSource != hasTarget)
        {
            throw new InvalidOperationException($"Verification failed for {table.Name}: row counts differ after row {row}.");
        }

        if (!hasSource)
        {
            return row;
        }

        for (var column = 0; column < sourceReader.FieldCount; column++)
        {
            var sourceValue = GetPortableValue(sourceReader, column);
            var targetValue = GetPortableValue(targetReader, column);
            if (!Equivalent(sourceValue, targetValue))
            {
                throw new InvalidOperationException($"Verification failed for {table.Name} at row {row + 1}, column {sourceReader.GetName(column)}.");
            }
        }

        row++;
    }
}

static object GetPortableValue(DbDataReader reader, int ordinal)
{
    if (reader.IsDBNull(ordinal))
    {
        return DBNull.Value;
    }

    var value = reader.GetValue(ordinal);
    return value is DateTime dateTime
        ? DateTime.SpecifyKind(dateTime, DateTimeKind.Utc)
        : value;
}

static bool Equivalent(object source, object target)
{
    if (source is DBNull || target is DBNull)
    {
        return source is DBNull && target is DBNull;
    }

    if (source is DateTime sourceDateTime && target is DateTime targetDateTime)
    {
        return sourceDateTime.ToUniversalTime().Ticks / 10 == targetDateTime.ToUniversalTime().Ticks / 10;
    }

    return source.Equals(target);
}

internal sealed record TableSpec(
    string Name,
    string SourceQuery,
    string TargetQuery,
    string InsertSql,
    NpgsqlDbType[] Types);
