namespace AuraIntima.Application.Interfaces;

public interface IImageUploadService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName);
}
