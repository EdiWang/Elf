using Elf.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Features;

public class UpdateTagRequest
{
    [Required]
    [MaxLength(32)]
    public string Name { get; set; }
}

public record UpdateTagCommand(int Id, UpdateTagRequest Payload) : IRequest<int>;

public class UpdateTagCommandHandler : IRequestHandler<UpdateTagCommand, int>
{
    private readonly ElfDbContext _dbContext;

    public UpdateTagCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;


    public async Task<int> Handle(UpdateTagCommand request, CancellationToken ct)
    {
        var (id, payload) = request;

        var tag = await _dbContext.Tag.FindAsync(id);
        if (null == tag) return -1;

        tag.Name = payload.Name.Trim();

        _dbContext.Update(tag);
        await _dbContext.SaveChangesAsync(ct);
        return 0;
    }
}