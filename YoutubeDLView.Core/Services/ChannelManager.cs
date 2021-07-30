using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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

        public IQueryable<YtChannel> Channels => _youtubeDlViewDb.Channels.AsNoTracking();

        /// <inheritdoc />
        public async Task<Result<YtChannel>> GetChannel(string channelId)
        {
            YtChannel ytChannel = await _youtubeDlViewDb.Channels.FindAsync(channelId);
            return ytChannel != null ? Result.Ok(ytChannel) : Result.Fail<YtChannel>("Channel not found", 404);
        }

        /// <inheritdoc />
        public async Task<Result<IEnumerable<Video>>> GetVideos(string channelId, int skip, int take)
        {
            // Retrieves channel and returns failure result of not found
            Result<YtChannel> result = await GetChannel(channelId);
            if (!result.Success) return Result.Fail<IEnumerable<Video>>(result);
            
            // Retrieves and returns videos
            IEnumerable<Video> videos = result.Data.Videos
                .OrderByDescending(x => x.UploadDate)
                .Skip(skip)
                .Take(take)
                .ToList();
            return Result.Ok(videos);
        }
    }
}