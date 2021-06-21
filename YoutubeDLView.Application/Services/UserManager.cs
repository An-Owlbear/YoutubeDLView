using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using YoutubeDLView.Application.Interfaces;
using YoutubeDLView.Domain.Common;
using YoutubeDLView.Domain.Entities;
using YoutubeDLView.Domain.Enums;
using YoutubeDLView.Domain.Interfaces;

namespace YoutubeDLView.Application.Services
{
    public class UserManager: IUserManager
    {
        private readonly IYoutubeDLViewDb _dbContext;
        private readonly IRandomGenerator _randomGenerator;
        
        /// <inheritdoc />
        public IEnumerable<User> Users { get; }
        
        public UserManager(IYoutubeDLViewDb dbContext, IRandomGenerator randomGenerator)
        {
            _dbContext = dbContext;
            _randomGenerator = randomGenerator;
            Users = dbContext.Users.ToList<User>();
        }

        /// <inheritdoc />
        public async Task<Result<User>> CreateUser(string username, string password, UserRole role)
        {
            if (_dbContext.Users.Any<User>(x => x.Username == username)) return Result.Fail<User>("Duplicate username");
            
            User user = new User(username, password, role, _randomGenerator.GenerateString(20));
            EntityEntry<User> addedUser = _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return Result.Ok(addedUser.Entity);
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
            if (user == null) return Result.Fail<User>("User not found");
            User result = await UpdateRefreshKey(user);
            return Result.Ok(result);
        }
    }
}