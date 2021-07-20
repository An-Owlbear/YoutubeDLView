using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IVideoManager
    {
        /// <summary>
        /// Gets video information from the specified id
        /// </summary>
        /// <param name="id">The id of the video to find</param>
        /// <returns></returns>
        Task<Result<Video>> GetVideo(string id);
    }
}