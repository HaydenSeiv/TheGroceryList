using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RestSharp; // RestSharp v112.1.0
using RestSharp.Authenticators;
using System.Threading;

namespace server.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    //Send Password Reset Email
    public async Task<RestResponse> SendPasswordResetEmail(string email, string token)
    {
        var frontendUrl = _configuration.GetValue<string>("FrontendUrl");
        var fromEmail = _configuration.GetValue<string>("Email:FromEmail");
        var fromName = _configuration.GetValue<string>("Email:FromName");

        if (string.IsNullOrWhiteSpace(fromEmail) || string.IsNullOrWhiteSpace(fromName))
            throw new InvalidOperationException("Missing Email:FromEmail or Email:FromName in configuration.");

        var options = new RestClientOptions("https://api.brevo.com");
        var client = new RestClient(options);

        var request = new RestRequest("/v3/smtp/email", Method.Post);
        var brevoApiKey = _configuration["BREVO_API_KEY"];
        if (string.IsNullOrWhiteSpace(brevoApiKey))
            throw new InvalidOperationException("Missing BREVO_API_KEY in configuration.");
        request.AddHeader("api-key", brevoApiKey);
        request.AddHeader("Content-Type", "application/json");

        var payload = new
        {
            sender = new { email = fromEmail, name = fromName },
            to = new[] { new { email } },
            subject = "Password Reset",
            textContent = $"Click the link to reset your password: {frontendUrl}/reset-password/{token}"
        };

        request.AddJsonBody(payload);
        return await client.ExecuteAsync(request);
    }
}
