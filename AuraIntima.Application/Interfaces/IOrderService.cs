using AuraIntima.Application.DTOs;

namespace AuraIntima.Application.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> GetOrderByIdAsync(int id, string userId, bool isAdmin);
    Task<OrderDto> CreateOrderAsync(CreateOrderDto dto, string userId);
    Task UpdateOrderAsync(int id, UpdateOrderDto dto);
    Task DeleteOrderAsync(int id);
}
