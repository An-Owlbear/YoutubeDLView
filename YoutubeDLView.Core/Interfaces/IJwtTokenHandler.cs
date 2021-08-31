using System.Security.Claims;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IJwtTokenHandler
    {
        string CreateAccessToken(User user);
        
        Result<ClaimsPrincipal> ValidateAccessToken(string token);

    }
}