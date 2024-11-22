using Edi.ChinaDetector;

namespace Elf.Api;

public static class WebApplicationExtensions
{
    public static async Task DetectChina(this WebApplication app)
    {
        // Learn more at https://go.edi.wang/aka/os251
        var service = new OfflineChinaDetectService();
        var result = await service.Detect(DetectionMethod.TimeZone | DetectionMethod.Culture | DetectionMethod.Behavior);
        if (result.Rank >= 1)
        {
            DealWithChina(app);
        }
    }

    private static void DealWithChina(WebApplication app)
    {
        void Prevent()
        {
            app.Logger.LogError("Positive China detection, application stopped.");

            app.MapGet("/", () => Results.Text(
                "Due to legal and regulation concerns, we regret to inform you that deploying Elf on servers located in China (including Hong Kong) is currently not possible",
                statusCode: 251
            ));
            app.Run();
        }

        if (app.Environment.IsDevelopment())
        {
            app.Logger.LogWarning("Current deployment is suspected to be located in China, Elf will still run on full functionality in development environment.");
        }
        else
        {
            Prevent();
        }
    }
}