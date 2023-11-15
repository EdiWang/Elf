using Elf.Api.Data;

namespace Elf.Api.Features;

public record GetLinkQuery(int Id) : IRequest<LinkEntity>;

public class GetLinkQueryHandler(ElfDbContext dbContext) : IRequestHandler<GetLinkQuery, LinkEntity>
{
    public async Task<LinkEntity> Handle(GetLinkQuery request, CancellationToken ct) => await dbContext.Link.FindAsync(request.Id);
}