using System.Security.Claims;
using server.DTOs;
namespace server.Services;

public interface IJwtService
{
    //user JWT tokens
    string GenerateToken(string userId);
    ClaimsPrincipal? ValidateToken(string token);
    string? GetUserIdFromToken(string token);

    //password reset JWT tokens
    string GeneratePasswordResetToken(string userId);
    PasswordResetClaims? ValidatePasswordResetToken(string token);
}