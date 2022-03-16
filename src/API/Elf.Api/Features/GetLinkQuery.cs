using Elf.Api.Data;

namespace Elf.Api.Features;

public record GetLinkQuery(int Id) : IRequest<LinkEntity>;

public class GetLinkQueryHandler : IRequestHandler<GetLinkQuery, LinkEntity>
{
    private readonly ElfDbContext _dbContext;

    public GetLinkQueryHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<LinkEntity> Handle(GetLinkQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Link.FindAsync(request.Id);
    }
}