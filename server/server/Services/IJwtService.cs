using System.Security.Claims;

namespace server.Services;

public interface IJwtService
{
    //user JWT tokens
    string GenerateToken(string userId);
    ClaimsPrincipal? ValidateToken(string token);
    string? GetUserIdFromToken(string token);

    //password reset JWT tokens
    string GeneratePasswordResetToken(string userId, string email);
    PasswordResetClaims? ValidatePasswordResetToken(string token);
}