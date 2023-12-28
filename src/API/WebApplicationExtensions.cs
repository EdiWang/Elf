using Edi.ChinaDetector;

namespace Elf.Api;

public static class WebApplicationExtensions
{
    public static async Task DetectChina(this WebApplication app)
    {
        // Read config `Experimental:DetectChina` to decide how to deal with China
        // Refer: https://go.edi.wang/aka/os251
        var detectChina = app.Configuration["DetectChina"];
        if (!string.IsNullOrWhiteSpace(detectChina))
        {
            var service = new OfflineChinaDetectService();
            var result = await service.Detect(DetectionMethod.TimeZone | DetectionMethod.Culture | DetectionMethod.Behavior);
            if (result.Rank >= 1)
            {
                DealWithChina(app, detectChina);
            }
        }
    }

    private static void DealWithChina(WebApplication app, string detectChina)
    {
        switch (detectChina.ToLower())
        {
            case "block":
                app.Logger.LogError("Positive China detection, application stopped.");

                app.MapGet("/", () => Results.Text(
                    "Due to legal and regulation concerns, we regret to inform you that deploying Elf on servers located in Mainland China is currently not possible",
                    statusCode: 251
                ));
                app.Run();

                break;
            case "allow":
            default:
                app.Logger.LogInformation("Current server is suspected to be located in Mainland China, Elf will still run on full functionality.");

                break;
        }
    }
}