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
        Console.WriteLine("Inside SendPasswordResetEmail service");

        var frontendUrl = _configuration.GetValue<string>("FrontendUrl");


        var options = new RestClientOptions("https://api.mailgun.net")
        {
            Authenticator = new HttpBasicAuthenticator("api", Environment.GetEnvironmentVariable("MAIL_API_KEY"))
        };

        var client = new RestClient(options);
        var request = new RestRequest("/v3/sandbox499b21ff013e4b0688b61fe935c509bf.mailgun.org/messages", Method.Post);
        request.AlwaysMultipartFormData = true;
        request.AddParameter("from", "Mailgun Sandbox <postmaster@sandbox499b21ff013e4b0688b61fe935c509bf.mailgun.org>");
        request.AddParameter("to", email);
        request.AddParameter("subject", "Password Reset");
        request.AddParameter("text", $"Click the link to reset your password: {frontendUrl}/reset-password/{token}");
        return await client.ExecuteAsync(request);
    }
}
