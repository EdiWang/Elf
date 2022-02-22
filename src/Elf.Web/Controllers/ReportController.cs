using Elf.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Elf.Web.Controllers;

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

    [HttpPost("recent-requests")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RecentRequests()
    {
        var requests = await _linkForwarderService.GetRecentRequests(64);
        return Ok(new { Data = requests });
    }

    [HttpPost("most-requested-links-past-month")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> MostRequestedLinksPastMonth()
    {
        var linkCounts = await _linkForwarderService.GetMostRequestedLinkCount(30);
        return Ok(linkCounts);
    }

    [HttpPost("client-type-past-month")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ClientTypePastMonth()
    {
        var types = await _linkForwarderService.GetClientTypeCounts(30, _configuration.GetSection("AppSettings:TopClientTypes").Get<int>());
        return Ok(types);
    }

    [HttpPost("tracking-count-past-week")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackingCountPastWeek()
    {
        var dateCounts = await _linkForwarderService.GetLinkTrackingDateCount(7);
        return Ok(dateCounts);
    }

    [HttpPost("clear-tracking-data")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ClearTrackingData()
    {
        await _linkForwarderService.ClearTrackingDataAsync();
        return Ok();
    }
}
