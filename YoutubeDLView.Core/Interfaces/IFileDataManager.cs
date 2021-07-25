using System.IO;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.ValueObjects;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IFileDataManager
    {
        /// <summary>
        /// Returns the thumbnail and mime type for the given video
        /// </summary>
        /// <param name="videoId">The Id of the video to retrieve the thumbnail of</param>
        /// <returns>The thumbnail <see cref="Stream" /> and mime type</returns>
        Task<Result<(Stream, string)>> GetThumbnail(string videoId);

        /// <summary>
        /// Returns the video file and its mime type
        /// </summary>
        /// <param name="videoId">The Id of the video to retrieve</param>
        /// <returns>The video <see cref="Stream" /> and its mime type</returns>
        Task<Result<VideoStream>> GetVideoFile(string videoId);
    }
}