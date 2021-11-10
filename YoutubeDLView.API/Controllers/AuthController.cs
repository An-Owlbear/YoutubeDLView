using System.Linq;
using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.API.Models;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Controllers
{
    [ApiController]
    [Route("Auth")]
    [Produces(MediaTypeNames.Application.Json)]
    public class AuthController : Controller
    {
        private readonly IUserManager _userManager;
        private readonly IJwtTokenHandler _tokenHandler;

        public AuthController(IJwtTokenHandler tokenHandler, IUserManager userManager)
        {
            _tokenHandler = tokenHandler;
            _userManager = userManager;
        }

        /// <summary>
        /// Authenticates a user, returning access and refresh tokens
        /// </summary>
        /// <param name="request">Contains the username and password of the request</param>
        /// <response code="200">Returns login information</response>
        /// <response code="400">If the entered user id is invalid</response>
        /// <response code="401">If the entered password is incorrect</response>
        /// <returns><see cref="LoginInformation"/></returns>
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<LoginInformation> Login([FromBody] LoginRequest request)
        {
            User user = _userManager.Users.FirstOrDefault(x => x.Username == request.Username);
            if (user == null) return BadRequest("User not found");
            if (!user.CheckPassword(request.Password)) return Unauthorized("Incorrect password");

            string accessToken = _tokenHandler.CreateAccessToken(user);
            string refreshToken = user.RefreshKey;
            return new LoginInformation(user.Id, user.Username, user.Role.ToString(), accessToken, refreshToken);
        }

        /// <summary>
        /// Returns a new access token
        /// </summary>
        /// <param name="request">The refresh token to use</param>
        /// <returns><see cref="RefreshInformation"/></returns>
        [HttpPost("Refresh")]
        public ActionResult<RefreshInformation> RefreshAccessToken([FromBody] RequestRefreshModel request)
        {
            User user = _userManager.Users.FirstOrDefault(x => x.RefreshKey == request.RefreshToken);
            if (user == null) return Unauthorized("Invalid refresh token");
            
            string accessToken = _tokenHandler.CreateAccessToken(user);
            return new RefreshInformation(user.Id, user.Username, accessToken);
        }
        
        /// <summary>
        /// Tests the user is authorized
        /// </summary>
        /// <returns></returns>
        [HttpGet("Test")]
        [Authorize]
        public IActionResult Test()
        {
            return Ok();
        }
    }
}