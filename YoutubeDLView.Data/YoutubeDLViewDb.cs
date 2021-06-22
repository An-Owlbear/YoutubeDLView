using Microsoft.EntityFrameworkCore;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Data
{
    public class YoutubeDLViewDb : DbContext, IYoutubeDLViewDb
    {
        public DbSet<User> Users { get; set; }

        public YoutubeDLViewDb(DbContextOptions<YoutubeDLViewDb> options) : base(options) { }
    }
}