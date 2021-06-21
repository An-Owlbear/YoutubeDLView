using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using YoutubeDLView.Application.Interfaces;
using YoutubeDLView.Application.Services;
using YoutubeDLView.Domain.Interfaces;

namespace YoutubeDLView.Data.Extensions
{
    public static class StartupExtensions
    {
        public static void AddYoutubeDLViewDb(this IServiceCollection services)
        {
            services.AddDbContext<IYoutubeDLViewDb, YoutubeDLViewDb>(options => options.UseSqlite("Filename=YoutubeDLView.db"));
        }

        public static void AddUserManager(this IServiceCollection services)
        {
            services.AddScoped<IUserManager, UserManager>();
        }
    }
}