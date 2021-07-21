using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Constants;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Controllers
{
    /// <summary>
    /// Controller containing endpoints relating to videos
    /// </summary>
    [ApiController]
    [Route("Videos")]
    [Produces(MediaTypeNames.Application.Json)]
    public class VideoController : ControllerBase
    {
        private readonly IFileManager _fileManager;
        private readonly IVideoManager _videoManager;

        public VideoController(IFileManager fileManager, IVideoManager videoManager)
        {
            _fileManager = fileManager;
            _videoManager = videoManager;
        }

        /// <summary>
        /// Scans metadata files from the configured directories
        /// </summary>
        /// <returns></returns>
        /// <response code="200">Files successfully scanned</response>
        [HttpPost("Scan")]
        [Authorize(Roles = UserRoles.Administrator)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ScanFiles()
        {
            await _fileManager.ScanFiles();
            return Ok();
        }

        /// <summary>
        /// Gets metadata about the given video
        /// </summary>
        /// <param name="videoId">The id of the video get metadata for</param>
        /// <response code="200">Video information retrieved</response>
        /// <response code="404">Video not found</response>
        /// <returns></returns>
        [HttpGet("{videoId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetVideoInfo(string videoId)
        {
            Result<Video> video = await _videoManager.GetVideo(videoId);
            return video.Success switch
            {
                true => Ok(video.Data),
                false => NotFound()
            };
        }

        /// <summary>
        /// Gets the thumbnail of a video
        /// </summary>
        /// <param name="videoId">The id of the video to get the thumbnail of</param>
        /// <response code="200">Thumbnail successfully retrieved</response>
        /// <response code="404">Id is invalid, or video file does not have a thumbnail</response>
        /// <returns></returns>
        [HttpGet("{videoId}/thumbnail")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetVideoThumbnail(string videoId)
        {
            Result<Video> video = await _videoManager.GetVideo(videoId);
            if (!video.Success) return NotFound();
            Result<(Stream, string)> coverResult = _fileManager.GetThumbnail(video.Data.Path);
            return coverResult.Success switch
            {
                true => File(coverResult.Data.Item1, coverResult.Data.Item2),
                false => NotFound()
            };
        }
    }
}