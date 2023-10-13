using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetTagsQuery : IRequest<List<TagEntity>>;

public class GetTagsQueryHandler(ElfDbContext dbContext) : IRequestHandler<GetTagsQuery, List<TagEntity>>
{
    public Task<List<TagEntity>> Handle(GetTagsQuery request, CancellationToken ct) => dbContext.Tag.ToListAsync(ct);
}