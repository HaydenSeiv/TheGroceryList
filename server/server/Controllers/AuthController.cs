using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;
    private readonly IJwtService _jwtService;

    public AuthController(IUserService userService, IEmailService emailService, IJwtService jwtService)
    {
        _userService = userService;
        _emailService = emailService;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            Console.WriteLine("Attempting to log user in");
            var result = await _userService.LoginAsync(loginDto);
            Console.WriteLine($"log in Result: {result}");

            // Set HTTP-only cookie 
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
            // Clear the JWT cookie 
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
        Console.WriteLine("Inside Forgot Password");
        Console.WriteLine(dto.Email);

        var user = await _userService.GetUserByEmailAsync(dto.Email.ToLowerInvariant());

        if (user == null)
        {
            return BadRequest(new ApiResponse { Success = false, Message = "User not found" });
        }
        Console.WriteLine("User found");

        // 2. Generate JWT reset token
        var token = _jwtService.GeneratePasswordResetToken(user.Id);

        Console.WriteLine("Token generated");
        Console.WriteLine(token);

        // 3. Send email with JWT token in URL
        var emailResponse = await _emailService.SendPasswordResetEmail(dto.Email, token);
        Console.WriteLine("Email sent");
        Console.WriteLine("Content: " + emailResponse.Content);
        Console.WriteLine("Statuse code: " + emailResponse.StatusCode);
        Console.WriteLine("Error Message: " + emailResponse.ErrorMessage);
        Console.WriteLine("Status Description: " + emailResponse.StatusDescription);
        Console.WriteLine("Response: " + emailResponse.ResponseStatus);
        Console.WriteLine("Response URL: " + emailResponse.ResponseUri);
        Console.WriteLine("Response Headers: " + emailResponse.Headers);
        Console.WriteLine("Response Cookies: " + emailResponse.Cookies);
        Console.WriteLine("Response Content: " + emailResponse.Content);
        Console.WriteLine("Response Status Code: " + emailResponse.StatusCode);
        Console.WriteLine("Response Status Description: " + emailResponse.StatusDescription);
        Console.WriteLine("Response Response Status: " + emailResponse.ResponseStatus);

        return Ok(new ApiResponse { Success = true, Message = "Password reset email sent" });

    }

    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        Console.WriteLine("Inside Reset Password");
        Console.WriteLine(dto.Token);
        Console.WriteLine(dto.NewPassword);

        // 1. Validate JWT token
        var claims = _jwtService.ValidatePasswordResetToken(dto.Token);
        // 2. Extract user ID from token claims
        var userId = claims?.UserId;



        if (userId == null)
        {
            return BadRequest(new ApiResponse { Success = false, Message = "User not found" });
        }

        // 3. Update password in database
        try
        {
            Console.WriteLine("Attempting to reset password");
            Console.WriteLine(userId);
            Console.WriteLine(dto.NewPassword);

            var success = await _userService.ResetPasswordAsync(userId, dto.NewPassword);
            if (!success)
            {
                return BadRequest(new ApiResponse { Success = false, Message = "Password reset failed" });
            }
            // 4. Token automatically becomes invalid after expiration
            return Ok(new ApiResponse { Success = true, Message = "Password reset successfully" });

        }
        catch (Exception ex)
        {
            Console.WriteLine("Error during password reset: " + ex.Message);
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Internal server error",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }

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