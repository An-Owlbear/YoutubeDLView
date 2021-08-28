using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Core.Services
{
    public class VideoManager : IVideoManager
    {
        private readonly IYoutubeDLViewDb _youtubeDlViewDb;

        public VideoManager(IYoutubeDLViewDb youtubeDlViewDb)
        {
            _youtubeDlViewDb = youtubeDlViewDb;
        }

        /// <inheritdoc />
        public async Task<Result<Video>> GetVideo(string id)
        {
            Video video = await _youtubeDlViewDb.Videos.FindAsync(id);
            return video != null ? Result.Ok(video) : Result.Fail<Video>("Video not found", 404);
        }

        /// <inheritdoc />
        public IEnumerable<Video> GetVideos(int skip, int take)
        {
            return _youtubeDlViewDb.Videos
                .OrderByDescending(x => x.UploadDate)
                .Skip(skip)
                .Take(take)
                .ToList();
        }
    }
}