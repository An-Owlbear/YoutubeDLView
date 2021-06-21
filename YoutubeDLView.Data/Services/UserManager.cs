using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using YoutubeDLView.Common.Models;
using YoutubeDLView.Common.Services;
using YoutubeDLView.Data.Enums;
using YoutubeDLView.Data.Models;

namespace YoutubeDLView.Data.Services
{
    public class UserManager
    {
        private readonly YoutubeDLViewDb _dbContext;
        private readonly RandomGenerator _randomGenerator;
        
        public IEnumerable<User> Users { get; }
        
        public UserManager(YoutubeDLViewDb dbContext, RandomGenerator randomGenerator)
        {
            _dbContext = dbContext;
            _randomGenerator = randomGenerator;
            Users = dbContext.Users.ToList();
        }

        /// <summary>
        /// Creates a new user with the given information
        /// </summary>
        /// <param name="username">The username of the new user</param>
        /// <param name="password">The password of the new user</param>
        /// <param name="role">The role of the new user</param>
        /// <returns></returns>
        public async Task<Result<User>> CreateUser(string username, string password, UserRole role)
        {
            if (_dbContext.Users.Any(x => x.Username == username)) return Result.Fail<User>("Duplicate username");
            
            User user = new User(username, password, role, _randomGenerator.GenerateString(20));
            EntityEntry<User> addedUser = _dbContext.Add(user);
            await _dbContext.SaveChangesAsync();
            return Result.Ok(addedUser.Entity);
        }

        /// <summary>
        /// Updates a user's refresh key
        /// </summary>
        /// <param name="user">The user to update</param>
        /// <returns>The updated <see cref="User"/></returns>
        public async Task<User> UpdateRefreshKey(User user)
        {
            user.RefreshKey = _randomGenerator.GenerateString(20);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        /// <summary>
        /// Updates a user's refresh key by user id
        /// </summary>
        /// <param name="userId">The id of the user to update</param>
        /// <returns>The updated <see cref="User"/></returns>
        public async Task<Result<User>> UpdateRefreshKey(string userId)
        {
            User user = Users.FirstOrDefault(x => x.Id == userId);
            if (user == null) return Result.Fail<User>("User not found");
            User result = await UpdateRefreshKey(user);
            return Result.Ok(result);
        }
    }
}