using System.ComponentModel.DataAnnotations;

namespace AuraIntima.Application.DTOs;

public class CreateProductDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0.")]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    public string? ImageUrl { get; set; }
    public bool IsAdultOnly { get; set; }

    [Required]
    public int CategoryId { get; set; }
}
