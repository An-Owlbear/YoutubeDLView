using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using YoutubeDLView.API.Models;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Constants;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;
using YoutubeDLView.Core.ValueObjects;

namespace YoutubeDLView.API.Controllers
{
    /// <summary>
    /// Controller containing endpoints relating to videos
    /// </summary>
    [ApiController]
    [Route("Videos")]
    [Produces(MediaTypeNames.Application.Json)]
    public class VideoController : ApiController
    {
        private readonly IFileManager _fileManager;
        private readonly IFileDataManager _fileDataManager;
        private readonly IVideoManager _videoManager;

        public VideoController(IFileManager fileManager, IFileDataManager fileDataManager, IVideoManager videoManager)
        {
            _fileManager = fileManager;
            _fileDataManager = fileDataManager;
            _videoManager = videoManager;
        }

        /// <summary>
        /// Returns the requested amount of the most recent videos
        /// </summary>
        /// <param name="skip">The amount of videos to skip</param>
        /// <param name="take">The amount of videos to take</param>
        /// <response code="200">Returns list of recent videos</response>
        /// <returns></returns>
        [HttpGet("")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetVideos(int skip = 0, int take = 30)
        {
            IEnumerable<Video> videos = _videoManager.GetVideos(skip, take);
            return Ok(videos.Select(x => new VideoResponse(x)));
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
        public async Task<ActionResult<VideoResponse>> GetVideoInfo(string videoId)
        {
            Result<Video> video = await _videoManager.GetVideo(videoId);
            return video.Success switch
            {
                true => new VideoResponse(video.Data),
                false => FromResult(video)
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetVideoThumbnail(string videoId)
        {
            Result<(Stream, string)> coverResult = await _fileDataManager.GetThumbnail(videoId);
            return coverResult.Success switch
            {
                true => File(coverResult.Data.Item1, coverResult.Data.Item2),
                false => FromResult(coverResult)
            };
        }

        /// <summary>
        /// Gets the file of the video
        /// </summary>
        /// <param name="videoId">The id of the video to download</param>
        /// <response code="200">Video successfully retrieved</response>
        /// <response code="404">Video with the requested id not found</response>
        /// <returns></returns>
        [HttpGet("{videoId}/download")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetRawVideoFile(string videoId)
        {
            Result<VideoStream> result = await _fileDataManager.GetVideoFile(videoId);
            return result.Success switch
            {
                true => PhysicalFile(result.Data.Path, result.Data.MimeType, result.Data.Filename),
                false => FromResult(result)
            };
        }

        /// <summary>
        /// Gets a video to be played in the browser
        /// </summary>
        /// <param name="videoId">The id of the video to retrieve</param>
        /// <response code="200">Video successfully retrieved</response>
        /// <response code="404">Video with the requested id not found</response>
        /// <returns></returns>
        [HttpGet("{videoId}/video")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None)]
        public async Task<IActionResult> GetVideoStream(string videoId)
        {
            Result<VideoStream> result = await _fileDataManager.GetVideoStream(videoId);
            if (!result.Success) return FromResult(result);

            ContentDispositionHeaderValue contentDisposition = new("inline")
            {
                FileName = result.Data.Filename
            };
            Response.Headers[HeaderNames.ContentDisposition] = contentDisposition.ToString();
            return PhysicalFile(result.Data.Path, result.Data.MimeType, true);
        }
    }
}