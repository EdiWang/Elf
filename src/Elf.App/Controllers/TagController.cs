using Elf.App.Auth;
using Elf.App.Features;
using Elf.App.Models;
using Elf.Data;
using LiteBus.Commands.Abstractions;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Elf.App.Controllers;

[ApiController]
[Authorize(Policy = ElfAuthorizationPolicies.Admin)]
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
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
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
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
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