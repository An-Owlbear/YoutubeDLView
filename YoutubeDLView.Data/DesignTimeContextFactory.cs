using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace YoutubeDLView.Data
{
    /// <summary>
    /// A class used by EF Core CLI for migrations
    /// </summary>
    public class DesignTimeContextFactory : IDesignTimeDbContextFactory<YoutubeDLViewDb>
    {
        public YoutubeDLViewDb CreateDbContext(string[] args)
        {
            DbContextOptionsBuilder<YoutubeDLViewDb> builder = new ();
            builder.UseSqlite("Filename=YoutubeDLView.db");
            return new YoutubeDLViewDb(builder.Options);
        }
    }
}