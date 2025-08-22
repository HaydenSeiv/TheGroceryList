using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using server.Configuration;
using server.DTOs;

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
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
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
            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            return principal;
        }
        catch
        {
            return null;
        }
    }

    public string? GetUserIdFromToken(string token)
    {
        var principal = ValidateToken(token);
        return principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    //password reset JWT tokens
    public string GeneratePasswordResetToken(string userId)
    {
        var claims = new[]
        {
            //user claims
            new Claim(ClaimTypes.NameIdentifier, userId), //user id for identity
            //new Claim(ClaimTypes.Email, email), //user email - probably do not want to store this in the token for privacy reasons
            new Claim("tokenType", "passwordReset"),
            new Claim("nonce", Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Exp,
                new DateTimeOffset(DateTime.UtcNow.AddMinutes(15)).ToUnixTimeSeconds().ToString()), //expiry time, 15 minutes
            new Claim(JwtRegisteredClaimNames.Iat,
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString()), // record current time
            
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: credentials

        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public PasswordResetClaims? ValidatePasswordResetToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidAudience = _jwtSettings.Audience,
                IssuerSigningKey = _key,
                ClockSkew = TimeSpan.FromSeconds(5) //allow time difference between server and client
            };


            //validate token
            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            var claims = principal.Claims.ToDictionary(c => c.Type, c => c.Value); //convert claims to dictionary for easy lookup

            // Verify this is actually a password reset token
            if (!claims.ContainsKey("tokenType") || claims["tokenType"] != "passwordReset")
            {
                return null;
            }

            // Verify required claims exist
            if (!claims.ContainsKey(ClaimTypes.NameIdentifier) ||
                !claims.ContainsKey(ClaimTypes.Email))
            {
                return null;
            }

            // TODO: Add blacklist check
            // if (await IsTokenBlacklisted(claims["nonce"]))
            // {
            //     return null;
            // }


            return new PasswordResetClaims { UserId = claims[ClaimTypes.NameIdentifier], Email = claims[ClaimTypes.Email], Expiration = validatedToken.ValidTo };

        }
        catch (SecurityTokenExpiredException)
        {
            // Token expired - this is expected behavior
            return null;
        }
        catch (SecurityTokenValidationException)
        {
            // Invalid signature, wrong issuer/audience, etc.
            return null;
        }
        catch (Exception)
        {
            // Malformed token, parsing errors, etc.
            return null;
        }

    }

}