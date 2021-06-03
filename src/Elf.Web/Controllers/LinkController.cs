using System.Threading.Tasks;
using Elf.MultiTenancy;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.Models;
using Elf.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.FeatureManagement;

namespace Elf.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LinkController : ControllerBase
    {
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;
        private readonly IMemoryCache _cache;
        private readonly IFeatureManager _featureManager;
        private readonly Tenant _tenant;

        public LinkController(
            ITenantAccessor<Tenant> tenantAccessor,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier,
            IMemoryCache cache,
            IFeatureManager featureManager)
        {
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
            _cache = cache;
            _featureManager = featureManager;

            _tenant = tenantAccessor.Tenant;
        }

        [HttpPost]
        [Route("create")]
        [ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create(LinkEditModel model)
        {
            var flag = await _featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
            var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request, flag);
            switch (verifyResult)
            {
                case LinkVerifyResult.InvalidFormat:
                    return BadRequest("Not a valid URL.");
                case LinkVerifyResult.InvalidLocal:
                    return BadRequest("Can not use local URL.");
                case LinkVerifyResult.InvalidSelfReference:
                    return BadRequest("Can not use url pointing to this site.");
            }

            var createLinkRequest = new CreateLinkRequest
            {
                OriginUrl = model.OriginUrl,
                Note = model.Note,
                AkaName = string.IsNullOrWhiteSpace(model.AkaName) ? null : model.AkaName,
                IsEnabled = model.IsEnabled,
                TTL = model.TTL,
                TenantId = _tenant.Id
            };

            var response = await _linkForwarderService.CreateLinkAsync(createLinkRequest);
            return Ok(response);
        }

        [HttpPut("{linkId:int}")]
        [ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Edit(int linkId, LinkEditModel model)
        {
            var flag = await _featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
            var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request, flag);
            switch (verifyResult)
            {
                case LinkVerifyResult.InvalidFormat:
                    return BadRequest("Not a valid URL.");
                case LinkVerifyResult.InvalidLocal:
                    return BadRequest("Can not use local URL.");
                case LinkVerifyResult.InvalidSelfReference:
                    return BadRequest("Can not use url pointing to this site.");
            }

            var editRequest = new EditLinkRequest(linkId)
            {
                NewUrl = model.OriginUrl,
                Note = model.Note,
                AkaName = string.IsNullOrWhiteSpace(model.AkaName) ? null : model.AkaName,
                IsEnabled = model.IsEnabled,
                TTL = model.TTL
            };

            var token = await _linkForwarderService.EditLinkAsync(editRequest);
            if (token is not null) _cache.Remove(token);
            return Ok(token);
        }

        [HttpPost]
        [Route("list")]
        [ProducesResponseType(typeof(JqDataTableResponse<Link>), StatusCodes.Status200OK)]
        public async Task<IActionResult> List([FromForm] DataTableRequest model)
        {
            var searchBy = model.Search?.Value;
            var take = model.Length;
            var offset = model.Start;

            var links = await _linkForwarderService.GetPagedLinksAsync(offset, take, searchBy);
            var jqdtResponse = new JqDataTableResponse<Link>
            {
                Draw = model.Draw,
                RecordsFiltered = links.TotalRows,
                RecordsTotal = links.TotalRows,
                Data = links.Links
            };
            return Ok(jqdtResponse);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(LinkEditModel), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get(int id)
        {
            var link = await _linkForwarderService.GetLinkAsync(id);
            if (link is null) return NotFound();

            var model = new LinkEditModel
            {
                Id = link.Id,
                Note = link.Note,
                AkaName = link.AkaName,
                OriginUrl = link.OriginUrl,
                IsEnabled = link.IsEnabled,
                TTL = link.TTL ?? 0
            };

            return Ok(model);
        }

        [HttpDelete("{linkId:int}")]
        [ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(LinkEditModel), StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(int linkId)
        {
            var link = await _linkForwarderService.GetLinkAsync(linkId);
            if (link is null) return BadRequest();

            await _linkForwarderService.DeleteLink(linkId);

            _cache.Remove(link);
            return Ok();
        }
    }
}
