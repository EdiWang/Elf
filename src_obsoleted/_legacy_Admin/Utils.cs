using Microsoft.FluentUI.AspNetCore.Components;

namespace ElfAdmin;

public static class Utils
{
    public static async Task ShowMessage(this IMessageService messageService, string message, MessageIntent messageIntent)
    {
        await messageService.ShowMessageBarAsync(options =>
            {
                options.Title = message;
                options.Intent = messageIntent;
                options.Section = "MESSAGES_BOTTOM";
                options.Timeout = 3;
            });
    }
}