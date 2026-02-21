using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Common;

namespace AuraIntima.Domain.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<PagedResult<Product>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm, decimal? minPrice, decimal? maxPrice);
    Task<Product?> GetByIdAsync(int id);
    Task<Product> CreateAsync(Product product);
    Task<Product> UpdateAsync(Product product);
    Task DeleteAsync(int id);
}
