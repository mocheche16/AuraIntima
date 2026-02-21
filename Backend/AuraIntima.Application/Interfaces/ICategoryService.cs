using AuraIntima.Application.DTOs;

namespace AuraIntima.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
    Task<CategoryDto?> GetCategoryByIdAsync(int id);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
    Task UpdateCategoryAsync(int id, UpdateCategoryDto dto);
    Task DeleteCategoryAsync(int id);
}
