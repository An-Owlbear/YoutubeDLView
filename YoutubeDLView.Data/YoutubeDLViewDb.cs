using Microsoft.EntityFrameworkCore;
using YoutubeDLView.Application.Interfaces;
using YoutubeDLView.Domain.Entities;

namespace YoutubeDLView.Data
{
    public class YoutubeDLViewDb : DbContext, IYoutubeDLViewDb
    {
        public DbSet<User> Users { get; set; }

        public YoutubeDLViewDb(DbContextOptions<YoutubeDLViewDb> options) : base(options) { }
    }
}