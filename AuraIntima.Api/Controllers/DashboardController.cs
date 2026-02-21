using AuraIntima.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AuraIntima.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalProducts = await _context.Products.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var totalCategories = await _context.Categories.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalSales = await _context.Orders.SumAsync(o => o.TotalAmount);
        
        // Calculated Metrics
        var averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        // Top 5 Products by Quantity Sold
        var topProducts = await _context.OrderItems
            .Include(oi => oi.Product)
            .GroupBy(oi => new { oi.ProductId, ProductName = oi.Product!.Name })
            .Select(g => new
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.Name,
                TotalSold = g.Sum(oi => oi.Quantity),
                Revenue = g.Sum(oi => oi.Quantity * oi.UnitPrice)
            })
            .OrderByDescending(x => x.TotalSold)
            .Take(5)
            .ToListAsync();

        // Last 30 Days Sales Trend
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var dailySales = await _context.Orders
            .Where(o => o.CreatedAt >= thirtyDaysAgo)
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Amount = g.Sum(o => o.TotalAmount),
                Count = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return Ok(new
        {
            totalProducts,
            totalUsers,
            totalCategories,
            totalOrders,
            totalSales,
            averageTicket,
            monthlyGrowth = 15.5, // Simulated for now since we don't have enough history
            topProducts,
            dailySales
        });
    }
}
