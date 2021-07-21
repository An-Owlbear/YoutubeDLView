using System.IO;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IFileManager
    {
        /// <summary>
        /// Scans for video files in the configured directory
        /// </summary>
        /// <returns></returns>
        Task ScanFiles();

        /// <summary>
        /// Returns the thumbnail and mime type for the given video 
        /// </summary>
        /// <param name="path">The path of the target video</param>
        /// <returns>The thumbnail <see cref="Stream"/> and mime type</returns>
        Result<(Stream, string)> GetThumbnail(string path);
    }
}