namespace server.DTOs;

public class ForgotPasswordDto
{
    public required string Email { get; set; }
}

public class ResetPasswordDto
{
    public required string Token { get; set; }
    public required string NewPassword { get; set; }
}

public class PasswordResetClaims
{
    public string UserId { get; set; } = string.Empty;
    //public string Email { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
}