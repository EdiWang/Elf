using Elf.Services;
using Elf.Services.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Elf.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly ILinkForwarderService _linkForwarderService;
    private readonly IConfiguration _configuration;

    public ReportController(ILinkForwarderService linkForwarderService, IConfiguration configuration)
    {
        _linkForwarderService = linkForwarderService;
        _configuration = configuration;
    }

    [HttpGet("requests/recent")]
    [ProducesResponseType(typeof(IReadOnlyList<RequestTrack>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RecentRequests()
    {
        var requests = await _linkForwarderService.GetRecentRequests(64);
        return Ok(requests);
    }

    [HttpGet("requests/mostpastmonth")]
    [ProducesResponseType(typeof(IReadOnlyList<MostRequestedLinkCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> MostRequestedLinksPastMonth()
    {
        var linkCounts = await _linkForwarderService.GetMostRequestedLinkCount(30);
        return Ok(linkCounts);
    }

    [HttpGet("requests/clienttypepastmonth")]
    [ProducesResponseType(typeof(IReadOnlyList<ClientTypeCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ClientTypePastMonth()
    {
        var types = await _linkForwarderService.GetClientTypeCounts(30,
            _configuration.GetSection("AppSettings:TopClientTypes").Get<int>());
        return Ok(types);
    }

    [HttpGet("tracking/pastweek")]
    [ProducesResponseType(typeof(IReadOnlyList<LinkTrackingDateCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackingCountPastWeek()
    {
        var dateCounts = await _linkForwarderService.GetLinkTrackingDateCount(7);
        return Ok(dateCounts);
    }

    [HttpDelete("tracking/clear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ClearTrackingData()
    {
        await _linkForwarderService.ClearTrackingDataAsync();
        return NoContent();
    }
}
