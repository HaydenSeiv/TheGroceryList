using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;
    private readonly IUserService _userService;

    public ItemsController(IItemService itemService, IUserService userService)
    {
        _itemService = itemService;
        _userService = userService;
    }

    [HttpGet("{listId}")]
    public async Task<ActionResult<IEnumerable<ItemResponseDto>>> GetItems(string listId)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            var items = await _itemService.GetItemsAsync(listId, userId);
            return Ok(items);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse
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
                Message = "Failed to fetch items",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ItemResponseDto>> CreateItem([FromBody] CreateItemDto createItemDto)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }
            var item = await _itemService.CreateItemAsync(createItemDto, userId);
            return CreatedAtAction(nameof(GetItems), new { listId = item?.ListId }, item);
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
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse
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

    [HttpPatch("{id}")]
    public async Task<ActionResult> CompleteItem(string id)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            var updated = await _itemService.CompleteItemAsync(id, userId);
            if (!updated)
            {
                return NotFound(new ApiResponse
                {
                    Success = false,
                    Message = "Item not found",
                    Error = new Dictionary<string, object>()
                });
            }

            return Ok(new ApiResponse { Success = true, Message = "Item updated successfully" });
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

    [HttpPatch("itemsupdate/{id}/{newTitle}")]
    public async Task<ActionResult> UpdateItem(string id, string newTitle)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            var updated = await _itemService.UpdateItemAsync(id, newTitle, userId);
            if (!updated)
            {
                return NotFound(new ApiResponse
                {
                    Success = false,
                    Message = "Item not found",
                    Error = new Dictionary<string, object>()
                });
            }

            return Ok(new ApiResponse { Success = true, Message = "Item updated successfully" });
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
    public async Task<ActionResult> DeleteItem(string id)
    {
        try
        {
            var userId = await GetCurrentUserIdAsync();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            var deleted = await _itemService.DeleteItemAsync(id, userId);
            if (!deleted)
            {
                return NotFound(new ApiResponse
                {
                    Success = false,
                    Message = "Item not found",
                    Error = new Dictionary<string, object>()
                });
            }

            return Ok(new ApiResponse { Success = true, Message = "Item deleted successfully" });
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

    private async Task<string?> GetCurrentUserIdAsync()
    {
        var token = GetTokenFromRequest();
        if (string.IsNullOrEmpty(token)) return null;

        var user = await _userService.GetAuthenticatedUserAsync(token);
        return user?.Id;
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