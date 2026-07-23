using Elf.Admin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace Elf.Admin.Pages;

public class AccountModel(IOptions<AuthenticationSettings> authSettings) : PageModel
{
    private readonly AuthenticationSettings _authenticationSettings = authSettings.Value;

    public IActionResult OnGet()
    {
        if (_authenticationSettings.Provider != AuthenticationProvider.Local)
        {
            return NotFound();
        }

        return Page();
    }
}
