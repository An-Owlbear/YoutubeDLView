using System;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.StaticFiles;
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
            IPicture picture = tagFile.Tag.Pictures.FirstOrDefault();
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
            
            // Determines mime type
            FileExtensionContentTypeProvider provider = new();
            if (!provider.TryGetContentType(Path.GetFileName(video.Data.Path), out string mimeType))
                mimeType = MediaTypeNames.Application.Octet;
            
            // Returns file path and mime type
            return Result.Ok(new VideoStream(video.Data.Path, mimeType));
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
                ".mp4" => "video/mp4",
                ".webm" or ".mkv" => "video/webm",
                _ => throw new InvalidOperationException("Video file must have an extension")
            };
            return Result.Ok(new VideoStream(video.Data.Path, mimetype));
        }
    }
}