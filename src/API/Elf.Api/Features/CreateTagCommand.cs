using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Features;

public record CreateTagCommand([Required][MaxLength(32)] string Name) : IRequest;

public class CreateTagCommandHandler : IRequestHandler<CreateTagCommand>
{
    private readonly ElfDbContext _dbContext;

    public CreateTagCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task Handle(CreateTagCommand request, CancellationToken ct)
    {
        var exists = await _dbContext.Tag.AnyAsync(p => p.Name == request.Name, ct);
        if (exists) return;

        var tag = new TagEntity
        {
            Name = request.Name.Trim()
        };

        await _dbContext.AddAsync(tag, ct);
        await _dbContext.SaveChangesAsync(ct);
    }
}