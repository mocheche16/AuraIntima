using AuraIntima.Application.DTOs;
using AuraIntima.Application.Interfaces;
using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Interfaces;
using AuraIntima.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuraIntima.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IImageUploadService _imageUploadService;

    public ProductsController(IProductService productService, IImageUploadService imageUploadService)
    {
        _productService = productService;
        _imageUploadService = imageUploadService;
    }

    /// <summary>Sube una imagen para un producto.</summary>
    [HttpPost("upload-image")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("Archivo no proporcionado.");

        var imageUrl = await _imageUploadService.UploadImageAsync(file.OpenReadStream(), file.FileName);
        return Ok(new { imageUrl });
    }

    /// <summary>Obtiene todos los productos. Accesible para cualquier usuario.</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
    {
        var dtos = await _productService.GetAllProductsAsync();
        return Ok(dtos);
    }

    /// <summary>Obtiene una lista paginada de productos con filtros.</summary>
    [HttpGet("paged")]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetPaged(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null)
    {
        var result = await _productService.GetPagedProductsAsync(pageNumber, pageSize, search, minPrice, maxPrice);
        return Ok(result);
    }

    /// <summary>Obtiene un producto por ID. Accesible para cualquier usuario.</summary>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var dto = await _productService.GetProductByIdAsync(id);
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    /// <summary>Crea un nuevo producto. Solo para Admins.</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var created = await _productService.CreateProductAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Actualiza un producto existente. Solo para Admins.</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        await _productService.UpdateProductAsync(id, dto);
        return NoContent();
    }

    /// <summary>Elimina un producto. Solo para Admins.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _productService.DeleteProductAsync(id);
        return NoContent();
    }
}
