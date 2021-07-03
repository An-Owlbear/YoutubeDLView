namespace YoutubeDLView.API.Models
{
    public record LoginInformation(string UserId, string Username, string AccessToken, string RefreshToken);

    public record RefreshInformation(string UserId, string Username, string AccessToken);
}