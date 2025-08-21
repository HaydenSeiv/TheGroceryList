using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            Console.WriteLine("Attempting to log user in");
            var result = await _userService.LoginAsync(loginDto);
            Console.WriteLine($"log in Result: {result}");

            // Set HTTP-only cookie (equivalent to Go's cookie setting)
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(24),
                SameSite = SameSiteMode.Strict,
                Secure = true // Set to false for development if not using HTTPS
            };

            Response.Cookies.Append("jwt", result!.Token, cookieOptions);

            Console.WriteLine("Login Success");
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            Console.WriteLine("Login Failed: UnauthorizedAccessException --" + ex.Message);
            return BadRequest(new ApiResponse
            {
                Success = false,
                Message = ex.Message,
                Error = new Dictionary<string, object>()
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine("Login Failed " + ex.Message);
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Internal server error",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
    }

    [HttpGet("login/userauth")]
    public async Task<ActionResult<UserResponseDto>> ValidateUserAuth()
    {
        try
        {
            var token = GetTokenFromRequest();
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "No authentication token provided",
                    Error = new Dictionary<string, object>()
                });
            }

            var user = await _userService.GetAuthenticatedUserAsync(token);
            if (user == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid or expired token",
                    Error = new Dictionary<string, object>()
                });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Internal server error",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
    }

    [HttpPost("logout")]
    public ActionResult Logout()
    {
        try
        {
            // Clear the JWT cookie (equivalent to Go's logout)
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(-1), // Expire the cookie
                SameSite = SameSiteMode.Strict
            };

            Response.Cookies.Append("jwt", "", cookieOptions);

            return Ok(new ApiResponse { Success = true, Message = "success" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Internal server error",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
    }
    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        // 1. Find user by email

        var user = await _userService.GetUserByEmailAsync(dto.Email.ToLowerInvariant());

        if (user == null)
        {
            return BadRequest(new ApiResponse { Success = false, Message = "User not found" });
        }

        // 2. Generate JWT reset token (not stored in DB!)
        var token = _jwtService.GeneratePasswordResetToken(user.Id);


        // TODO: Send email with JWT token in URL
        // 3. Send email with JWT token in URL


        // 4. Always return success (security best practice)
        return Ok(new ApiResponse { Success = true, Message = "Password reset email sent" });

    }

    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        // 1. Validate JWT token
        // 2. Extract user ID from token claims
        // 3. Update password in database
        // 4. Token automatically becomes invalid after expiration
    }

    private string? GetTokenFromRequest()
    {
        // Check cookie first
        if (Request.Cookies.TryGetValue("jwt", out var cookieToken) && !string.IsNullOrEmpty(cookieToken))
        {
            return cookieToken;
        }

        // Check Authorization header
        var authHeader = Request.Headers["Authorization"].ToString();
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            return authHeader.Substring("Bearer ".Length);
        }

        return null;
    }
}