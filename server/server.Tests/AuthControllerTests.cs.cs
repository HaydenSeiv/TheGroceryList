using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text.Json;
using Xunit;
using server.DTOs;

namespace server.Tests;

public class AuthControllerTests : TestBase
{
    public AuthControllerTests(WebApplicationFactory<Program> factory) : base(factory) { }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOk()
    {
        // Arrange - First create a user
        var createUserDto = new CreateUserDto
        {
            FirstName = "Test",
            LastName = "User",
            Email = "test@example.com",
            Password = "password123"
        };
        
        await _client.PostAsync("/api/users", CreateJsonContent(createUserDto));

        var loginDto = new LoginDto
        {
            Email = "test@example.com",
            Password = "password123"
        };

        // Act
        var response = await _client.PostAsync("/api/login", CreateJsonContent(loginDto));

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        var loginResponse = JsonSerializer.Deserialize<LoginResponseDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(loginResponse);
        Assert.NotEmpty(loginResponse.Token);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsBadRequest()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "nonexistent@example.com",
            Password = "wrongpassword"
        };

        // Act
        var response = await _client.PostAsync("/api/login", CreateJsonContent(loginDto));

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ValidateUserAuth_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/login/userauth");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
