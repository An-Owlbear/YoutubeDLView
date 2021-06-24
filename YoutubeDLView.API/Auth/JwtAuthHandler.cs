using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Auth
{
    public class JwtAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IJwtTokenHandler _tokenHandler;

        public JwtAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IJwtTokenHandler tokenHandler)
            : base(options, logger, encoder, clock)
        {
            _tokenHandler = tokenHandler;
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
            Result<ClaimsPrincipal> validateResult = _tokenHandler.ValidateAccessToken(token);
            if (!validateResult.Success) return Task.FromResult(AuthenticateResult.Fail("Invalid token"));

            AuthenticationTicket ticket = new(validateResult.Data, Scheme.Name);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}