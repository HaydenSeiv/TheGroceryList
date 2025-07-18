using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;
using server.Middleware;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[ServiceFilter(typeof(AuthRequiredAttribute))]
public class ListsController : ControllerBase
{
    private readonly IListService _listService;
    private readonly IUserService _userService;

    public ListsController(IListService listService, IUserService userService)
    {
        _listService = listService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ListResponseDto>>> GetLists()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            var lists = await _listService.GetUserListsAsync(userId);
            return Ok(lists);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Could not fetch lists",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ListResponseDto>> CreateList([FromBody] CreateListDto createListDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            var list = await _listService.CreateListAsync(userId, createListDto);
            return CreatedAtAction(nameof(GetLists), new { id = list?.Id }, list);
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
    public async Task<ActionResult> DeleteList(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            var deleted = await _listService.DeleteListAsync(id, userId);
            if (!deleted)
            {
                return NotFound(new ApiResponse
                {
                    Success = false,
                    Message = "List not found",
                    Error = new Dictionary<string, object>()
                });
            }

            return Ok(new ApiResponse { Success = true, Message = "List deleted successfully" });
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

    private string? GetCurrentUserId()
    {
        return HttpContext.Items["UserId"]?.ToString();
    }
} 