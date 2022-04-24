namespace Elf.Api.Features;

public record CreateTagCommand(string Name) : IRequest;