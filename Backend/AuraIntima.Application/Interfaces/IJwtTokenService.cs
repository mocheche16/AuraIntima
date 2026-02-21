namespace AuraIntima.Application.Interfaces;

/// <summary>Contrato para el servicio de generación de tokens JWT.</summary>
public interface IJwtTokenService
{
    (string token, DateTime expiresAt) GenerateToken(
        string userId,
        string email,
        string fullName,
        IList<string> roles);

    string GenerateRefreshToken();
    System.Security.Claims.ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
