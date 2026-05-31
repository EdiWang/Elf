using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Models;

public class DateRangeRequest : IValidatableObject
{
    [Required]
    public DateTime StartDateUtc { get; set; } = DateTime.UtcNow.Date;

    [Required]
    public DateTime EndDateUtc { get; set; } = DateTime.UtcNow.Date;

    public DateTime StartDateInclusiveUtc => StartDateUtc.Date;

    public DateTime EndDateExclusiveUtc => EndDateUtc.Date.AddDays(1);

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDateUtc < StartDateUtc)
        {
            yield return new("EndDateUtc must be greater than StartDateUtc", new[] { nameof(StartDateUtc), nameof(EndDateUtc) });
        }
    }
}