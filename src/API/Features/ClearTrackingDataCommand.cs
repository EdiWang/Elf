using Elf.Api.Data;

namespace Elf.Api.Features;

public record ClearTrackingDataCommand : IRequest;

public class ClearTrackingDataCommandHandler(ElfDbContext dbContext) : IRequestHandler<ClearTrackingDataCommand>
{
    public async Task Handle(ClearTrackingDataCommand request, CancellationToken ct)
    {
        dbContext.LinkTracking.RemoveRange();
        await dbContext.SaveChangesAsync(ct);
    }
}