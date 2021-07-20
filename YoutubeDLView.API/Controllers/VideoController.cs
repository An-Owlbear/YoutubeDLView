using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
        [HttpPost("Scan")]
        public async Task<IActionResult> ScanFiles()
        {
            await _fileManager.ScanFiles();
            return Ok();
        }

        /// <summary>
        /// Gets metadata about the given video
        /// </summary>
        /// <param name="videoId">The id of the video get metadata for</param>
        /// <returns></returns>
        [HttpGet("{videoId}")]
        [Authorize]
        public async Task<IActionResult> GetVideoInfo(string videoId)
        {
            Result<Video> video = await _videoManager.GetVideo(videoId);
            return video.Success switch
            {
                true => Ok(video.Data),
                false => NotFound()
            };
        }
    }
}