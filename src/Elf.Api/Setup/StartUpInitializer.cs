namespace Elf.Api.Setup;

public interface IStartUpInitializer
{
    Task<InitStartUpResult> InitStartUpAsync(CancellationToken cancellationToken = default);
}

public class StartUpInitializer(
    ILogger<StartUpInitializer> logger
    ) : IStartUpInitializer
{
    public async Task<InitStartUpResult> InitStartUpAsync(CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Starting application initialization...");

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            stopwatch.Stop();
            logger.LogInformation("Application initialization completed successfully in {ElapsedMs}ms",
                stopwatch.ElapsedMilliseconds);

            // TODO: Implement actual initialization logic here

            return InitStartUpResult.Success;
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
}

public enum InitStartUpResult
{
    Success = 0,
    FailedCreateDatabase,
    FailedDatabaseMigration,
    FailedCancellation,
    UnexpectedError
}
