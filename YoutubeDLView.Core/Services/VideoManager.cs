using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Core.Services
{
    public class VideoManager : IVideoManager
    {
        private readonly IYoutubeDLViewDb _youtubeDlViewDb;
        private readonly IFileManager _fileManager;
        
        public VideoManager(IYoutubeDLViewDb youtubeDlViewDb, IFileManager fileManager)
        {
            _youtubeDlViewDb = youtubeDlViewDb;
            _fileManager = fileManager;
        }

        /// <inheritdoc />
        public async Task<Result<Video>> GetVideo(string id)
        {
            Video video = await _youtubeDlViewDb.Videos.FindAsync(id);
            return video != null ? Result.Ok(video) : Result.Fail<Video>("Video not found", 404);
        }
    }
}