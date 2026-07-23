using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Models;

public class UpdateLocalAccountRequest : IValidatableObject
{
    [Required]
    [MinLength(2)]
    [MaxLength(64)]
    public string Username { get; set; }

    [Required]
    [MinLength(8)]
    [MaxLength(128)]
    public string CurrentPassword { get; set; }

    [MaxLength(128)]
    public string NewPassword { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!string.IsNullOrWhiteSpace(NewPassword) && NewPassword.Length < 8)
        {
            yield return new("NewPassword must be at least 8 characters.", [nameof(NewPassword)]);
        }
    }
}
