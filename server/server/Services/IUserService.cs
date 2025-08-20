using server.DTOs;
using server.Models;

namespace server.Services;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto?> GetUserByIdAsync(string id);
    Task<UserResponseDto?> CreateUserAsync(CreateUserDto createUserDto);
    Task<bool> DeleteUserAsync(string id);
    Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
    Task<UserResponseDto?> GetAuthenticatedUserAsync(string token);

    //password reset
    Task<bool> SendPasswordResetEmailAsync(string email);
    Task<bool> ResetPasswordWithTokenAsync(string jwtToken, string newPassword);
}