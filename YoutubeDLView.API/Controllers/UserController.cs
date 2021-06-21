using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.Application.Services;
using YoutubeDLView.Domain.Common;
using YoutubeDLView.Domain.Enums;
using YoutubeDLView.Domain.Interfaces;

namespace YoutubeDLView.API.Controllers
{
    /// <summary>
    /// Controller containing endpoints relating to user accounts
    /// </summary>
    [ApiController]
    [Route("Users")]
    public class UserController : ControllerBase
    {
        private readonly IUserManager _userManager;

        /// <summary>
        /// Initializes an instance of <see cref="UserController"/>
        /// </summary>
        /// <param name="userManager">An instance of <see cref="UserManager"/></param>
        public UserController(IUserManager userManager)
        {
            _userManager = userManager;
        }

        /// <summary>
        /// Creates the first administrator account whilst setting up the application
        /// </summary>
        /// <param name="username">The username of the user to create</param>
        /// <param name="password">The password of the user to create</param>
        /// <response code="200">Successfully created setup account</response>
        /// <response code="400">Setup already completed</response>
        /// <returns></returns>
        [HttpPost("Setup")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateSetupUser(string username, string password)
        {
            if (_userManager.Users.Any()) return BadRequest("Setup already completed");
            
            Result result = await _userManager.CreateUser(username, password, UserRole.Administrator);
            return result.Success switch
            {
                true => Ok(),
                false => BadRequest(result.Error)
            };
        }
    }
}