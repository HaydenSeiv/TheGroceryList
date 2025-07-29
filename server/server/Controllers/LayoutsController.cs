using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;

namespace server.Controllers;

    [Route("api/[controller]")]
    [ApiController]
    public class LayoutsController : ControllerBase
    {
        private readonly ILayoutService _layoutService;

        public LayoutsController(ILayoutService layoutService)
        {
            _layoutService = layoutService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LayoutResponseDto>>> GetLayouts()
        {
        try
        {
            Console.WriteLine("Inside Get Layouts");
            var userId = GetCurrentUserId();
            Console.WriteLine($"Current User Id: {userId}"); 
            if (userId == null)
            {
                Console.WriteLine("User ID is null. Returning Unauthorized");
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            Console.WriteLine("User Authorized, Getting Layouts");
            var layouts = await _layoutService.GetUserLayoutsAsync(userId);
            Console.WriteLine("Layouts Successfully retireved");
            return Ok(layouts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Could not fetch layouts",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
        }

[HttpPost]
    public async Task<ActionResult<LayoutResponseDto>> CreateLayout([FromBody] CreateLayoutDto createLayoutDto)
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

            var layout = await _layoutService.CreateLayoutAsync(userId, createLayoutDto);

            return CreatedAtAction(nameof(GetLayouts), new { id = layout?.LayoutId }, layout);
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
    public async Task<ActionResult> DeleteLayout(string id)
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

            var deleted = await _layoutService.DeleteLayoutAsync(id, userId);
            if (!deleted)
            {
                return NotFound(new ApiResponse
                {
                    Success = false,
                    Message = "Layout not found",
                    Error = new Dictionary<string, object>()
                });
            }

            return Ok(new ApiResponse { Success = true, Message = "Layout deleted successfully" });
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
