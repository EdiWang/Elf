using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Models;

public class ResetLocalAuthenticatorRequest
{
    [Required]
    [MinLength(8)]
    [MaxLength(128)]
    public string CurrentPassword { get; set; }
}
