using AuraIntima.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AuraIntima.Infrastructure.Data;

public static class DbInitializer
{
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            // Categories
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category { Name = "Lencería" },
                    new Category { Name = "Accesorios" },
                    new Category { Name = "Cuidado Personal" }
                );
                await context.SaveChangesAsync();
            }

            // Products
            if (!context.Products.Any())
            {
                var lenceria = context.Categories.First(c => c.Name == "Lencería");
                var accesorios = context.Categories.First(c => c.Name == "Accesorios");
                var cuidado = context.Categories.First(c => c.Name == "Cuidado Personal");

                context.Products.AddRange(
                    new Product 
                    { 
                        Name = "Conjunto de Encaje Aura", 
                        Description = "Elegante conjunto de encaje negro con detalles dorados.", 
                        Price = 45.99m, 
                        Stock = 20, 
                        ImageUrl = "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=500", 
                        CategoryId = lenceria.Id,
                        IsAdultOnly = true
                    },
                    new Product 
                    { 
                        Name = "Bata de Seda Nocturna", 
                        Description = "Suave bata de seda color vino para noches especiales.", 
                        Price = 59.99m, 
                        Stock = 15, 
                        ImageUrl = "https://images.unsplash.com/photo-1616422285623-13ff0167295c?q=80&w=500", 
                        CategoryId = lenceria.Id,
                        IsAdultOnly = false
                    },
                    new Product 
                    { 
                        Name = "Aceite de Masaje Relajante", 
                        Description = "Aceite con esencia de lavanda y jazmín.", 
                        Price = 18.50m, 
                        Stock = 50, 
                        ImageUrl = "https://images.unsplash.com/photo-1620916566398-39f114387c9b?q=80&w=500", 
                        CategoryId = cuidado.Id,
                        IsAdultOnly = false
                    },
                    new Product 
                    { 
                        Name = "Vela Aromática Sensual", 
                        Description = "Vela de soya con aroma a vainilla y ámbar.", 
                        Price = 12.00m, 
                        Stock = 30, 
                        ImageUrl = "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500", 
                        CategoryId = cuidado.Id,
                        IsAdultOnly = false
                    },
                    new Product 
                    { 
                        Name = "Antifaz de Satén Negro", 
                        Description = "Antifaz suave para un descanso profundo y elegante.", 
                        Price = 9.99m, 
                        Stock = 100, 
                        ImageUrl = "https://images.unsplash.com/photo-1605342084224-d2e8250280eb?q=80&w=500", 
                        CategoryId = accesorios.Id,
                        IsAdultOnly = false
                    }
                );
                await context.SaveChangesAsync();
            }

            logger.LogInformation("Database seeded successfully with products.");
        }
        catch (Exception ex)
        {
            logger.LogWarning("Could not connect to DB during seed: {Message}", ex.Message);
        }
    }
}
