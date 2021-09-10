namespace YoutubeDLView.API.Models
{
    public record SignupRequest(string Username, string Password);
    
    public record LoginRequest(string Username, string Password);
    
    public record RequestRefreshModel(string RefreshToken);

    public record UpdateUserRequest(string UserId, string Username, string Password);

    public record VideoSourceRequest(string Path);
}