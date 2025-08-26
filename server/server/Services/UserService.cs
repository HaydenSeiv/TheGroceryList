using MongoDB.Driver;
using server.Data;
using server.DTOs;
using server.Models;

namespace server.Services;

public class UserService : IUserService
{
    private readonly MongoDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;

    public UserService(MongoDbContext context, IPasswordService passwordService, IJwtService jwtService)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _context.Users.Find(_ => true).ToListAsync();
        return users.Select(u => new UserResponseDto
        {
            Id = u.Id ?? string.Empty,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email
        });
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(string id)
    {
        var user = await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        if (user == null) return null;

        return new UserResponseDto
        {
            Id = user.Id ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email
        };
    }

    public async Task<UserResponseDto?> GetUserByEmailAsync(string email)
    {
        var user = await _context.Users.Find(u => u.Email == email).FirstOrDefaultAsync();
        if (user == null) return null;
        return new UserResponseDto
        {
            Id = user.Id ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email
        };
    }

    public async Task<UserResponseDto?> CreateUserAsync(CreateUserDto createUserDto)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(createUserDto.FirstName))
            throw new ArgumentException("First name cannot be empty");
        if (string.IsNullOrWhiteSpace(createUserDto.LastName))
            throw new ArgumentException("Last name cannot be empty");
        if (string.IsNullOrWhiteSpace(createUserDto.Email))
            throw new ArgumentException("Email cannot be empty");
        if (string.IsNullOrWhiteSpace(createUserDto.Password))
            throw new ArgumentException("Password cannot be empty");

        // Convert email to lowercase
        var email = createUserDto.Email.ToLowerInvariant();

        // Check if email already exists
        var existingUser = await _context.Users.Find(u => u.Email == email).FirstOrDefaultAsync();
        if (existingUser != null)
        {
            throw new InvalidOperationException("Email already in use");
        }

        // Hash password
        var hashedPassword = _passwordService.HashPassword(createUserDto.Password);

        // Create user
        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = email,
            Password = hashedPassword
        };

        await _context.Users.InsertOneAsync(user);

        return new UserResponseDto
        {
            Id = user.Id ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email
        };
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var result = await _context.Users.DeleteOneAsync(u => u.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var email = loginDto.Email.ToLowerInvariant();
        var user = await _context.Users.Find(u => u.Email == email).FirstOrDefaultAsync();

        if (user == null)
        {
            throw new UnauthorizedAccessException("Email not found, please create account");
        }


        if (!_passwordService.VerifyPassword(loginDto.Password, user.Password))
        {
            throw new UnauthorizedAccessException("Incorrect password");
        }


        // Generate JWT token
        var token = _jwtService.GenerateToken(user.Id!);

        // Update user's current token
        var update = Builders<User>.Update.Set(u => u.CurrentToken, token);
        await _context.Users.UpdateOneAsync(u => u.Id == user.Id, update);

        return new LoginResponseDto
        {
            Message = "Login success",
            Token = token
        };
    }

    public async Task<UserResponseDto?> GetAuthenticatedUserAsync(string token)
    {

        var userId = _jwtService.GetUserIdFromToken(token);

        if (userId == null) return null;

        var user = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();

        if (user == null) return null;

        return new UserResponseDto
        {
            Id = user.Id ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email
        };
    }

    // Private internal method to get User entity by ID (for service-to-service calls)
    private async Task<User?> GetUserEntityByIdAsync(string id)
    {
        return await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    
    private async Task<User?> GetUserEntityByEmailAsync(string email)
    {
        return await _context.Users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<bool> ResetPasswordAsync(string userId, string newPassword)
    {
        // Get the user entity from database
        var user = await GetUserEntityByIdAsync(userId);
        if (user == null) return false;

        // Hash the new password
        var hashedPassword = _passwordService.HashPassword(newPassword);
        
        // Update user's password
        var update = Builders<User>.Update.Set(u => u.Password, hashedPassword);
        var result = await _context.Users.UpdateOneAsync(u => u.Id == user.Id, update);
        
        return result.ModifiedCount > 0;
    }
}