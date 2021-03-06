using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.API.Models
{
    public record LoginInformation(string UserId, string Username, string Role, string AccessToken, string RefreshToken);

    public record RefreshInformation(string UserId, string Username, string AccessToken);

    public record ChannelResponse(string Id, string Name)
    {
        public ChannelResponse(YtChannel channel) : this(channel.Id, channel.Name) { }
    }

    public record VideoResponse(string Id, string Title, string Description, string UploadDate, int Length,
        ChannelResponse Channel)
    {
        public VideoResponse(Video video) : this(video.Id, video.Title, video.Description, video.UploadDate,
            video.Length, new ChannelResponse(video.Channel)) { }
    }

    public record UserResponse(string Id, string Username, bool Password)
    {
        public UserResponse(User user) : this(user.Id, user.Username, string.IsNullOrEmpty(user.Password)) { }
    }
}