using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.API.Models;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Controllers
{
    [ApiController]
    [Route("Auth")]
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
        /// <param name="userId">The id of the user to login with</param>
        /// <param name="password">The password to login with</param>
        /// <response code="200">Returns login information</response>
        /// <response code="400">If the entered user id is invalid</response>
        /// <response code="401">If the entered password is incorrect</response>
        /// <returns><see cref="LoginInformation"/></returns>
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Login(string userId, string password)
        {
            User user = _userManager.Users.FirstOrDefault(x => x.Id == userId);
            if (user == null) return BadRequest("User not found");
            if (user.Password != password) return Unauthorized("Incorrect password");

            string accessToken = _tokenHandler.CreateAccessToken(user);
            string refreshToken = _tokenHandler.CreateRefreshToken(user);
            return Ok(new LoginInformation(user.Id, user.Username, accessToken, refreshToken));
        }

        /// <summary>
        /// Returns a new access token
        /// </summary>
        /// <param name="refreshToken">The refresh token to use</param>
        /// <returns><see cref="RefreshInformation  "/></returns>
        [HttpPost("Refresh")]
        public IActionResult RefreshAccessToken([FromBody] string refreshToken)
        {
            Result<ClaimsPrincipal> validateResult = _tokenHandler.ValidateRefreshToken(refreshToken);
            if (!validateResult.Success) return Unauthorized("Invalid refresh token");

            User user = _userManager.Users.FirstOrDefault(x =>
                x.Id == validateResult.Data.FindFirstValue(ClaimTypes.NameIdentifier));
            if (user == null) return BadRequest("Invalid JWT token");

            string accessToken = _tokenHandler.CreateAccessToken(user);
            return Ok(new RefreshInformation(user.Id, user.Username, accessToken));
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