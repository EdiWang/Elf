namespace Elf.Api.Setup;

public enum ElfDatabaseProvider
{
    SqlServer,
    PostgreSql
}

public sealed record ElfDatabaseOptions(ElfDatabaseProvider Provider)
{
    public string SchemaResourceName => Provider switch
    {
        ElfDatabaseProvider.SqlServer => "Elf.Api.Setup.SQL.schema.sql",
        ElfDatabaseProvider.PostgreSql => "Elf.Api.Setup.SQL.schema.postgresql.sql",
        _ => throw new NotSupportedException($"Unsupported database provider: {Provider}")
    };
}
