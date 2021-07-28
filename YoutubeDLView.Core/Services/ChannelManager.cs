using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Core.Services
{
    public class ChannelManager : IChannelManager
    {
        private readonly IYoutubeDLViewDb _youtubeDlViewDb;

        public ChannelManager(IYoutubeDLViewDb youtubeDlViewDb)
        {
            _youtubeDlViewDb = youtubeDlViewDb;
        }

        /// <inheritdoc />
        public async Task<Result<Channel>> GetChannel(string channelId)
        {
            Channel channel = await _youtubeDlViewDb.Channels.FindAsync(channelId);
            return channel != null ? Result.Ok(channel) : Result.Fail<Channel>("Channel not found", 404);
        }
    }
}