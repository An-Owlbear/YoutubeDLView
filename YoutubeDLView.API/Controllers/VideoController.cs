using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        public VideoController(IFileManager fileManager)
        {
            _fileManager = fileManager;
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
    }
}