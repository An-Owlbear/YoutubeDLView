using System.IO;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IFileManager
    {
        Task ScanFiles();

        Result<(Stream, string)> GetThumbnail(string path);
    }
}