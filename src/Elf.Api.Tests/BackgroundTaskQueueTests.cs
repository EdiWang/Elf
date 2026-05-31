using Elf.Api.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;

namespace Elf.Api.Tests;

public class BackgroundTaskQueueTests
{
    [Fact]
    public async Task QueuedBackgroundService_ExecutesQueuedWorkItemInScope()
    {
        var queue = new BackgroundTaskQueue();
        var services = new ServiceCollection()
            .AddScoped<ScopedMarker>()
            .BuildServiceProvider();
        var executed = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);

        Assert.True(queue.TryQueue((serviceProvider, cancellationToken) =>
        {
            serviceProvider.GetRequiredService<ScopedMarker>();
            executed.SetResult();
            return ValueTask.CompletedTask;
        }));

        using var backgroundService = new QueuedBackgroundService(
            queue,
            services,
            NullLogger<QueuedBackgroundService>.Instance);

        await backgroundService.StartAsync(TestContext.Current.CancellationToken);
        await executed.Task.WaitAsync(TimeSpan.FromSeconds(5), TestContext.Current.CancellationToken);
        await backgroundService.StopAsync(TestContext.Current.CancellationToken);
    }

    private sealed class ScopedMarker;
}
