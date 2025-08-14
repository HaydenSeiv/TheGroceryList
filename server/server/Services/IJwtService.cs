using System.Security.Claims;

namespace server.Services;

public interface IJwtService
{
    string GenerateToken(string userId);
    ClaimsPrincipal? ValidateToken(string token);
   string? GetUserIdFromToken(string token);
} 