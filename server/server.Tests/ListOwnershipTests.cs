using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using Xunit;
using server.DTOs;

namespace server.Tests;

public class ListOwnershipTests : TestBase
{
    public ListOwnershipTests(WebApplicationFactory<Program> factory) : base(factory) { }

    [Fact]
    public async Task GetList_UserCanAccessOwnList_ReturnsOk()
    {
        // Arrange - Create user and login
        var token = await CreateUserAndLogin("owner@example.com", "password123");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create a list
        var createListDto = new CreateListDto { ListName = "My Test List" };
        var createResponse = await _client.PostAsync("/api/lists", CreateJsonContent(createListDto));
        var listContent = await createResponse.Content.ReadAsStringAsync();
        var createdList = JsonSerializer.Deserialize<ListResponseDto>(listContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // Act - Try to access own list
        var response = await _client.GetAsync($"/api/lists/{createdList.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetList_UserCannotAccessOtherUsersList_ReturnsForbiddenOrNotFound()
    {
        // Arrange - Create two users
        var user1Token = await CreateUserAndLogin("user1@example.com", "password123");
        var user2Token = await CreateUserAndLogin("user2@example.com", "password123");

        // User 1 creates a list
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user1Token);
        var createListDto = new CreateListDto { ListName = "User 1's List" };
        var createResponse = await _client.PostAsync("/api/lists", CreateJsonContent(createListDto));
        var listContent = await createResponse.Content.ReadAsStringAsync();
        var createdList = JsonSerializer.Deserialize<ListResponseDto>(listContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // User 2 tries to access User 1's list
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user2Token);

        // Act
        var response = await _client.GetAsync($"/api/lists/{createdList.Id}");

        // Assert - Should be Forbidden or NotFound (depending on your implementation)
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden || 
                   response.StatusCode == HttpStatusCode.NotFound ||
                   response.StatusCode == HttpStatusCode.Unauthorized);
    }

    private async Task<string> CreateUserAndLogin(string email, string password)
    {
        // Create user
        var createUserDto = new CreateUserDto
        {
            FirstName = "Test",
            LastName = "User",
            Email = email,
            Password = password
        };
        await _client.PostAsync("/api/users", CreateJsonContent(createUserDto));

        // Login
        var loginDto = new LoginDto { Email = email, Password = password };
        var loginResponse = await _client.PostAsync("/api/login", CreateJsonContent(loginDto));
        var loginContent = await loginResponse.Content.ReadAsStringAsync();
        var loginResult = JsonSerializer.Deserialize<LoginResponseDto>(loginContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        return loginResult.Token;
    }
}