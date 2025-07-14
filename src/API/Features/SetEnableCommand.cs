using Elf.Api.Data;
using LiteBus.Commands.Abstractions;

namespace Elf.Api.Features;

public record SetEnableCommand(int Id, bool IsEnabled) : ICommand;

public class SetEnableCommandHandler(ElfDbContext dbContext) : ICommandHandler<SetEnableCommand>
{
    public async Task HandleAsync(SetEnableCommand request, CancellationToken ct)
    {
        var (id, isEnabled) = request;

        var link = await dbContext.Link.FindAsync(id);
        if (link is null) return;

        link.IsEnabled = isEnabled;
        await dbContext.SaveChangesAsync(ct);
    }
}