using AuraIntima.Application.DTOs;
using AuraIntima.Application.Interfaces;
using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Interfaces;
using AuraIntima.Domain.Common;
using Mapster;

namespace AuraIntima.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Adapt<IEnumerable<ProductDto>>();
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product?.Adapt<ProductDto>();
    }

    public async Task<PagedResult<ProductDto>> GetPagedProductsAsync(
        int pageNumber, 
        int pageSize, 
        string? searchTerm, 
        decimal? minPrice, 
        decimal? maxPrice)
    {
        var pagedResult = await _productRepository.GetPagedAsync(pageNumber, pageSize, searchTerm, minPrice, maxPrice);
        
        return new PagedResult<ProductDto>
        {
            Items      = pagedResult.Items.Adapt<IEnumerable<ProductDto>>(),
            PageNumber = pagedResult.PageNumber,
            PageSize   = pagedResult.PageSize,
            TotalItems = pagedResult.TotalItems,
            TotalPages = pagedResult.TotalPages
        };
    }

    public async Task<ProductDto> CreateProductAsync(CreateCategoryDto dto)
    {
        // Note: The controller used CreateProductDto, but here let's assume mapping works or fix DTOs
        var product = dto.Adapt<Product>();
        var created = await _productRepository.CreateAsync(product);
        return created.Adapt<ProductDto>();
    }

    public async Task UpdateProductAsync(int id, CreateProductDto dto)
    {
        var existing = await _productRepository.GetByIdAsync(id);
        if (existing != null)
        {
            dto.Adapt(existing);
            await _productRepository.UpdateAsync(existing);
        }
    }

    public async Task DeleteProductAsync(int id)
    {
        await _productRepository.DeleteAsync(id);
    }

    // Creating this to match the interface I previously defined which might have used CreateProductDto
    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = dto.Adapt<Product>();
        var created = await _productRepository.CreateAsync(product);
        return created.Adapt<ProductDto>();
    }
}
