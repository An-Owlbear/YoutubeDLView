using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.API.Models;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Enums;
using YoutubeDLView.Core.Interfaces;
using YoutubeDLView.Core.Services;

namespace YoutubeDLView.API.Controllers
{
    /// <summary>
    /// Controller containing endpoints relating to user accounts
    /// </summary>
    [ApiController]
    [Route("Users")]
    [Produces(MediaTypeNames.Application.Json)]
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
        /// <param name="request">Contains the username and password of the signup</param>
        /// <response code="200">Successfully created setup account</response>
        /// <response code="400">Setup already completed</response>
        /// <returns></returns>
        [HttpPost("Setup")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateSetupUser([FromBody] SignupRequest request)
        {
            if (_userManager.Users.Any()) return BadRequest("Setup already completed");
            
            Result result = await _userManager.CreateUser(request.Username, request.Password, UserRole.Administrator);
            return result.Success switch
            {
                true => Ok(),
                false => BadRequest(result.Error)
            };
        }

        /// <summary>
        /// Creates a new user account
        /// </summary>
        /// <param name="request">Specifies the information of the account to create</param>
        /// <response code="200">Successfully created account</response>
        /// <response code="400">Username already in use</response>
        /// <returns></returns>
        [HttpPost("Create")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateUser([FromBody] SignupRequest request)
        {
            Result result = await _userManager.CreateUser(request.Username, request.Password, UserRole.User);
            return result.Success switch
            {
                true => Ok(),
                false => BadRequest(result.Error)
            };
        }
    }
}