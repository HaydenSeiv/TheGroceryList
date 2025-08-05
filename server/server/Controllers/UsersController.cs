using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
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

    [HttpPost]
    public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUsers), new { id = user?.Id }, user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse
            {
                Success = false,
                Message = ex.Message,
                Error = new Dictionary<string, object>()
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse
            {
                Success = false,
                Message = ex.Message,
                Error = new Dictionary<string, object>()
            });
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

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(string id)
    {
        try
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted)
            {
                return NotFound(new ApiResponse
                {
                    Success = false,
                    Message = "User not found",
                    Error = new Dictionary<string, object>()
                });
            }

            return Ok(new ApiResponse { Success = true, Message = "User deleted successfully" });
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
} 