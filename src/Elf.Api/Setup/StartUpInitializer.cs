using Elf.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Elf.Api.Setup;

public interface IStartUpInitializer
{
    Task<InitStartUpResult> InitStartUpAsync(CancellationToken cancellationToken = default);
}

public class StartUpInitializer(
    ILogger<StartUpInitializer> logger,
    ElfDbContext dbContext,
    IDatabaseSchemaRunner schemaRunner
    ) : IStartUpInitializer
{
    private static readonly string[] RequiredTables = ["Link", "LinkTag", "LinkTracking", "Tag", "ElfConfiguration"];

    public async Task<InitStartUpResult> InitStartUpAsync(CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Starting application initialization...");

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            logger.LogInformation("Testing database connection...");

            try
            {
                if (!await dbContext.Database.CanConnectAsync(cancellationToken))
                {
                    throw new InvalidOperationException("Database connection failed");
                }

                logger.LogInformation("Database connection successful");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to connect to database");
                throw new InvalidOperationException("Database connection failed", ex);
            }

            logger.LogInformation("Checking database initialization status...");

            var existingTables = await GetExistingTablesAsync(cancellationToken);
            var missingTables = RequiredTables.Except(existingTables, StringComparer.OrdinalIgnoreCase).ToList();

            if (missingTables.Count == 0)
            {
                logger.LogInformation("Database is already initialized with all required tables");
                stopwatch.Stop();
                logger.LogInformation("Application initialization completed successfully in {ElapsedMs}ms",
                    stopwatch.ElapsedMilliseconds);
                return InitStartUpResult.Success;
            }

            if (existingTables.Count == 0)
            {
                logger.LogInformation("Database has no tables. Executing schema script...");

                var schemaResult = await schemaRunner.ExecuteSchemaScriptAsync(cancellationToken);
                if (!schemaResult)
                {
                    logger.LogError("Failed to execute schema script");
                    return InitStartUpResult.FailedCreateDatabase;
                }

                logger.LogInformation("Database schema created successfully");
                stopwatch.Stop();
                logger.LogInformation("Application initialization completed successfully in {ElapsedMs}ms",
                    stopwatch.ElapsedMilliseconds);
                return InitStartUpResult.Success;
            }

            logger.LogError("Database is in an inconsistent state. Missing tables: {MissingTables}",
                string.Join(", ", missingTables));
            throw new InvalidOperationException(
                $"Database is partially initialized. Missing tables: {string.Join(", ", missingTables)}");
        }
        catch (OperationCanceledException)
        {
            logger.LogWarning("Application initialization was cancelled");
            return InitStartUpResult.FailedCancellation;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            logger.LogCritical(ex, "Unexpected error during application initialization after {ElapsedMs}ms",
                stopwatch.ElapsedMilliseconds);
            return InitStartUpResult.UnexpectedError;
        }
    }

    private async Task<List<string>> GetExistingTablesAsync(CancellationToken cancellationToken)
    {
        var tableNames = string.Join(", ", RequiredTables.Select(tableName => $"'{tableName.Replace("'", "''")}'"));
        var sql = $"""
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE'
            AND TABLE_NAME IN ({tableNames})
            """;

        var connection = dbContext.Database.GetDbConnection();
        var closeConnection = connection.State != ConnectionState.Open;

        if (closeConnection)
        {
            await connection.OpenAsync(cancellationToken);
        }

        try
        {
            using var command = connection.CreateCommand();
            command.CommandText = sql;

            var tables = new List<string>();
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                tables.Add(reader.GetString(0));
            }

            return tables;
        }
        finally
        {
            if (closeConnection)
            {
                await connection.CloseAsync();
            }
        }
    }
}

public enum InitStartUpResult
{
    Success = 0,
    FailedCreateDatabase,
    FailedDatabaseMigration,
    FailedCancellation,
    UnexpectedError
}
