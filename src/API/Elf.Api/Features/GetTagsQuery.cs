using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetTagsQuery : IRequest<List<TagEntity>>;

public class GetTagsQueryHandler : IRequestHandler<GetTagsQuery, List<TagEntity>>
{
    private readonly ElfDbContext _dbContext;

    public GetTagsQueryHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public Task<List<TagEntity>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        return _dbContext.Tag.ToListAsync(cancellationToken);
    }
}