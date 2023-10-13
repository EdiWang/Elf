using Elf.Api.Data;

namespace Elf.Api.Features;

public record SetEnableCommand(int Id, bool IsEnabled) : IRequest;

public class SetEnableCommandHandler(ElfDbContext dbContext) : IRequestHandler<SetEnableCommand>
{
    public async Task Handle(SetEnableCommand request, CancellationToken ct)
    {
        var (id, isEnabled) = request;

        var link = await dbContext.Link.FindAsync(id);
        if (link is null) return;

        link.IsEnabled = isEnabled;
        await dbContext.SaveChangesAsync(ct);
    }
}