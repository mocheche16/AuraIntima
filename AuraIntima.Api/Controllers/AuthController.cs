using AuraIntima.Application.DTOs;
using AuraIntima.Application.Interfaces;
using AuraIntima.Infrastructure.Identity;
using AuraIntima.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using AuraIntima.Application.DTOs.Auth;

namespace AuraIntima.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IJwtTokenService jwtTokenService)
    {
        _userManager     = userManager;
        _jwtTokenService = jwtTokenService;
    }

    /// <summary>Registra un nuevo usuario y devuelve un JWT para auto-login.</summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email    = dto.Email,
            FullName = dto.FullName
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await _userManager.AddToRoleAsync(user, "User");

        // Generar token para auto-login
        var roles = await _userManager.GetRolesAsync(user);
        var (token, expiresAt) = _jwtTokenService.GenerateToken(user.Id, user.Email!, user.FullName, roles);
        
        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return Ok(new AuthResponseDto
        {
            Token        = token,
            RefreshToken = refreshToken,
            Email        = user.Email!,
            FullName     = user.FullName,
            Roles        = roles,
            ExpiresAt    = expiresAt
        });
    }

    /// <summary>Autentica al usuario y devuelve un JWT.</summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized(new { message = "Credenciales inválidas." });

        var roles = await _userManager.GetRolesAsync(user);
        var (token, expiresAt) = _jwtTokenService.GenerateToken(user.Id, user.Email!, user.FullName, roles);
        
        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return Ok(new AuthResponseDto
        {
            Token        = token,
            RefreshToken = refreshToken,
            Email        = user.Email!,
            FullName     = user.FullName,
            Roles        = roles,
            ExpiresAt    = expiresAt
        });
    }

    /// <summary>Renueva el token JWT usando un Refresh Token.</summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> Refresh([FromBody] TokenRequestDto dto)
    {
        if (dto is null) return BadRequest("Solicitud inválida.");

        var principal = _jwtTokenService.GetPrincipalFromExpiredToken(dto.Token);
        var email = principal.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
        
        if (email is null) return BadRequest("Token inválido.");

        var user = await _userManager.FindByEmailAsync(email);

        if (user is null || user.RefreshToken != dto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return BadRequest("Token de refresco inválido o expirado.");

        var roles = await _userManager.GetRolesAsync(user);
        var (newToken, newExpiresAt) = _jwtTokenService.GenerateToken(user.Id, user.Email!, user.FullName, roles);
        
        var newRefreshToken = _jwtTokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);

        return Ok(new AuthResponseDto
        {
            Token        = newToken,
            RefreshToken = newRefreshToken,
            Email        = user.Email!,
            FullName     = user.FullName,
            Roles        = roles,
            ExpiresAt    = newExpiresAt
        });
    }
}
