using Elf.Api.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetLinkByTokenQuery(string Token) : IQuery<LinkEntity>;

public class GetLinkByTokenQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetLinkByTokenQuery, LinkEntity>
{
    public Task<LinkEntity> HandleAsync(GetLinkByTokenQuery request, CancellationToken ct) =>
        dbContext.Link.FirstOrDefaultAsync(p => p.FwToken == request.Token, ct);
}