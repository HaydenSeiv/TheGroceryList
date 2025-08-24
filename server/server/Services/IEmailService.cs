using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RestSharp;

namespace server.Services
{
    public interface IEmailService
    {
        Task<RestResponse> SendPasswordResetEmail(string email, string token);
    }
}