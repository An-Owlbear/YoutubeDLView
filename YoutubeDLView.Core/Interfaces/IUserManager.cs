using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Enums;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IUserManager
    {
        /// <summary>
        /// A queryable list of all users
        /// </summary>
        IQueryable<User> Users { get; }
        
        /// <summary>
        /// Retrieves a user from the given ClaimsPrincipal
        /// </summary>
        /// <param name="claimsPrincipal">The ClaimsPrincipal describing the user to retrieve</param>
        /// <returns>A successful result if the user if found, or a failure if none are</returns>
        Result<User> GetUser(ClaimsPrincipal claimsPrincipal);

        /// <summary>
        /// Creates a new user with the given information
        /// </summary>
        /// <param name="username">The username of the new user</param>
        /// <param name="password">The password of the new user</param>
        /// <param name="role">The role of the new user</param>
        /// <returns>The created <see cref="User"/></returns>
        Task<Result<User>> CreateUser(string username, string password, UserRole role);

        /// <summary>
        /// Creates the initial administrator user
        /// </summary>
        /// <param name="username">The username of the new user</param>
        /// <param name="password">The password of the new user</param>
        /// <returns>The create <see cref="User"/></returns>
        Task<Result<User>> CreateSetupUser(string username, string password);

        /// <summary>
        /// Updates the refresh key of the given user
        /// </summary>
        /// <param name="user">The target user</param>
        /// <returns>The updated <see cref="User"/></returns>
        Task<User> UpdateRefreshKey(User user);

        /// <summary>
        /// Updates a user's refresh key by user id
        /// </summary>
        /// <param name="userId">The id of the user to update</param>
        /// <remarks>
        /// This overload returns a <see cref="User"/> encapsulated in a <see cref="Result"/> in order to account for
        /// the possibility of an invalid id being passed
        /// </remarks>
        /// <returns>The updated <see cref="User"/></returns>
        Task<Result<User>> UpdateRefreshKey(string userId);
        
        /// <summary>
        /// Updates a user's information
        /// </summary>
        /// <param name="userId">The id of the user to update</param>
        /// <param name="userUpdate">The update information of the user</param>
        /// <returns></returns>
        Task<Result> UpdateUser(string userId, UserUpdate userUpdate);

        /// <summary>
        /// Deletes the given user, if it is not the only account, or the only administrator account
        /// </summary>
        /// <param name="userId">The id of the user to delete</param>
        /// <param name="currentUser">The user performing the delete request</param>
        /// <returns></returns>
        Task<Result> DeleteUser(string userId, User currentUser);
    }
}