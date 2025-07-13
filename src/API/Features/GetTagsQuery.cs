using Elf.Api.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetTagsQuery : IQuery<List<TagEntity>>;

public class GetTagsQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetTagsQuery, List<TagEntity>>
{
    public Task<List<TagEntity>> HandleAsync(GetTagsQuery request, CancellationToken ct) => dbContext.Tag.ToListAsync(ct);
}