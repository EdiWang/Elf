using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Elf.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Elf.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LinkController : ControllerBase
    {
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly IMemoryCache _cache;

        public LinkController(ILinkForwarderService linkForwarderService, IMemoryCache cache)
        {
            _linkForwarderService = linkForwarderService;
            _cache = cache;
        }

        [Route("{linkId:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int linkId)
        {
            var link = await _linkForwarderService.GetLinkAsync(linkId);
            if (link is null) return BadRequest();

            await _linkForwarderService.DeleteLink(linkId);

            _cache.Remove(link);
            return Content(linkId.ToString());
        }
    }
}
