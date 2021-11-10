using System.Collections.Generic;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.ValueObjects;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IConfigManager
    {
        /// <summary>
        /// Retrieves a list of video sources
        /// </summary>
        /// <returns></returns>
        public IEnumerable<VideoSource> GetSources();

        /// <summary>
        /// Adds a video source to the database
        /// </summary>
        /// <param name="path">The path to add to the database</param>
        /// <returns>A success result if a valid source is added, otherwise a failure result</returns>
        public Task<Result> AddSource(string path);

        /// <summary>
        /// Removes the requested source
        /// </summary>
        /// <param name="path">The path to remove</param>
        /// <returns></returns>
        public Task<Result> RemoveSource(string path);

        /// <summary>
        /// Returns information about the server
        /// </summary>
        /// <returns></returns>
        public SystemInfo GetSystemInfo();
    }
}