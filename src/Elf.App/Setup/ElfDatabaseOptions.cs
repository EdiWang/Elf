using Elf.Data;

namespace Elf.App.Setup;

public sealed record ElfDatabaseOptions(ElfDatabaseProvider Provider)
{
    public string SchemaResourceName => Provider switch
    {
        ElfDatabaseProvider.SqlServer => "Elf.App.Setup.SQL.schema.sql",
        ElfDatabaseProvider.PostgreSql => "Elf.App.Setup.SQL.schema.postgresql.sql",
        _ => throw new NotSupportedException($"Unsupported database provider: {Provider}")
    };
}
