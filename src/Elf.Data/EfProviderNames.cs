#nullable enable

namespace Elf.Data;

internal static class EfProviderNames
{
    public const string SqlServer = "Microsoft.EntityFrameworkCore.SqlServer";
    public const string PostgreSql = "Npgsql.EntityFrameworkCore.PostgreSQL";

    public static bool IsSqlServer(string? providerName) =>
        string.Equals(providerName, SqlServer, StringComparison.Ordinal);

    public static bool IsPostgreSql(string? providerName) =>
        string.Equals(providerName, PostgreSql, StringComparison.Ordinal);
}
