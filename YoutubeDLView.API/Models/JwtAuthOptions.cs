using Microsoft.AspNetCore.Authentication;

namespace YoutubeDLView.Api.Models
{
    public class JwtAuthOptions : AuthenticationSchemeOptions
    {
        public string Url { get; set; }
        
        public string Secret { get; set; }
    }
}