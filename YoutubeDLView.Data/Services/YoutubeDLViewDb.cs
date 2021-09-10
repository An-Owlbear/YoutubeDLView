using Microsoft.EntityFrameworkCore;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Data
{
    public class YoutubeDLViewDb : DbContext, IYoutubeDLViewDb
    {
        public DbSet<User> Users { get; set; }
        
        public DbSet<Video> Videos { get; set; }
        
        public DbSet<YtChannel> Channels { get; set; }
        
        public DbSet<VideoSource> VideoSources { get; set; }

        public YoutubeDLViewDb(DbContextOptions<YoutubeDLViewDb> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseLazyLoadingProxies();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<User>()
                .Property(x => x.Role)
                .HasConversion<string>();
        }
    }
}