using AuraIntima.Application.DTOs;
using AuraIntima.Application.DTOs.Auth;
using AuraIntima.Application.Interfaces;
using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuraIntima.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>Obtiene todas las órdenes. Solo para Admins.</summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
    {
        var dtos = await _orderService.GetAllOrdersAsync();
        return Ok(dtos);
    }

    /// <summary>Obtiene una orden por ID. Admin o el propio usuario.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        var isAdmin = User.IsInRole("Admin");

        var dto = await _orderService.GetOrderByIdAsync(id, userId, isAdmin);
        
        if (dto is null) return NotFound();

        return Ok(dto);
    }

    /// <summary>Crea una nueva orden. Soporta usuarios anónimos para simulación.</summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<OrderDto>> Create([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "GUEST";
        var created = await _orderService.CreateOrderAsync(dto, userId);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Actualiza una orden existente. Solo para Admins.</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateOrderDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        await _orderService.UpdateOrderAsync(id, dto);
        return NoContent();
    }

    /// <summary>Elimina una orden. Solo para Admins.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _orderService.DeleteOrderAsync(id);
        return NoContent();
    }
}
