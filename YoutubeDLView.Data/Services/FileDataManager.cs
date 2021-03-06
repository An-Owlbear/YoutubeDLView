using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using HeyRed.Mime;
using TagLib;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;
using YoutubeDLView.Core.ValueObjects;

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
            if (!video.Success) return Result.Fail<(Stream, string)>(video);

            // Retrieves thumbnail from video metadata 
            TagLib.File tagFile = TagLib.File.Create(video.Data.Path);
            string[] filetypes = { "jpeg", "jpg", "png" };
            IPicture picture = tagFile.Tag.Pictures.FirstOrDefault(x => filetypes.Any(y => x.Filename.EndsWith(y)));
            if (picture == null) return Result.Fail<(Stream, string)>("Thumbnail not found", 404);
            Stream coverStream = new MemoryStream(picture.Data.Data);
            return Result.Ok((coverStream, picture.MimeType));
        }

        /// <inheritdoc />
        public async Task<Result<VideoStream>> GetVideoFile(string videoId)
        {
            // Retrieves video, returning error if not found
            Result<Video> video = await _videoManager.GetVideo(videoId);
            if (!video.Success) return Result.Fail<VideoStream>(video);
            
            // Determines mime type, and returns information
            string mimeType = MimeTypesMap.GetMimeType(Path.GetExtension(video.Data.Path));
            return Result.Ok(new VideoStream(video.Data.Path, mimeType, Path.GetFileName(video.Data.Path)));
        }


        /// <inheritdoc />
        /// <remarks>This implementation assumes any video files use a codec compatible with browsers</remarks>
        public async Task<Result<VideoStream>> GetVideoStream(string videoId)
        {
            // Retrieves video, returning error if not found
            Result<Video> video = await _videoManager.GetVideo(videoId);
            if (!video.Success) return Result.Fail<VideoStream>(video);

            // Determines mime type
            string mimetype = Path.GetExtension(video.Data.Path)?.ToLower() switch
            {
                ".webm" or ".mkv" => "video/webm",
                { } extension => MimeTypesMap.GetMimeType(extension),
                _ => throw new InvalidOperationException("File must have valid extension")
            };
            string returnExtension = MimeTypesMap.GetExtension(mimetype);
            string filename = $"{Path.GetFileNameWithoutExtension(video.Data.Path)}.{returnExtension}";
            return Result.Ok(new VideoStream(video.Data.Path, mimetype, filename));
        }
    }
}