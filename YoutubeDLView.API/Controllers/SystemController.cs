using System.Net.Mime;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.API.Models;

namespace YoutubeDLView.API.Controllers
{
    /// <summary>
    /// Controller containing endpoints relating to the application
    /// </summary>
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    public class SystemController : ControllerBase
    {
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
    }
}