using AuraIntima.Application.DTOs;
using AuraIntima.Application.Interfaces;
using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Interfaces;
using Mapster;

namespace AuraIntima.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Adapt<IEnumerable<CategoryDto>>();
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category?.Adapt<CategoryDto>();
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var category = dto.Adapt<Category>();
        var created = await _categoryRepository.CreateAsync(category);
        return created.Adapt<CategoryDto>();
    }

    public async Task UpdateCategoryAsync(int id, UpdateCategoryDto dto)
    {
        var existing = await _categoryRepository.GetByIdAsync(id);
        if (existing != null)
        {
            dto.Adapt(existing);
            await _categoryRepository.UpdateAsync(existing);
        }
    }

    public async Task DeleteCategoryAsync(int id)
    {
        await _categoryRepository.DeleteAsync(id);
    }
}
