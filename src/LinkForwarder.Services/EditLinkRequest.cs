using System;
using System.Collections.Generic;
using System.Text;

namespace LinkForwarder.Services
{
    public class EditLinkRequest
    {
        public int Id { get; set; }

        public string NewUrl { get; set; }

        public string Note { get; set; }

        public string AkaName { get; set; }

        public bool IsEnabled { get; set; }

        public EditLinkRequest(int id)
        {
            Id = id;
        }
    }
}
