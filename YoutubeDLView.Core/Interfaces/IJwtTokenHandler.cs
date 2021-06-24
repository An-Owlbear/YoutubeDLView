using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IJwtTokenHandler
    {
        string CreateAccessToken(User user);

        string CreateRefreshToken(User user);
        
        Result<ClaimsPrincipal> ValidateToken(string token, TokenValidationParameters validationParameters);

        Result<ClaimsPrincipal> ValidateAccessToken(string token);

        Result<ClaimsPrincipal> ValidateRefreshToken(string token);
    }
}