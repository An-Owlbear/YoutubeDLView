using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Services
{
    public class JwtTokenHandler : IJwtTokenHandler
    {
        private readonly YoutubeDLViewConfig _config;
        
        public JwtTokenHandler(IOptionsSnapshot<YoutubeDLViewConfig> config)
        {
            _config = config.Value;
        }

        /// <summary>
        /// Creates a JWT access token for the given user
        /// </summary>
        /// <param name="user">The user to create an access token for</param>
        /// <returns>The created token</returns>
        public string CreateAccessToken(User user)
        {
            Console.WriteLine(_config.AccessTokenSecret);
            SecurityTokenDescriptor tokenDescriptor =
                createTokenDescriptor(user, TimeSpan.FromHours(1), _config.AccessTokenSecret);
            JwtSecurityTokenHandler handler = new();
            SecurityToken token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }

        /// <summary>
        /// Creates a JWT refresh token for the given user
        /// </summary>
        /// <param name="user">The user to create a refresh token for</param>
        /// <returns>The created refresh token</returns>
        public string CreateRefreshToken(User user)
        {
            SecurityTokenDescriptor tokenDescriptor = createTokenDescriptor(user, null, _config.RefreshTokenSecret);
            JwtSecurityTokenHandler handler = new();
            SecurityToken token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }
        
        /// <summary>
        /// Validates the given token
        /// </summary>
        /// <param name="token">The token to validate</param>
        /// <param name="validationParameters">The options to use when validated the token</param>
        /// <returns></returns>
        public Result<ClaimsPrincipal> ValidateToken(string token, TokenValidationParameters validationParameters)
        {
            JwtSecurityTokenHandler handler = new();
            try
            {
                ClaimsPrincipal validatedClaims = handler.ValidateToken(token, validationParameters, out _);
                return Result.Ok(validatedClaims);
            }
            catch (Exception e)
            {
                return Result.Fail<ClaimsPrincipal>(e.Message);
            }
        }

        // Creates a ClaimsIdentity from the given user
        private ClaimsIdentity createClaims(User user) => new(new[] 
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Username)
        });


        // Creates a SecurityTokenDescriptor from which to create a token
        private SecurityTokenDescriptor createTokenDescriptor(User user, TimeSpan? length, string secret) => new()
        {
            Issuer = _config.Url,
            IssuedAt = DateTime.UtcNow,
            Expires = length == null ? null : DateTime.UtcNow.Add((TimeSpan)length),
            Subject = createClaims(user),
            SigningCredentials = new(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret)),
                SecurityAlgorithms.HmacSha256Signature)
        };
    }
}