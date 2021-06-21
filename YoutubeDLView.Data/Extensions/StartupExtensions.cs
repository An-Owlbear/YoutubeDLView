using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using YoutubeDLView.Data.Services;

namespace YoutubeDLView.Data.Extensions
{
    public static class StartupExtensions
    {
        public static void AddYoutubeDLViewDb(this IServiceCollection services)
        {
            services.AddDbContext<YoutubeDLViewDb>(options => options.UseSqlite("Filename=YoutubeDLView.db"));
        }

        public static void AddUserManager(this IServiceCollection services)
        {
            services.AddScoped<UserManager>();
        }
    }
}