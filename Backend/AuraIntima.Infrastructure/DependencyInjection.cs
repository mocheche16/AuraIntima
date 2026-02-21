using AuraIntima.Domain.Interfaces;
using AuraIntima.Application.Interfaces;
using AuraIntima.Infrastructure.Data;
using AuraIntima.Infrastructure.Identity;
using AuraIntima.Infrastructure.Repositories;
using AuraIntima.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mapster;

namespace AuraIntima.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // EF Core + MySQL (Pomelo)
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 31))));

        // ASP.NET Core Identity
        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // Mapster
        services.AddMapster();

        // ───────────────────────────────────────────
        // Repositories
        // ───────────────────────────────────────────
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();

        // ───────────────────────────────────────────
        // Services
        // ───────────────────────────────────────────
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IImageUploadService, LocalImageUploadService>();

        return services;
    }
}
