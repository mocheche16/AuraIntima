using AuraIntima.Domain.Interfaces;

namespace AuraIntima.Domain.Entities;

public class Category : ISoftDelete
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation property
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
