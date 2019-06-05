using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LinkForwarder.Controllers
{
    [Authorize]
    public class AdminController : Controller
    {
        private readonly ILogger<AdminController> _logger;
        private readonly IConfiguration _configuration;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly AppSettings _appSettings;

        private IDbConnection DbConnection => new SqlConnection(_configuration.GetConnectionString("LinkForwarderDatabase"));

        public AdminController(
            IOptions<AppSettings> settings,
            ILogger<AdminController> logger, 
            IConfiguration configuration, 
            ITokenGenerator tokenGenerator)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _configuration = configuration;
            _tokenGenerator = tokenGenerator;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
