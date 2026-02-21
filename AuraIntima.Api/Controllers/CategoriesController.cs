using AuraIntima.Application.DTOs;
using AuraIntima.Application.Interfaces;
using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuraIntima.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>Obtiene todas las categorías. Accesible para cualquier usuario.</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var dtos = await _categoryService.GetAllCategoriesAsync();
        return Ok(dtos);
    }

    /// <summary>Obtiene una categoría por ID. Accesible para cualquier usuario.</summary>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var dto = await _categoryService.GetCategoryByIdAsync(id);
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    /// <summary>Crea una nueva categoría. Solo para Admins.</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var created = await _categoryService.CreateCategoryAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Actualiza una categoría existente. Solo para Admins.</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        await _categoryService.UpdateCategoryAsync(id, dto);
        return NoContent();
    }

    /// <summary>Elimina una categoría. Solo para Admins.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _categoryService.DeleteCategoryAsync(id);
        return NoContent();
    }
}
