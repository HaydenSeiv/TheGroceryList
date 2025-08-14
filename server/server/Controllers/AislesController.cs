using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Middleware;
using server.Services;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
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
        Console.WriteLine($"[GetAisles] Starting - LayoutId: {layoutId}");
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                Console.WriteLine("[GetAisles] User ID is null. Returning Unauthorized");
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            Console.WriteLine($"[GetAisles] User authorized (ID: {userId}), fetching aisles for layout");
            var aisles = await _aisleService.GetAislesAsync(layoutId, userId);
            Console.WriteLine($"[GetAisles] Successfully retrieved {(aisles as IEnumerable<AisleResponseDto>)?.Count() ?? 0} aisles");
            return Ok(aisles);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GetAisles] Error occurred: {ex.Message}");
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
        Console.WriteLine($"[CreateAisle] Starting - LayoutId: {createAisleDto.LayoutId}, Name: {createAisleDto.AisleName}");
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                Console.WriteLine("[CreateAisle] User ID is null. Returning Unauthorized");
                return Unauthorized(new ApiResponse
                {
                    Success = false,
                    Message = "Unauthorized",
                    Error = new Dictionary<string, object>()
                });
            }

            Console.WriteLine($"[CreateAisle] User authorized (ID: {userId}), creating aisle");
            var aisle = await _aisleService.CreateAisleAsync(createAisleDto, userId);
            Console.WriteLine($"[CreateAisle] Successfully created aisle with ID: {aisle?.AisleId}");
            return Ok(aisle);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CreateAisle] Error occurred: {ex.Message}");
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
        Console.WriteLine($"[DeleteAisle] Starting - AisleId: {aisleId}");
        
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            Console.WriteLine("[DeleteAisle] User ID is null. Returning Unauthorized");
            return Unauthorized(new ApiResponse
            {
                Success = false,
                Message = "Unauthorized",
                Error = new Dictionary<string, object>()
            });
        }

        Console.WriteLine($"[DeleteAisle] User authorized (ID: {userId}), attempting to delete aisle");
        var result = await _aisleService.DeleteAisleAsync(aisleId, userId);
        
        if (!result)
        {
            Console.WriteLine($"[DeleteAisle] Aisle not found or could not be deleted - AisleId: {aisleId}");
            return NotFound(new ApiResponse
            {
                Success = false,
                Message = "Aisle not found",
                Error = new Dictionary<string, object>()
            });
        }

        Console.WriteLine($"[DeleteAisle] Successfully deleted aisle - AisleId: {aisleId}");
        return Ok(new ApiResponse
        {
            Success = true,
            Message = "Aisle deleted successfully"
        });
    }



    private string? GetCurrentUserId()
    {
        return HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
    
}

