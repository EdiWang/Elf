using Elf.Admin.Data;
using LiteBus.Commands.Abstractions;

namespace Elf.Admin.Features;

public record ClearTrackingDataCommand : ICommand;

public class ClearTrackingDataCommandHandler(ElfDbContext dbContext) : ICommandHandler<ClearTrackingDataCommand>
{
    public async Task HandleAsync(ClearTrackingDataCommand request, CancellationToken ct)
    {
        dbContext.LinkTracking.RemoveRange();
        await dbContext.SaveChangesAsync(ct);
    }
}