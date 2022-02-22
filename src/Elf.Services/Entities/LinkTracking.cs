using LinqToDB.Mapping;

namespace Elf.Services.Entities;

[Table(Schema = "dbo", Name = "LinkTracking")]
public partial class LinkTracking
{
    [PrimaryKey, NotNull] public Guid Id { get; set; } = Guid.NewGuid(); // uniqueidentifier
    [PrimaryKey, NotNull] public Guid TenantId { get; set; } // uniqueidentifier
    [Column, NotNull] public int LinkId { get; set; } // int
    [Column, Nullable] public string UserAgent { get; set; } // nvarchar(256)
    [Column, Nullable] public string IpAddress { get; set; } // varchar(64)
    [Column, NotNull] public DateTime RequestTimeUtc { get; set; } // datetime

    #region Associations

    /// <summary>
    /// FK_LinkTracking_Link
    /// </summary>
    [Association(ThisKey = "LinkId", OtherKey = "Id", CanBeNull = false, Relationship = Relationship.ManyToOne, KeyName = "FK_LinkTracking_Link", BackReferenceName = "LinkTrackings")]
    public Link Link { get; set; }

    #endregion
}