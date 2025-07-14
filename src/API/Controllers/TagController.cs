using Elf.Api.Data;
using Elf.Api.Features;
using Elf.Shared;
using LiteBus.Commands.Abstractions;
using LiteBus.Queries.Abstractions;

namespace Elf.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TagController(IMediator mediator, ICommandMediator commandMediator, IQueryMediator queryMediator) : ControllerBase
{
    [HttpGet("list")]
    [ProducesResponseType<List<TagEntity>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> List()
    {
        var list = await queryMediator.QueryAsync(new GetTagsQuery());
        return Ok(list);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateTagCommand command)
    {
        await commandMediator.SendAsync(command);
        return NoContent();
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateTagRequest request)
    {
        var code = await mediator.Send(new UpdateTagCommand(id, request));
        if (code == -1) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var code = await commandMediator.SendAsync(new DeleteTagCommand(id));
        if (code == -1) return NotFound();

        return NoContent();
    }
}