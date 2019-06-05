using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LinkForwarder.Models
{
    public class LinkEditModel
    {
        [HiddenInput]
        public int Id { get;}

        [Required]
        [MinLength(1)]
        [MaxLength(256)]
        [DataType(DataType.Url)]
        [Display(Name = "Origin Url")]
        public string OriginUrl { get; set; }

        [Display(Name = "Forward Token")]
        public string FwToken { get; }

        [Display(Name = "Note")]
        public string Note { get; set; }

        [Required]
        [Display(Name = "Enable")]
        public bool IsEnabled { get; set; }

        public LinkEditModel()
        {
            
        }

        public LinkEditModel(int id, string fwToken)
        {
            Id = id;
            FwToken = fwToken;
        }
    }
}
