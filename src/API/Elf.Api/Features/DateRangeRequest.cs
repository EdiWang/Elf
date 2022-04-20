using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Features;

public class DateRangeRequest : IValidatableObject
{
    [Required]
    public DateTime StartDateUtc { get; set; }

    [Required]
    public DateTime EndDateUtc { get; set; }

    public DateRangeRequest()
    {
        StartDateUtc = DateTime.UtcNow.Date;
        EndDateUtc = DateTime.UtcNow.Date;
    }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDateUtc < StartDateUtc)
        {
            yield return new("EndDateUtc must be greater than StartDateUtc", new[] { nameof(StartDateUtc), nameof(EndDateUtc) });
        }
    }
}