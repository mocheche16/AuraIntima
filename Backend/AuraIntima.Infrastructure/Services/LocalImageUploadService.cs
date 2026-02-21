using AuraIntima.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace AuraIntima.Infrastructure.Services;

public class LocalImageUploadService : IImageUploadService
{
    private readonly IWebHostEnvironment _env;

    public LocalImageUploadService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName)
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        return $"/images/products/{uniqueFileName}";
    }
}
