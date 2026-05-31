using Elf.Admin.Data;
using Elf.Admin.Features;
using Elf.Admin.Models;
using LiteBus.Commands.Abstractions;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace Elf.Admin.Controllers;

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

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create(CreateTagCommand command)
    {
        try
        {
            await commandMediator.SendAsync(command);
        }
        catch (DuplicateResourceException ex)
        {
            return Conflict(ex.Message);
        }

        return NoContent();
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(int id, UpdateTagRequest request)
    {
        int code;
        try
        {
            code = await commandMediator.SendAsync(new UpdateTagCommand(id, request));
        }
        catch (DuplicateResourceException ex)
        {
            return Conflict(ex.Message);
        }

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