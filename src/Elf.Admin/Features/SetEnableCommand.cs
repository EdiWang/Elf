using Elf.Admin.Data;
using LiteBus.Commands.Abstractions;

namespace Elf.Admin.Features;

public record SetEnableCommand(int Id, bool IsEnabled) : ICommand<string>;

public class SetEnableCommandHandler(ElfDbContext dbContext) : ICommandHandler<SetEnableCommand, string>
{
    public async Task<string> HandleAsync(SetEnableCommand request, CancellationToken ct)
    {
        var (id, isEnabled) = request;

        var link = await dbContext.Link.FindAsync(id);
        if (link is null) return null;

        link.IsEnabled = isEnabled;
        await dbContext.SaveChangesAsync(ct);
        return link.FwToken;
    }
}