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
    //Test email service - remove this later
    public async Task<RestResponse> SendEmail()
    {
        Console.WriteLine("Inside SendEmail service");
        var options = new RestClientOptions("https://api.mailgun.net")
        {
            Authenticator = new HttpBasicAuthenticator("api", Environment.GetEnvironmentVariable("MAIL_API_KEY")")
        };

        var client = new RestClient(options);
        var request = new RestRequest("/v3/sandbox499b21ff013e4b0688b61fe935c509bf.mailgun.org/messages", Method.Post);
        request.AlwaysMultipartFormData = true;
        request.AddParameter("from", "Mailgun Sandbox <postmaster@sandbox499b21ff013e4b0688b61fe935c509bf.mailgun.org>");
        request.AddParameter("to", "Hayden Seivewright <h.seivewright@gmail.com>");
        request.AddParameter("subject", "Hello Hayden Seivewright");
        request.AddParameter("text", "Congratulations Hayden Seivewright, you just sent an email with Mailgun! You are truly awesome!");
        return await client.ExecuteAsync(request);
    }
}
