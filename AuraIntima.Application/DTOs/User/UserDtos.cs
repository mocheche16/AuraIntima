using System.Collections.Generic;

namespace AuraIntima.Application.DTOs.User;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public IList<string> Roles { get; set; } = new List<string>();
}

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Password { get; set; } // Opcional
    public List<string> Roles { get; set; } = new List<string>();
}

public class CreateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new List<string>();
}
