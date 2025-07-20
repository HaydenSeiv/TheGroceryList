using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using server.Services;

namespace server.Middleware;

public class AuthRequiredAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();

        var token = GetTokenFromRequest(context.HttpContext.Request);
        if (string.IsNullOrEmpty(token))
        {
            context.Result = new UnauthorizedObjectResult(new { error = "Unauthorized" });
            return;
        }

        var user = await userService.GetAuthenticatedUserAsync(token);
        if (user == null)
        {
            context.Result = new UnauthorizedObjectResult(new { error = "Unauthorized" });
            return;
        }

        // Store user ID in HttpContext for controllers to access
        context.HttpContext.Items["UserId"] = user.Id;
        await next();
    }

    private static string? GetTokenFromRequest(HttpRequest request)
    {
        // Check cookie first
        if (request.Cookies.TryGetValue("jwt", out var cookieToken) && !string.IsNullOrEmpty(cookieToken))
        {
            return cookieToken;
        }

        // Check Authorization header
        var authHeader = request.Headers["Authorization"].ToString();
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            return authHeader.Substring("Bearer ".Length);
        }

        return null;
    }
} 