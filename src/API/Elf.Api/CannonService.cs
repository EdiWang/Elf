﻿namespace Elf.Api;

public class CannonService
{
    private readonly ILogger<CannonService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public CannonService(
        ILogger<CannonService> logger,
        IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    public void Fire<T>(Action<T> bullet, Action<Exception> handler = null)
    {
        _logger.LogInformation("Fired a new action.");
        Task.Run(() =>
        {
            using var scope = _scopeFactory.CreateScope();
            var dependency = scope.ServiceProvider.GetRequiredService<T>();
            try
            {
                bullet(dependency);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Cannon crashed!");
                handler?.Invoke(e);
            }
            finally
            {
                dependency = default;
            }
        });
    }

    public void FireAsync<T>(Func<T, Task> bullet, Action<Exception> handler = null)
    {
        _logger.LogInformation("Fired a new async action.");
        Task.Run(async () =>
        {
            using var scope = _scopeFactory.CreateScope();
            var dependency = scope.ServiceProvider.GetRequiredService<T>();
            try
            {
                await bullet(dependency);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Cannon crashed!");
                handler?.Invoke(e);
            }
            finally
            {
                dependency = default;
            }
        });
    }
}