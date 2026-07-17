using Elf.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Elf.Api.Setup;

public interface IDatabaseSchemaRunner
{
    Task<bool> ExecuteSchemaScriptAsync(CancellationToken cancellationToken = default);
}

public partial class DatabaseSchemaRunner(
    ElfDbContext dbContext,
    ILogger<DatabaseSchemaRunner> logger) : IDatabaseSchemaRunner
{
    public async Task<bool> ExecuteSchemaScriptAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            logger.LogInformation("Reading embedded schema.sql script...");

            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "Elf.Api.Setup.SQL.schema.sql";

            await using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null)
            {
                logger.LogError("Could not find embedded resource: {ResourceName}", resourceName);
                return false;
            }

            using var reader = new StreamReader(stream);
            var sqlScript = await reader.ReadToEndAsync(cancellationToken);

            if (string.IsNullOrWhiteSpace(sqlScript))
            {
                logger.LogError("Schema script is empty or could not be read");
                return false;
            }

            logger.LogInformation("Executing schema script to create database tables...");

            var batches = SplitScriptIntoBatches(sqlScript);
            var connection = dbContext.Database.GetDbConnection();
            var closeConnection = connection.State != ConnectionState.Open;

            if (closeConnection)
            {
                await connection.OpenAsync(cancellationToken);
            }

            try
            {
                foreach (var batch in batches)
                {
                    var trimmedBatch = batch.Trim();
                    if (!string.IsNullOrWhiteSpace(trimmedBatch))
                    {
                        using var command = connection.CreateCommand();
                        command.CommandText = trimmedBatch;
                        await command.ExecuteNonQueryAsync(cancellationToken);
                    }
                }
            }
            finally
            {
                if (closeConnection)
                {
                    await connection.CloseAsync();
                }
            }

            logger.LogInformation("Schema script executed successfully");
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to execute schema script");
            return false;
        }
    }

    private static string[] SplitScriptIntoBatches(string script)
    {
        return SqlBatchSplitterRegex().Split(script)
            .Select(batch => batch.Trim())
            .Where(batch => !string.IsNullOrWhiteSpace(batch))
            .ToArray();
    }

    [GeneratedRegex(@"^\s*GO\s*$", RegexOptions.IgnoreCase | RegexOptions.Multiline, "en-US")]
    private static partial Regex SqlBatchSplitterRegex();
}
