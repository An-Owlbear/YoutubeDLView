using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YoutubeDLView.API.Models;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Controllers
{
    [Route("/Channels")]
    public class ChannelController : ApiController
    {
        private readonly IChannelManager _channelManager;

        public ChannelController(IChannelManager channelManager)
        {
            _channelManager = channelManager;
        }

        /// <summary>
        /// Retrieves information about a channel
        /// </summary>
        /// <param name="channelId">The id of the channel to retrieve</param>
        /// <response code="200">Channel successfully retrieved</response>
        /// <response code="404">Channel with given id not found</response>
        /// <returns></returns>
        [HttpGet("{channelId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetChannel(string channelId)
        {
            Result<YtChannel> channel = await _channelManager.GetChannel(channelId);
            return channel.Success switch
            {
                true => Ok(channel.Data),
                false => FromResult(channel)
            };
        }

        /// <summary>
        /// Retrieves a list of channels, with an optional limit
        /// </summary>
        /// <param name="skip">The number of channels to skip</param>
        /// <param name="take">The number of channels to select to return</param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetChannels(int skip = 0, int take = 30)
        {
            IEnumerable<YtChannel> channels =
                await _channelManager.Channels
                    .OrderBy(x => x.Name)
                    .Skip(skip)
                    .Take(take)
                    .ToListAsync();
            return Ok(channels);
        }

        /// <summary>
        /// Retrieves a list of videos from the specified channel
        /// </summary>
        /// <param name="channelId">The id of the channel to retrieve videos from</param>
        /// <param name="skip">The number of videos to skip</param>
        /// <param name="take">The number of videos to return</param>
        /// <returns></returns>
        [HttpGet("{channelId}/videos")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetVideos(string channelId, int skip = 0, int take = 30)
        {
            Result<IEnumerable<Video>> videos = await _channelManager.GetVideos(channelId, skip, take);
            return videos.Success switch
            {
                true => Ok(videos.Data.Select(x => new VideoResponse(x))),
                false => FromResult(videos)
            };
        }
    }
}