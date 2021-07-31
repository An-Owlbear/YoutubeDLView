using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IChannelManager
    {
        /// <summary>
        /// Readonly access to the channels table
        /// </summary>
        IQueryable<YtChannel> Channels { get; } 

        /// <summary>
        /// Retrieves the channel of the given id
        /// </summary>
        /// <param name="channelId">The id of the channel to retrieve</param>
        /// <returns>The <see cref="Result"/> of the search, containing the channel if successful</returns>
        Task<Result<YtChannel>> GetChannel(string channelId);

        Task<IEnumerable<YtChannel>> GetChannels(int skip, int take);

        /// <summary>
        /// Retrieves a list of videos from the specified channel
        /// </summary>
        /// <param name="channelId">The id of the channel to retrieve videos from</param>
        /// <param name="skip">The number of videos to skip before selecting videos to return</param>
        /// <param name="take">The number of videos to select to return</param>
        /// <returns>A <see cref="Result"/> containing the list of videos if successful</returns>
        Task<Result<IEnumerable<Video>>> GetVideos(string channelId, int skip, int take);
    }
}