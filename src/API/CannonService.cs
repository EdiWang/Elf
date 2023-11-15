using System.Buffers;

namespace Elf.Api;

// https://fissssssh.com/posts/how-to-start-backgroud-task-in-asp_net_core_webapi/
public class CannonService
{
    private readonly ILogger<CannonService> _logger;
    private readonly IServiceProvider _serviceProvider;
    public CannonService(ILogger<CannonService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public void Fire(Delegate dg, Action<Exception> exceptionHandler = null)
    {
        if (dg == null)
        {
            return;
        }
        Task.Run(async () =>
        {
            var parameterTypes = dg.Method.GetParameters().Select(x => x.ParameterType).ToArray();
            var parameters = ArrayPool<object>.Shared.Rent(parameterTypes.Length);
            try
            {
                using var scope = _serviceProvider.CreateScope();
                for (var i = 0; i < parameterTypes.Length; i++)
                {
                    var t = parameterTypes[i];
                    parameters[i] = scope.ServiceProvider.GetRequiredService(t);
                }
                var returnType = dg.Method.ReturnType;
                if (returnType.IsAssignableTo(typeof(Task)))
                {
                    await (Task)dg.DynamicInvoke(parameters.Take(parameterTypes.Length).ToArray())!;
                }
                else
                {
                    dg.DynamicInvoke(parameters.Take(parameterTypes.Length).ToArray());
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Fire boom!");
                exceptionHandler?.Invoke(e);
            }
            finally
            {
                ArrayPool<object>.Shared.Return(parameters, true);
            }
        });
    }
}