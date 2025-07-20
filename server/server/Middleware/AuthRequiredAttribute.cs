using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using server.Services;

namespace server.Middleware;

public class AuthRequiredAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        Console.WriteLine("AuthRequiredAttribute called");
        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
        Console.WriteLine("UserService retrieved");

        var token = GetTokenFromRequest(context.HttpContext.Request);
        Console.WriteLine($"Token: {token}");
        if (string.IsNullOrEmpty(token))
        {
            Console.WriteLine("Token is null or empty");
            context.Result = new UnauthorizedObjectResult(new { error = "Unauthorized" });
            return;
        }

        var user = await userService.GetAuthenticatedUserAsync(token);
        if (user == null)
        {
            Console.WriteLine("User is null");
            context.Result = new UnauthorizedObjectResult(new { error = "Unauthorized" });
            return;
        }

        // Store user ID in HttpContext for controllers to access
        context.HttpContext.Items["UserId"] = user.Id;
        Console.WriteLine($"User ID: {user.Id}");
        Console.WriteLine("Next called");
        await next();
    }

    private static string? GetTokenFromRequest(HttpRequest request)
    {
        Console.WriteLine("GetTokenFromRequest called");
        // Check cookie first
        if (request.Cookies.TryGetValue("jwt", out var cookieToken) && !string.IsNullOrEmpty(cookieToken))
        {
            Console.WriteLine("Cookie token found");
            return cookieToken;
        }

        // Check Authorization header
        Console.WriteLine("Checking Authorization header");
        var authHeader = request.Headers["Authorization"].ToString();
        Console.WriteLine($"AuthHeader: {authHeader}");
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            Console.WriteLine("Authorization header found");
            return authHeader.Substring("Bearer ".Length);
        }

        Console.WriteLine("No token found");
        return null;
    }
} 