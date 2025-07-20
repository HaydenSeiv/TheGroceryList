using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using server.Configuration;

namespace server.Services;

public class JwtService : IJwtService
{
    private readonly JwtSettings _jwtSettings;
    private readonly SymmetricSecurityKey _key;

    public JwtService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
    }

    public string GenerateToken(string userId)
    {
        Console.WriteLine("Inside GenerateToken: " + userId);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Iss, _jwtSettings.Issuer),
            new Claim(JwtRegisteredClaimNames.Aud, _jwtSettings.Audience),
            new Claim(JwtRegisteredClaimNames.Exp, 
                new DateTimeOffset(DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours)).ToUnixTimeSeconds().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, 
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString())
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        Console.WriteLine("ValidateToken called");
        try
        {
            Console.WriteLine("Try block entered");
            var tokenHandler = new JwtSecurityTokenHandler();
            Console.WriteLine("TokenHandler created");
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidAudience = _jwtSettings.Audience,
                IssuerSigningKey = _key,
                ClockSkew = TimeSpan.FromSeconds(5)
            };
            Console.WriteLine("ValidationParameters created");
            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            Console.WriteLine("Principal created");
            return principal;
        }
        catch
        {
            Console.WriteLine("Exception caught");
            return null;
        }
    }

    public string? GetUserIdFromToken(string token)
    {
        Console.WriteLine("GetUserIdFromToken called");
        var principal = ValidateToken(token);
        Console.WriteLine($"Principal: {principal}");
        // Debug: Print all available claims
        Console.WriteLine("Available claims in token:");
        if (principal?.Claims != null)
        {
            foreach (var claim in principal.Claims)
            {
                Console.WriteLine($"   Type: '{claim.Type}' | Value: '{claim.Value}'");
            }
        }
        else
        {
            Console.WriteLine("No claims found in principal");
        }

        // Debug: Specifically check for Sub claim
        var subClaim = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"Sub claim found: {subClaim != null}");
        if (subClaim != null)
        {
            Console.WriteLine($"Sub claim value: '{subClaim}'");
        }

        // Check what JwtRegisteredClaimNames.Sub actually is
        Console.WriteLine($"JwtRegisteredClaimNames.Sub = '{JwtRegisteredClaimNames.Sub}'");
        var userId = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"UserId from Sub claim: {userId}");
        return userId;
    }
} 