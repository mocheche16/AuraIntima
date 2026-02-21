using AuraIntima.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AuraIntima.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var logger = serviceProvider.GetRequiredService<ILogger<ApplicationUser>>();
        try
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roles = ["Admin", "User", "Invitado"];
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            const string adminEmail = "admin@auraintima.com";
            if (await userManager.FindByEmailAsync(adminEmail) is null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName  = adminEmail,
                    Email     = adminEmail,
                    FullName  = "Administrador"
                };
                var result = await userManager.CreateAsync(adminUser, "Admin@12345");
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            // Usuario de prueba (rol User)
            const string testEmail = "usuario@auraintima.com";
            if (await userManager.FindByEmailAsync(testEmail) is null)
            {
                var testUser = new ApplicationUser
                {
                    UserName = testEmail,
                    Email    = testEmail,
                    FullName = "Usuario de Prueba"
                };
                var result = await userManager.CreateAsync(testUser, "User@12345");
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(testUser, "User");
            }

            logger.LogInformation("Database seeded successfully.");
        }
        catch (Exception ex)
        {
            logger.LogWarning("Could not connect to DB during seed: {Message}", ex.Message);
        }
    }
}
