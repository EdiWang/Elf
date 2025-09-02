using System.Data;
using Dapper;

namespace Elf.Api.Setup;

public interface IStartUpInitializer
{
    Task<InitStartUpResult> InitStartUpAsync(CancellationToken cancellationToken = default);
}

public class StartUpInitializer(
    ILogger<StartUpInitializer> logger,
    IDbConnection dbConnection,
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
            // Step 1: Try to connect to the database
            logger.LogInformation("Testing database connection...");
            
            try
            {
                await dbConnection.ExecuteScalarAsync<int>("SELECT 1", cancellationToken);
                logger.LogInformation("Database connection successful");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to connect to database");
                throw new InvalidOperationException("Database connection failed", ex);
            }

            // Step 2: Check if database has been initialized
            logger.LogInformation("Checking database initialization status...");
            
            var existingTables = await GetExistingTablesAsync(cancellationToken);
            var missingTables = RequiredTables.Except(existingTables, StringComparer.OrdinalIgnoreCase).ToList();

            if (missingTables.Count == 0)
            {
                // All tables exist - database is initialized
                logger.LogInformation("Database is already initialized with all required tables");
                stopwatch.Stop();
                logger.LogInformation("Application initialization completed successfully in {ElapsedMs}ms",
                    stopwatch.ElapsedMilliseconds);
                return InitStartUpResult.Success;
            }

            if (existingTables.Count == 0)
            {
                // No tables exist - execute schema script
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

            // Some tables exist but not all - this is an inconsistent state
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
        const string sql = @"
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE' 
            AND TABLE_NAME IN @RequiredTables";

        var tables = await dbConnection.QueryAsync<string>(sql, new { RequiredTables });
        return tables.ToList();
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
