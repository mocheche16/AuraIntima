using AuraIntima.Application.DTOs;
using AuraIntima.Application.Interfaces;
using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Interfaces;
using Mapster;

namespace AuraIntima.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return orders.Select(o => new OrderDto
        {
            Id = o.Id,
            UserId = o.UserId,
            TotalAmount = o.TotalAmount,
            ShippingAddress = o.ShippingAddress,
            CreatedAt = o.CreatedAt,
            OrderItems = o.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? "Producto Desconocido",
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity
            }).ToList()
        });
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id, string userId, bool isAdmin)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) return null;

        if (!isAdmin && order.UserId != userId) return null;

        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            ShippingAddress = order.ShippingAddress,
            CreatedAt = order.CreatedAt,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? "Producto Desconocido",
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity
            }).ToList()
        };
    }

    public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto, string userId)
    {
        var order = new Order
        {
            UserId = userId,
            ShippingAddress = dto.ShippingAddress,
            CreatedAt = DateTime.UtcNow,
            OrderItems = dto.OrderItems.Select(oi => new OrderItem
            {
                ProductId = oi.ProductId,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity
            }).ToList()
        };

        order.TotalAmount = order.OrderItems.Sum(oi => oi.UnitPrice * oi.Quantity);

        var created = await _orderRepository.CreateAsync(order);
        
        // Return DTO (Refetch or simple manual map)
        return await GetOrderByIdAsync(created.Id, userId, true) ?? new OrderDto();
    }

    public async Task UpdateOrderAsync(int id, UpdateOrderDto dto)
    {
        var existing = await _orderRepository.GetByIdAsync(id);
        if (existing != null)
        {
            dto.Adapt(existing);
            await _orderRepository.UpdateAsync(existing);
        }
    }

    public async Task DeleteOrderAsync(int id)
    {
        await _orderRepository.DeleteAsync(id);
    }
}
