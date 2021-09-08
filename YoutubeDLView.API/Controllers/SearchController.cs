using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.API.Models;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Controllers
{
    /// <summary>
    /// Controller containing endpoints relating to searching
    /// </summary>
    [ApiController]
    [Route("Search")]
    public class SearchController : ApiController
    {
        private readonly ISearchManager _searchManager;

        public SearchController(ISearchManager searchManager)
        {
            _searchManager = searchManager;
        }

        /// <summary>
        /// Returns the search results for the given search
        /// </summary>
        /// <param name="input">The term to search for</param>
        /// <param name="skip">The amount of results to skip</param>
        /// <param name="take">The amount of results to take</param>
        /// <response code="200">Returns results</response>
        /// <returns></returns>
        [HttpGet("/{input}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetResults(string input, int skip = 0, int take = 30)
        {
            IEnumerable<Video> videos = _searchManager.SearchVideo(input, skip, take);
            return Ok(videos.Select(x => new VideoResponse(x)));
        }
    }
}