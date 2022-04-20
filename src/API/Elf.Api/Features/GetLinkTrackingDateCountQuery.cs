using System.ComponentModel.DataAnnotations;
using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public class TrackingCountRequest : IValidatableObject
{
    [Required]
    public DateTime StartDateUtc { get; set; }

    [Required]
    public DateTime EndDateUtc { get; set; }

    public TrackingCountRequest()
    {
        StartDateUtc = DateTime.UtcNow.Date;
        EndDateUtc = DateTime.UtcNow.Date;
    }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDateUtc < StartDateUtc)
        {
            yield return new("EndDateUtc must be greater than StartDateUtc", new[] { nameof(StartDateUtc), nameof(EndDateUtc) });
        }
    }
}

public record GetLinkTrackingDateCountQuery(TrackingCountRequest Request) : IRequest<IReadOnlyList<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountQueryHandler :
        IRequestHandler<GetLinkTrackingDateCountQuery, IReadOnlyList<LinkTrackingDateCount>>
{
    private readonly ElfDbContext _dbContext;

    public GetLinkTrackingDateCountQueryHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<IReadOnlyList<LinkTrackingDateCount>> Handle(GetLinkTrackingDateCountQuery request, CancellationToken cancellationToken)
    {
        var data = await (from lt in _dbContext.LinkTracking
                          where lt.RequestTimeUtc <= request.Request.EndDateUtc.Date &&
                                lt.RequestTimeUtc >= request.Request.StartDateUtc.Date
                          group lt by lt.RequestTimeUtc.Date into g
                          select new LinkTrackingDateCount
                          {
                              TrackingDateUtc = g.Key,
                              RequestCount = g.Count()
                          }).AsNoTracking().ToListAsync(cancellationToken);

        return data;
    }
}