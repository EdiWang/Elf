using Elf.Api.Features;
using Elf.Shared;
using LiteBus.Commands.Abstractions;
using LiteBus.Queries.Abstractions;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.FeatureManagement;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LinkController(
        ILinkVerifier linkVerifier,
        IDistributedCache cache,
        IFeatureManager featureManager,
        ICommandMediator commandMediator,
        IQueryMediator queryMediator) : ControllerBase
{
    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(LinkEditModel model)
    {
        var flag = await featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
        var verifyResult = linkVerifier.Verify(model.OriginUrl, Url, Request, flag);
        switch (verifyResult)
        {
            case LinkVerifyResult.InvalidFormat:
                return BadRequest("Not a valid URL.");
            case LinkVerifyResult.InvalidLocal:
                return BadRequest("Can not use local URL.");
            case LinkVerifyResult.InvalidSelfReference:
                return BadRequest("Can not use url pointing to this site.");
        }

        await commandMediator.SendAsync(new CreateLinkCommand(model));
        return NoContent();
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Edit(int id, LinkEditModel model)
    {
        var flag = await featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
        var verifyResult = linkVerifier.Verify(model.OriginUrl, Url, Request, flag);
        switch (verifyResult)
        {
            case LinkVerifyResult.InvalidFormat:
                return BadRequest("Invalid URL.");
            case LinkVerifyResult.InvalidLocal:
                return BadRequest("Can not use local URL.");
            case LinkVerifyResult.InvalidSelfReference:
                return BadRequest("Can not use url from this site.");
        }

        var token = await commandMediator.SendAsync(new EditLinkCommand(id, model));
        if (token is not null) await cache.RemoveAsync(token);
        return NoContent();
    }

    [HttpPut("{id:int}/enable")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> SetEnable(int id, bool isEnabled)
    {
        await commandMediator.SendAsync(new SetEnableCommand(id, isEnabled));
        return NoContent();
    }

    [HttpGet("list")]
    [ProducesResponseType<PagedLinkResult>(StatusCodes.Status200OK)]
    public async Task<IActionResult> List(
        string term,
        [Range(1, int.MaxValue)] int take,
        [Range(0, int.MaxValue)] int offset)
    {
        var (links, totalRows) = await queryMediator.QueryAsync(new ListLinkQuery(offset, take, term));

        var result = new PagedLinkResult
        {
            Links = links,
            TotalRows = totalRows,
            PageSize = take
        };

        return Ok(result);
    }

    [HttpPost("list/tags")]
    [ProducesResponseType<PagedLinkResult>(StatusCodes.Status200OK)]
    public async Task<IActionResult> ListByTags(ListByTagsRequest request)
    {
        var (links, totalRows) = await queryMediator.QueryAsync(new ListByTagsQuery(request));

        var result = new PagedLinkResult
        {
            Links = links,
            TotalRows = totalRows,
            PageSize = request.Take
        };

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<LinkEditModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(int id)
    {
        var link = await queryMediator.QueryAsync(new GetLinkQuery(id));
        if (link is null) return NotFound();

        return Ok(link);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType<LinkEditModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var link = await queryMediator.QueryAsync(new GetLinkQuery(id));
        if (link is null) return NotFound();

        await commandMediator.SendAsync(new DeleteLinkCommand(id));

        await cache.RemoveAsync(link.FwToken);
        return Ok();
    }
}
