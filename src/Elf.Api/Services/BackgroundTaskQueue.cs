using System.Threading.Channels;

namespace Elf.Api.Services;

public interface IBackgroundTaskQueue
{
    bool TryQueue(Func<IServiceProvider, CancellationToken, ValueTask> workItem);

    ValueTask<Func<IServiceProvider, CancellationToken, ValueTask>> DequeueAsync(CancellationToken cancellationToken);
}

public class BackgroundTaskQueue : IBackgroundTaskQueue
{
    private readonly Channel<Func<IServiceProvider, CancellationToken, ValueTask>> _queue;

    public BackgroundTaskQueue()
    {
        var options = new BoundedChannelOptions(1024)
        {
            FullMode = BoundedChannelFullMode.Wait,
            SingleReader = true,
            SingleWriter = false
        };

        _queue = Channel.CreateBounded<Func<IServiceProvider, CancellationToken, ValueTask>>(options);
    }

    public bool TryQueue(Func<IServiceProvider, CancellationToken, ValueTask> workItem)
    {
        ArgumentNullException.ThrowIfNull(workItem);
        return _queue.Writer.TryWrite(workItem);
    }

    public ValueTask<Func<IServiceProvider, CancellationToken, ValueTask>> DequeueAsync(CancellationToken cancellationToken) =>
        _queue.Reader.ReadAsync(cancellationToken);
}