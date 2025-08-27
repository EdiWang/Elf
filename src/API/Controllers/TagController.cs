using Elf.Api.Data;
using Elf.Api.Features;
using LiteBus.Commands.Abstractions;
using LiteBus.Queries.Abstractions;

namespace Elf.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TagController(ICommandMediator commandMediator, IQueryMediator queryMediator) : ControllerBase
{
    [HttpGet("list")]
    [ProducesResponseType<List<TagEntity>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> List()
    {
        var list = await queryMediator.QueryAsync(new GetTagsQuery());
        return Ok(list);
    }
}