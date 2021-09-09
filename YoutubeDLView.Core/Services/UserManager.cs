using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Enums;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Core.Services
{
    public class UserManager : IUserManager
    {
        private readonly IYoutubeDLViewDb _dbContext;
        private readonly IRandomGenerator _randomGenerator;
        
        public UserManager(IYoutubeDLViewDb dbContext, IRandomGenerator randomGenerator)
        {
            _dbContext = dbContext;
            _randomGenerator = randomGenerator;
        }

        public IQueryable<User> Users => _dbContext.Users.AsNoTracking();

        /// <inheritdoc />
        public Result<User> GetUser(ClaimsPrincipal claimsPrincipal)
        {
            string userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            User user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
            return user != null ? Result.Ok(user) : Result.Fail<User>("User not found", 404);
        }
        
        /// <inheritdoc />
        public async Task<Result<User>> CreateUser(string username, string password, UserRole role)
        {
            if (_dbContext.Users.Any(x => x.Username == username)) return Result.Fail<User>("Duplicate username", 400);
            
            User user = new(username, password, role, _randomGenerator.GenerateString(20));
            EntityEntry<User> addedUser = _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return Result.Ok(addedUser.Entity);
        }

        /// <inheritdoc />
        public async Task<Result<User>> CreateSetupUser(string username, string password)
        {
            if (_dbContext.Users.Any()) return Result.Fail<User>("Setup already complete", 400);
            return await CreateUser(username, password, UserRole.Administrator);
        }

        /// <inheritdoc />
        public async Task<User> UpdateRefreshKey(User user)
        {
            user.RefreshKey = _randomGenerator.GenerateString(20);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        /// <inheritdoc />
        public async Task<Result<User>> UpdateRefreshKey(string userId)
        {
            User user = Users.FirstOrDefault(x => x.Id == userId);
            if (user == null) return Result.Fail<User>("User not found", 404);
            User result = await UpdateRefreshKey(user);
            return Result.Ok(result);
        }

        /// <inheritdoc />
        public async Task<Result> UpdateUser(string userId, EntityUpdate<User> entityUpdate)
        {
            // Checks userId, and whether given username is already taken
            User user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);
            if (user == null) return Result.Fail("User not found", 404);
            if (_dbContext.Users.Any(x => x.Username == entityUpdate.EntityChanges.Username &&
                                          user.Username != entityUpdate.EntityChanges.Username))
                return Result.Fail("Username already taken", 400);
            
            // Applies the update to the user
            entityUpdate.Apply(user);
            await _dbContext.SaveChangesAsync();
            return Result.Ok();
        }
    }
}