using Elf.Api.Models;

namespace Elf.Api.Features;

public interface ILinkForwarderService
{
    Task<IReadOnlyList<ClientTypeCount>> GetClientTypeCounts(int daysFromNow, int topTypes);
}