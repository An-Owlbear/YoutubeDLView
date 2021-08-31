using System;
using System.Collections.Generic;
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
        private readonly IUserManager _userManager;
        private readonly JwtSecurityTokenHandler _tokenHandler;
        
        public JwtTokenHandler(IOptionsSnapshot<YoutubeDLViewConfig> config, IUserManager userManager)
        {
            _config = config.Value;
            _userManager = userManager;
            _tokenHandler = new JwtSecurityTokenHandler();
        }

        /// <summary>
        /// Creates a JWT access token for the given user
        /// </summary>
        /// <param name="user">The user to create an access token for</param>
        /// <returns>The created token</returns>
        public string CreateAccessToken(User user)
        {
            SecurityTokenDescriptor tokenDescriptor =
                createTokenDescriptor(user, _config.AccessTokenSecret, TimeSpan.FromHours(1));
            SecurityToken token = _tokenHandler.CreateToken(tokenDescriptor);
            return _tokenHandler.WriteToken(token);
        }
        
        /// <summary>
        /// Validates the given access token
        /// </summary>
        /// <param name="token">The token to validate</param>
        /// <returns>The result of the validation, if successful containing the resulting <see cref="ClaimsPrincipal"/></returns>
        public Result<ClaimsPrincipal> ValidateAccessToken(string token) =>
            validateToken(token, createTokenValidationParameters(_config.AccessTokenSecret));

        // Validates the given JWT token using the given TokenValidationParameters
        private Result<ClaimsPrincipal> validateToken(string token, TokenValidationParameters validationParameters)
        {
            try
            {
                ClaimsPrincipal validatedClaims = _tokenHandler.ValidateToken(token, validationParameters, out _);
                return Result.Ok(validatedClaims);
            }
            catch (Exception e)
            {
                return Result.Fail<ClaimsPrincipal>(e.Message);
            }
        }
        
        // Creates a ClaimsIdentity from the given user
        private ClaimsIdentity createClaims(User user)
        {
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Username),
            };
            return new(claims);
        }


        // Creates a SecurityTokenDescriptor from which to create a token
        private SecurityTokenDescriptor createTokenDescriptor(User user, string secret, TimeSpan length) => new()
        {
            Issuer = _config.Url,
            IssuedAt = DateTime.UtcNow,
            Expires = DateTime.UtcNow.Add(length),
            Subject = createClaims(user),
            SigningCredentials = new(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret)),
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        // Creates TokenValidationParameters for the given key
        private TokenValidationParameters createTokenValidationParameters(string key) => new()
        {
            ValidateIssuer = true,
            ValidIssuer = _config.Url,
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key))
        };
    }
}