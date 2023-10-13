using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetLinkByTokenQuery(string Token) : IRequest<LinkEntity>;

public class GetLinkByTokenQueryHandler(ElfDbContext dbContext) : IRequestHandler<GetLinkByTokenQuery, LinkEntity>
{
    public Task<LinkEntity> Handle(GetLinkByTokenQuery request, CancellationToken ct) =>
        dbContext.Link.FirstOrDefaultAsync(p => p.FwToken == request.Token, ct);
}