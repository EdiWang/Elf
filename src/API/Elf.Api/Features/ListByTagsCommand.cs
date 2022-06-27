using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Features;

public class ListByTagsRequest
{
    [Required]
    [MinLength(1)]
    public int[] TagIds { get; set; }

    [Range(1, int.MaxValue)]
    public int Take { get; set; }

    [Range(0, int.MaxValue)]
    public int Offset { get; set; }
}

public record ListByTagsCommand(ListByTagsRequest Payload) : IRequest<(IReadOnlyList<LinkModel> Links, int TotalRows)>;

public class ListByTagsCommandHandler : IRequestHandler<ListByTagsCommand, (IReadOnlyList<LinkModel> Links, int TotalRows)>
{
    private readonly ElfDbContext _dbContext;

    public ListByTagsCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<(IReadOnlyList<LinkModel> Links, int TotalRows)> Handle(ListByTagsCommand request, CancellationToken cancellationToken)
    {
        var query = from l in _dbContext.Link.Include(l => l.Tags)
                    where l.Tags.Any(t => request.Payload.TagIds.Contains(t.Id))
                    select l;

        var totalRows = query.Count();
        var data = await query.OrderByDescending(p => p.UpdateTimeUtc)
            .Skip(request.Payload.Offset)
            .Take(request.Payload.Take)
            .AsNoTracking()
            .Select(p => new LinkModel
            {
                Id = p.Id,
                OriginUrl = p.OriginUrl,
                Note = p.Note,
                TTL = p.TTL,
                UpdateTimeUtc = p.UpdateTimeUtc,
                AkaName = p.AkaName,
                FwToken = p.FwToken,
                IsEnabled = p.IsEnabled,
                Tags = p.Tags.ToArray()
            })
            .ToListAsync(cancellationToken);

        return (data, totalRows);
    }
}