namespace Elf.Api.Data;

public class LinkTagEntity
{
    public int LinkId { get; set; }
    public int TagId { get; set; }

    public virtual LinkEntity Link { get; set; }
    public virtual TagEntity Tag { get; set; }
}