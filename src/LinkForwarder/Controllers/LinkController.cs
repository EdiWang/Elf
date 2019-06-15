﻿using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace LinkForwarder.Controllers
{
    [Authorize]
    [Route("link")]
    public class LinkController : Controller
    {
        private readonly ILogger<LinkController> _logger;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly AppSettings _appSettings;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;
        private readonly IMemoryCache _cache;

        public LinkController(
            IOptions<AppSettings> settings,
            ILogger<LinkController> logger,
            ITokenGenerator tokenGenerator,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier,
            IMemoryCache cache)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _tokenGenerator = tokenGenerator;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
            _cache = cache;
        }

        [AllowAnonymous]
        [Route(""), Route("/")]
        public IActionResult Index()
        {
            return Content("LinkForwarder Version: " + Utils.AppVersion);
        }

        [AllowAnonymous]
        [Route("/fw/{token}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Forward(string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                {
                    return BadRequest();
                }

                bool isValid = _tokenGenerator.TryParseToken(token, out var validatedToken);
                if (!isValid)
                {
                    return BadRequest();
                }

                if (!_cache.TryGetValue(token, out Link linkEntry))
                {
                    var response = await _linkForwarderService.GetLinkAsync(validatedToken);
                    if (response.IsSuccess)
                    {
                        var link = response.Item;
                        if (null == link)
                        {
                            if (string.IsNullOrWhiteSpace(_appSettings.DefaultRedirectionUrl)) return NotFound();

                            var verifyDefaultRedirectionUrl = _linkVerifier.Verify(_appSettings.DefaultRedirectionUrl, Url, Request);
                            if (verifyDefaultRedirectionUrl == LinkVerifyResult.Valid)
                            {
                                return Redirect(_appSettings.DefaultRedirectionUrl);
                            }

                            throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
                        }

                        if (!link.IsEnabled)
                        {
                            return BadRequest("This link is disabled.");
                        }

                        var verifyOriginUrl = _linkVerifier.Verify(link.OriginUrl, Url, Request);
                        switch (verifyOriginUrl)
                        {
                            case LinkVerifyResult.Valid:
                                // cache valid link entity only.
                                _cache.Set(token, link, TimeSpan.FromHours(1));
                                break;
                            case LinkVerifyResult.InvalidFormat:
                                throw new UriFormatException(
                                    $"OriginUrl '{link.OriginUrl}' is not a valid URL, link ID: {link.Id}.");
                            case LinkVerifyResult.InvalidLocal:
                                _logger.LogWarning($"Local redirection is blocked. link: {JsonConvert.SerializeObject(link)}");
                                return BadRequest("Local redirection is blocked");
                            case LinkVerifyResult.InvalidSelfReference:
                                _logger.LogWarning($"Self reference redirection is blocked. link: {JsonConvert.SerializeObject(link)}");
                                return BadRequest("Self reference redirection is blocked");
                            default:
                                throw new ArgumentOutOfRangeException();
                        }
                    }
                    else
                    {
                        return new StatusCodeResult(StatusCodes.Status500InternalServerError);
                    }
                }

                if (null == linkEntry)
                {
                    linkEntry = _cache.Get<Link>(token);
                }

                var ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var ua = Request.Headers["User-Agent"];
                _ = Task.Run(async () =>
                {
                    await _linkForwarderService.TrackSucessRedirectionAsync(ip, ua, linkEntry.Id);
                });

                return Redirect(linkEntry.OriginUrl);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        #region Management

        [HttpPost]
        [Route("recent-requests")]
        public async Task<IActionResult> RecentRequests()
        {
            var response = await _linkForwarderService.GetRecentRequestsAsync(20);
            if (response.IsSuccess)
            {
                return Json(new { data = response.Item });
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        [Route("manage")]
        public IActionResult Manage()
        {
            return View();
        }

        [HttpPost]
        [Route("list")]
        public async Task<IActionResult> List()
        {
            var response = await _linkForwarderService.GetPagedLinksAsync(1, 10);
            if (response.IsSuccess)
            {
                return Json(new { data = response.Item });
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        [HttpPost]
        [Route("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(LinkEditModel model)
        {
            if (ModelState.IsValid)
            {
                var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request);
                switch (verifyResult)
                {
                    case LinkVerifyResult.InvalidFormat:
                        return BadRequest("Not a valid URL.");
                    case LinkVerifyResult.InvalidLocal:
                        return BadRequest("Can not use local URL.");
                    case LinkVerifyResult.InvalidSelfReference:
                        return BadRequest("Can not use url pointing to this site.");
                }

                var response = await _linkForwarderService.CreateLinkAsync(model.OriginUrl, model.Note, model.IsEnabled);
                return Json(response);
            }
            return BadRequest("Invalid ModelState");
        }

        [Route("get-edit-model/{id}")]
        public async Task<IActionResult> GetEditModel(int id)
        {
            var linkResponse = await _linkForwarderService.GetLinkAsync(id);
            if (!linkResponse.IsSuccess)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            if (null == linkResponse.Item)
            {
                return NotFound();
            }

            var model = new LinkEditModel
            {
                Id = linkResponse.Item.Id,
                Note = linkResponse.Item.Note,
                OriginUrl = linkResponse.Item.OriginUrl,
                IsEnabled = linkResponse.Item.IsEnabled
            };

            return Json(model);
        }

        [HttpPost("edit")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(LinkEditModel model)
        {
            if (ModelState.IsValid)
            {
                var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request);
                switch (verifyResult)
                {
                    case LinkVerifyResult.InvalidFormat:
                        return BadRequest("Not a valid URL.");
                    case LinkVerifyResult.InvalidLocal:
                        return BadRequest("Can not use local URL.");
                    case LinkVerifyResult.InvalidSelfReference:
                        return BadRequest("Can not use url pointing to this site.");
                }

                var response = await _linkForwarderService.EditLinkAsync(model.Id, model.OriginUrl, model.Note, model.IsEnabled);
                if (response.IsSuccess)
                {
                    _cache.Remove(response.Item);
                }
                return Json(response);
            }
            return BadRequest("Invalid ModelState");
        }

        [Route("delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteLink(int linkId)
        {
            var linkResponse = await _linkForwarderService.GetLinkAsync(linkId);
            if (!linkResponse.IsSuccess)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            if (null == linkResponse.Item)
            {
                return BadRequest();
            }

            var response = await _linkForwarderService.DeleteLink(linkId);

            if (response.IsSuccess)
            {
                _cache.Remove(linkResponse.Item);
                return Content(linkId.ToString());
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        #endregion
    }
}