using Microsoft.EntityFrameworkCore;
using YoutubeDLView.Data.Models;

namespace YoutubeDLView.Data
{
    public class YoutubeDLViewDb : DbContext
    {
        public DbSet<User> Users { get; set; }

        public YoutubeDLViewDb(DbContextOptions<YoutubeDLViewDb> options) : base(options) { }
    }
}