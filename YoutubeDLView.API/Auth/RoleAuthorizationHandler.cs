using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.API.Auth
{
    public class RoleAuthorizationHandler : AuthorizationHandler<RolesAuthorizationRequirement>
    {
        private readonly IUserManager _userManager;

        public RoleAuthorizationHandler(IUserManager userManager)
        {
            _userManager = userManager;
        }
        
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RolesAuthorizationRequirement requirement)
        {
            Result<User> result = _userManager.GetUser(context.User);
            if (!result.Success) return Task.CompletedTask;
            if (requirement.AllowedRoles.Any(x => result.Data.Role.ToString() == x)) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}