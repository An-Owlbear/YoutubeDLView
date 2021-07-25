using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TagLib;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Data.Services
{
    public class FileDataManager : IFileDataManager
    {
        private readonly IVideoManager _videoManager;
        
        public FileDataManager(IVideoManager videoManager)
        {
            _videoManager = videoManager;
        }

        /// <inheritdoc />
        public async Task<Result<(Stream, string)>> GetThumbnail(string videoId)
        {
            // Retrieves video, returning error if none found
            Result<Video> video = await _videoManager.GetVideo(videoId);
            if (!video.Success) return Result.Fail<(Stream, string)>("Video not found");

            // Retrieves thumbnail from video metadata 
            TagLib.File tagFile = TagLib.File.Create(video.Data.Path);
            IPicture picture = tagFile.Tag.Pictures.FirstOrDefault();
            if (picture == null) return Result.Fail<(Stream, string)>("Thumbnail not found");
            Stream coverStream = new MemoryStream(picture.Data.Data);
            return Result.Ok((coverStream, picture.MimeType));
        }
    }
}