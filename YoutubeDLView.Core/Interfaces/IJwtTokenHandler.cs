using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IJwtTokenHandler
    {
        string CreateAccessToken(User user);
        
        Result<ClaimsPrincipal> ValidateAccessToken(string token, TokenValidationParameters validationParameters);

        string CreateRefreshToken(User user);

        Result<ClaimsPrincipal> ValidateRefreshToken(string token, TokenValidationParameters validationParameters);
    }
}