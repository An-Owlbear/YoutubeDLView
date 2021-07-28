using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Interfaces;
using Channel = YoutubeDLView.Core.Entities.Channel;

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
            Result<Channel> channel = await _channelManager.GetChannel(channelId);
            return channel.Success switch
            {
                true => Ok(channel.Data),
                false => FromResult(channel)
            };
        }
    }
}