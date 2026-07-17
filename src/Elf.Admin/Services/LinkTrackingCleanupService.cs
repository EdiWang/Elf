using Elf.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Elf.Admin.Services;

public class LinkTrackingCleanupService(
    IServiceScopeFactory serviceScopeFactory,
    IOptions<LinkTrackingCleanupOptions> options,
    ILogger<LinkTrackingCleanupService> logger) : BackgroundService
{
    private static readonly TimeOnly CleanupTime = new(3, 0);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = GetDelayUntilNextCleanup(DateTimeOffset.Now);
            logger.LogInformation("Next link tracking cleanup is scheduled in {Delay}.", delay);

            await Task.Delay(delay, stoppingToken);
            await CleanupAsync(stoppingToken);
        }
    }

    private async Task CleanupAsync(CancellationToken cancellationToken)
    {
        var retentionDays = options.Value.RetentionDays;
        if (retentionDays <= 0)
        {
            logger.LogWarning("Link tracking cleanup skipped because retention days is configured as {RetentionDays}.", retentionDays);
            return;
        }

        var cutoffUtc = DateTime.UtcNow.AddDays(-retentionDays);

        try
        {
            using var scope = serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ElfDbContext>();
            var deletedCount = await dbContext.LinkTracking
                .Where(tracking => tracking.RequestTimeUtc < cutoffUtc)
                .ExecuteDeleteAsync(cancellationToken);

            logger.LogInformation(
                "Deleted {DeletedCount} link tracking records older than {CutoffUtc}.",
                deletedCount,
                cutoffUtc);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to delete old link tracking records.");
        }
    }

    private static TimeSpan GetDelayUntilNextCleanup(DateTimeOffset now)
    {
        var nextCleanup = new DateTimeOffset(
            now.Year,
            now.Month,
            now.Day,
            CleanupTime.Hour,
            CleanupTime.Minute,
            0,
            now.Offset);

        if (now >= nextCleanup)
        {
            nextCleanup = nextCleanup.AddDays(1);
        }

        return nextCleanup - now;
    }
}
