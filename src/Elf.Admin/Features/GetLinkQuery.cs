using Elf.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record GetLinkQuery(int Id) : IQuery<LinkEntity>;

public class GetLinkQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetLinkQuery, LinkEntity>
{
    public Task<LinkEntity> HandleAsync(GetLinkQuery request, CancellationToken ct) => dbContext.Link
        .Include(link => link.Tags)
        .FirstOrDefaultAsync(link => link.Id == request.Id, ct);
}
