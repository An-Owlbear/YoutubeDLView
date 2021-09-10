using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.API.Models;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Constants;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Controllers
{
    /// <summary>
    /// Controller containing endpoints relating to the application
    /// </summary>
    [ApiController]
    [Route("Config")]
    [Produces(MediaTypeNames.Application.Json)]
    public class SystemController : ApiController
    {
        private readonly IConfigManager _configManager;

        public SystemController(IConfigManager configManager)
        {
            _configManager = configManager;
        }

        /// <summary>
        /// Returns information about the server
        /// </summary>
        /// <response code="200">Returns system information</response>
        /// <returns><see cref="SystemInfo"/>, containing information about the server</returns>
        [HttpGet("Info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public SystemInfo GetSystemInfo()
        {
            return new SystemInfo();
        }

        /// <summary>
        /// Returns the list of all video sources to the user
        /// </summary>
        /// <returns></returns>
        [HttpGet("Sources")]
        [Authorize(Roles = UserRoles.Administrator)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetVideoSources() => Ok(_configManager.GetSources());

        /// <summary>
        /// Adds a source to the database
        /// </summary>
        /// <param name="request">Contains details of the source to add</param>
        /// <response code="200">Successfully added source to database</response>
        /// <response code="400">Specified path does not exist or is already added</response>
        /// <returns></returns>
        [HttpPut("Sources")]
        [Authorize(Roles = UserRoles.Administrator)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddVideoSource(VideoSourceRequest request)
        {
            Result result = await _configManager.AddSource(request.Path);
            return FromResult(result);
        }

        /// <summary>
        /// Removes a video source from the database
        /// </summary>
        /// <param name="request">Contains details of the source to remove</param>
        /// <returns></returns>
        [HttpDelete("Sources")]
        [Authorize(Roles = UserRoles.Administrator)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveVideoSource(VideoSourceRequest request)
        {
            Result result = await _configManager.RemoveSource(request.Path);
            return FromResult(result);
        }
    }
}