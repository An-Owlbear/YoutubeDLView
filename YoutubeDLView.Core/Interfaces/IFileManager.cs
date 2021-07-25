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
    }
}