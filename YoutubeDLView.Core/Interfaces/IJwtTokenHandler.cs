using System.Security.Claims;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IJwtTokenHandler
    {
        string CreateAccessToken(User user);

        string CreateRefreshToken(User user);
        
        Result<ClaimsPrincipal> ValidateAccessToken(string token);

        Result<ClaimsPrincipal> ValidateRefreshToken(string token);
    }
}