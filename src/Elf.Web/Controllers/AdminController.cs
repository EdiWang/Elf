using System.Threading.Tasks;
using Elf.MultiTenancy;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.Models;
using Elf.Web.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.FeatureManagement;

namespace Elf.Web.Controllers
{
    [Authorize]
    [Route("admin")]
    public class AdminController : Controller
    {
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;
        private readonly IMemoryCache _cache;
        private readonly IFeatureManager _featureManager;
        private readonly Tenant _tenant;

        public AdminController(
            ITenantAccessor<Tenant> tenantAccessor,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier,
            IMemoryCache cache,
            IFeatureManager featureManager)
        {
            _tenant = tenantAccessor.Tenant;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
            _cache = cache;
            _featureManager = featureManager;
        }

        #region Authentication

        [HttpGet("signin")]
        [AllowAnonymous]
        public IActionResult SignIn()
        {
            var redirectUrl = Url.Page("/Admin");
            return Challenge(
                new AuthenticationProperties { RedirectUri = redirectUrl },
                OpenIdConnectDefaults.AuthenticationScheme);
        }

        [HttpGet("signout")]
        public IActionResult SignOut(int nounce = 1055)
        {
            var callbackUrl = Url.Action(nameof(SignedOut), "Admin", values: null, protocol: Request.Scheme);
            return SignOut(
                new AuthenticationProperties { RedirectUri = callbackUrl },
                CookieAuthenticationDefaults.AuthenticationScheme,
                OpenIdConnectDefaults.AuthenticationScheme);
        }

        [HttpGet("signedout")]
        [AllowAnonymous]
        public IActionResult SignedOut()
        {
            return Redirect("/");
        }

        [AllowAnonymous]
        [HttpGet("accessdenied")]
        public IActionResult AccessDenied()
        {
            return Forbid();
        }

        #endregion

        [HttpPost]
        [Route("list")]
        public async Task<IActionResult> List(DataTableRequest model)
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
            return Json(jqdtResponse);
        }

        [HttpPost]
        [Route("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(LinkEditModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

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
            return Json(response);
        }

        [Route("get-edit-model/{id:int}")]
        public async Task<IActionResult> GetEditModel(int id)
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

            return Json(model);
        }

        [HttpPost("edit")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(LinkEditModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

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

            var editRequest = new EditLinkRequest(model.Id)
            {
                NewUrl = model.OriginUrl,
                Note = model.Note,
                AkaName = string.IsNullOrWhiteSpace(model.AkaName) ? null : model.AkaName,
                IsEnabled = model.IsEnabled,
                TTL = model.TTL
            };

            var token = await _linkForwarderService.EditLinkAsync(editRequest);
            if (token is not null) _cache.Remove(token);
            return Json(token);
        }
    }
}
