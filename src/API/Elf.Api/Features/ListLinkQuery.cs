using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features
{
    public record ListLinkQuery(int Offset, int Take, string NoteKeyword = null) :
        IRequest<(IReadOnlyList<LinkEntity> Links, int TotalRows)>;

    public class ListLinkQueryHandler : IRequestHandler<ListLinkQuery, (IReadOnlyList<LinkEntity> Links, int TotalRows)>
    {
        private readonly ElfDbContext _dbContext;

        public ListLinkQueryHandler(ElfDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(IReadOnlyList<LinkEntity> Links, int TotalRows)> Handle(ListLinkQuery request, CancellationToken cancellationToken)
        {
            var query = from l in _dbContext.Link
                        select l;

            var (offset, take, noteKeyword) = request;
            if (noteKeyword is not null)
            {
                query = from l in _dbContext.Link
                        where l.Note.Contains(noteKeyword) || l.FwToken.Contains(noteKeyword)
                        select l;
            }

            var totalRows = query.Count();
            var data = await query.OrderByDescending(p => p.UpdateTimeUtc)
                .Skip(offset)
                .Take(take)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return (data, totalRows);
        }
    }
}
