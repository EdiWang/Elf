using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetLinkByTokenQuery(Guid TenantId, string Token) : IRequest<LinkEntity>;

public class GetLinkByTokenQueryHandler : IRequestHandler<GetLinkByTokenQuery, LinkEntity>
{
    private readonly ElfDbContext _dbContext;

    public GetLinkByTokenQueryHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<LinkEntity> Handle(GetLinkByTokenQuery request, CancellationToken cancellationToken)
    {
        var (tenantId, token) = request;
        return _dbContext.Link.FirstOrDefaultAsync(p => p.FwToken == token && p.TenantId == tenantId, cancellationToken);
    }
}