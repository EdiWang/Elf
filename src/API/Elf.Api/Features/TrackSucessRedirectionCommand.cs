using Elf.Api.Data;

namespace Elf.Api.Features;

public record TrackSucessRedirectionCommand(LinkTrackingRequest Request) : IRequest;

public class TrackSucessRedirectionCommandHandler : AsyncRequestHandler<TrackSucessRedirectionCommand>
{
    private readonly ElfDbContext _dbContext;

    public TrackSucessRedirectionCommandHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task Handle(TrackSucessRedirectionCommand request, CancellationToken cancellationToken)
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
    }
}