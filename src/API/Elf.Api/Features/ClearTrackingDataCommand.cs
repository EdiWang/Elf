using Elf.Api.Data;

namespace Elf.Api.Features;

public record ClearTrackingDataCommand : IRequest;

public class ClearTrackingDataCommandHandler : AsyncRequestHandler<ClearTrackingDataCommand>
{
    private readonly ElfDbContext _dbContext;

    public ClearTrackingDataCommandHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task Handle(ClearTrackingDataCommand request, CancellationToken cancellationToken)
    {
        _dbContext.LinkTracking.RemoveRange();
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}