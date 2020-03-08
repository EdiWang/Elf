using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Elf.Web.Models
{
    public class LinkEditModel
    {
        [HiddenInput]
        public int Id { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(256)]
        [DataType(DataType.Url)]
        [Display(Name = "Origin Url")]
        public string OriginUrl { get; set; }

        [Display(Name = "Note")]
        public string Note { get; set; }

        [Display(Name = "Aka")]
        [MaxLength(32)]
        [RegularExpression("(?!-)([a-z0-9-]+)",
            ErrorMessage = "Aka can only accept lower case English letters (a-z) and numbers (0-9) with/out hyphen (-) in middle.")]
        public string AkaName { get; set; }

        [Required]
        [Display(Name = "Enable")]
        public bool IsEnabled { get; set; }

        [Display(Name = "TTL (seconds)")]
        [Range(0, 24 * 60 * 60)]
        public int TTL { get; set; }

        public LinkEditModel()
        {
            TTL = 3600;
        }
    }
}
