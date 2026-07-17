using Elf.Admin.Models;
using Elf.Data;
using Elf.Shared;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Features;

public record UpdateTagCommand(int Id, UpdateTagRequest Payload) : ICommand<int>;

public class UpdateTagCommandHandler(ElfDbContext dbContext) : ICommandHandler<UpdateTagCommand, int>
{
    public async Task<int> HandleAsync(UpdateTagCommand request, CancellationToken ct)
    {
        var (id, payload) = request;
        var name = IdentifierRules.NormalizeTagName(payload.Name);
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ValidationException("Tag name is required.");
        }

        var duplicateExists = await dbContext.Tag.AnyAsync(p => p.Id != id && p.Name == name, ct);
        if (duplicateExists)
        {
            throw new DuplicateResourceException($"Tag '{name}' already exists.");
        }

        int result;
        try
        {
            result = await dbContext.Tag.Where(p => p.Id == id)
                .ExecuteUpdateAsync(t => t.SetProperty(x => x.Name, x => name), cancellationToken: ct);
        }
        catch (DbUpdateException ex) when (ex.IsUniqueConstraintViolation())
        {
            throw new DuplicateResourceException($"Tag '{name}' already exists.");
        }

        return result == 0 ? -1 : 0;
    }
}