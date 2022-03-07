using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features
{
    public record ListLinkQuery(int Offset, int PageSize, string NoteKeyword = null) : IRequest<(IReadOnlyList<LinkEntity> Links, int TotalRows)>;

    public class ListLinkQueryHandler : IRequestHandler<ListLinkQuery, (IReadOnlyList<LinkEntity> Links, int TotalRows)>
    {
        private readonly ElfDbContext _dbContext;

        public ListLinkQueryHandler(ElfDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(IReadOnlyList<LinkEntity> Links, int TotalRows)> Handle(ListLinkQuery request, CancellationToken cancellationToken)
        {
            if (request.PageSize < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(request.PageSize),
                    $"{nameof(request.PageSize)} can not be less than 1, current value: {request.PageSize}.");
            }
            if (request.Offset < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(request.Offset),
                    $"{nameof(request.Offset)} can not be less than 0, current value: {request.Offset}.");
            }

            var query = from l in _dbContext.Link
                        select l;

            if (request.NoteKeyword is not null)
            {
                query = from l in _dbContext.Link
                        where l.Note.Contains(request.NoteKeyword) || l.FwToken.Contains(request.NoteKeyword)
                        select l;
            }

            int totalRows = query.Count();
            var data = await query.OrderByDescending(p => p.UpdateTimeUtc)
                .Skip(request.Offset)
                .Take(request.PageSize)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return (data, totalRows);
        }
    }
}
