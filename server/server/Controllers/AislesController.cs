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

    private string? GetCurrentUserId()
    {
        return HttpContext.Items["UserId"]?.ToString();
    }

}
