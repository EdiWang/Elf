using LinqToDB.Mapping;

namespace Elf.Services.Entities;

[Table(Schema = "dbo", Name = "Link")]
public partial class Link
{
    [PrimaryKey, Identity] public int Id { get; set; } // int
    [PrimaryKey, NotNull] public Guid TenantId { get; set; } // uniqueidentifier
    [Column, Nullable] public string OriginUrl { get; set; } // nvarchar(256)
    [Column, Nullable] public string FwToken { get; set; } // varchar(32)
    [Column, Nullable] public string Note { get; set; } // nvarchar(max)
    [Column, NotNull] public bool IsEnabled { get; set; } // bit
    [Column, NotNull] public DateTime UpdateTimeUtc { get; set; } // datetime
    [Column, Nullable] public string AkaName { get; set; } // varchar(32)
    [Column, Nullable] public int? TTL { get; set; } // int

    #region Associations

    /// <summary>
    /// FK_LinkTracking_Link_BackReference
    /// </summary>
    [Association(ThisKey = "Id", OtherKey = "LinkId", CanBeNull = true, Relationship = Relationship.OneToMany, IsBackReference = true)]
    public IEnumerable<LinkTracking> LinkTrackings { get; set; }

    #endregion
}