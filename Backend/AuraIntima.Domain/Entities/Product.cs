using AuraIntima.Domain.Interfaces;

namespace AuraIntima.Domain.Entities;

public class Product : ISoftDelete
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsAdultOnly { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Foreign Key
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}
