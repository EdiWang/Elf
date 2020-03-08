namespace Elf.Services.Models
{
    public class EditLinkRequest
    {
        public int Id { get; set; }

        public string NewUrl { get; set; }

        public string Note { get; set; }

        public string AkaName { get; set; }

        public bool IsEnabled { get; set; }

        public int TTL { get; set; }

        public EditLinkRequest(int id)
        {
            Id = id;
        }
    }
}
