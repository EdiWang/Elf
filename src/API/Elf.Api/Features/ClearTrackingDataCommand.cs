using Elf.Api.Data;

namespace Elf.Api.Features;

public record ClearTrackingDataCommand : IRequest;

public class ClearTrackingDataCommandHandler : IRequestHandler<ClearTrackingDataCommand>
{
    private readonly ElfDbContext _dbContext;

    public ClearTrackingDataCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task Handle(ClearTrackingDataCommand request, CancellationToken ct)
    {
        _dbContext.LinkTracking.RemoveRange();
        await _dbContext.SaveChangesAsync(ct);
    }
}