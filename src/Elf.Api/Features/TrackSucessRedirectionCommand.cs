using Elf.Api.Data;
using Elf.Api.Models;

namespace Elf.Api.Features;

public record TrackSucessRedirectionCommand(LinkTrackingRequest Request):IRequest;

public class TrackSucessRedirectionCommandHandler : IRequestHandler<TrackSucessRedirectionCommand>
{
    private readonly ElfDbContext _dbContext;

    public TrackSucessRedirectionCommandHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Unit> Handle(TrackSucessRedirectionCommand request, CancellationToken cancellationToken)
    {
        var lt = new LinkTrackingEntity
        {
            IpAddress = request.Request.IpAddress,
            LinkId = request.Request.LinkId,
            RequestTimeUtc = DateTime.UtcNow,
            UserAgent = request.Request.UserAgent
        };

        await _dbContext.AddAsync(lt, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}