using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using YoutubeDLView.Api.Models;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Auth
{
    public class JwtAuthHandler : AuthenticationHandler<JwtAuthOptions>
    {
        private readonly IJwtTokenHandler _tokenHandler;
        private TokenValidationParameters _validationParameters;

        public JwtAuthHandler(
            IOptionsMonitor<JwtAuthOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IJwtTokenHandler tokenHandler)
            : base(options, logger, encoder, clock)
        {
            _tokenHandler = tokenHandler;
        }

        // Sets up validation parameters
        protected override Task InitializeHandlerAsync()
        {
            _validationParameters = new()
            {
                ValidateIssuer = true,
                ValidIssuer = Options.Url,
                ValidateAudience = false,
                IssuerSigningKey = 
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Options.Secret))
            };
            return Task.CompletedTask;
        }
        
        // Authenticates access token in the request header
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Ensures Authorization header is set
            if (!Request.Headers.ContainsKey(HeaderNames.Authorization))
                return Task.FromResult(AuthenticateResult.NoResult());

            string header = Request.Headers[HeaderNames.Authorization].ToString();

            // Ensure Authorization header is in the valid format
            if (!header.StartsWith("Bearer "))
                return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization header"));

            // Validates the JWT token
            string token = header.Substring(7);
            Result<ClaimsPrincipal> validateResult = _tokenHandler.ValidateToken(token, _validationParameters);
            if (!validateResult.Success) return Task.FromResult(AuthenticateResult.Fail("Invalid token"));

            AuthenticationTicket ticket = new(validateResult.Data, Scheme.Name);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}