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
        public async Task<Result<YtChannel>> GetChannel(string channelId)
        {
            YtChannel ytChannel = await _youtubeDlViewDb.Channels.FindAsync(channelId);
            return ytChannel != null ? Result.Ok(ytChannel) : Result.Fail<YtChannel>("Channel not found", 404);
        }
    }
}