using AuraIntima.Application.DTOs;
using AuraIntima.Domain.Common;

namespace AuraIntima.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<PagedResult<ProductDto>> GetPagedProductsAsync(int pageNumber, int pageSize, string? searchTerm, decimal? minPrice, decimal? maxPrice);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task UpdateProductAsync(int id, CreateProductDto dto);
    Task DeleteProductAsync(int id);
}
