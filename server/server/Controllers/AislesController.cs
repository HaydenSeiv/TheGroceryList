using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Middleware;
using server.Services;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
[ServiceFilter(typeof(AuthRequiredAttribute))]
public class AislesController : Controller
{
    private readonly IAisleService _aisleService;

    public AislesController(IAisleService aisleService)
    {
        _aisleService = aisleService;
    }
    [HttpGet("{layoutId}")]
    public async Task<ActionResult<IEnumerable<AisleResponseDto>>> GetAisles(string layoutId)
    {
        try
        {

            var userId = GetCurrentUserId();
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

            Console.WriteLine("User Authorized, Getting Aisles");
            var aisles = await _aisleService.GetAislesAsync(layoutId, userId);
            Console.WriteLine("Aisles Successfully retrieved");
            return Ok(aisles);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Could not fetch aisles",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
    }
    [HttpPost]
    public async Task<ActionResult<AisleResponseDto>> CreateAisle(CreateAisleDto createAisleDto)
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

            var aisle = await _aisleService.CreateAisleAsync(createAisleDto, userId);
            return Ok(aisle);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Could not create aisle",
                Error = new Dictionary<string, object> { { "details", ex.Message } }
            });
        }
    }

    [HttpDelete("{aisleId}")]
    public async Task<ActionResult> DeleteAisle(string aisleId)
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

        var result = await _aisleService.DeleteAisleAsync(aisleId, userId);
        if (!result)
        {
            return NotFound(new ApiResponse
            {
                Success = false,
                Message = "Aisle not found",
                Error = new Dictionary<string, object>()
            });
        }

        return Ok(new ApiResponse
        {
            Success = true,
            Message = "Aisle deleted successfully"
        });
    }



    private string? GetCurrentUserId()
    {
        return HttpContext.Items["UserId"]?.ToString();
    }
    
}

