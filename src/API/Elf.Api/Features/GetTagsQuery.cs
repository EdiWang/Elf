using Elf.Api.Data;

namespace Elf.Api.Features;

public record GetTagsQuery : IRequest<List<TagEntity>>;

public class GetTagsQueryHandler : IRequestHandler<GetTagsQuery, List<TagEntity>>
{


    public Task<List<TagEntity>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}