using Elf.Admin.Data;
using LiteBus.Queries.Abstractions;

namespace Elf.Admin.Features;

public record GetLinkQuery(int Id) : IQuery<LinkEntity>;

public class GetLinkQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetLinkQuery, LinkEntity>
{
    public async Task<LinkEntity> HandleAsync(GetLinkQuery request, CancellationToken ct) => await dbContext.Link.FindAsync(request.Id);
}