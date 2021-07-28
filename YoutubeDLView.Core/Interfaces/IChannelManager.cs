using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IChannelManager
    {
        /// <summary>
        /// Retrieves the channel of the given id
        /// </summary>
        /// <param name="channelId">The id of the channel to retrieve</param>
        /// <returns>The <see cref="Result"/> of the search, containing the channel if successful</returns>
        Task<Result<Channel>> GetChannel(string channelId);
    }
}