using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    public interface IYoutubeDLViewDb
    {
        DbSet<User> Users { get; set; }
        
        DbSet<Video> Videos { get; set; }
        
        DbSet<Channel> Channels { get; set; }

        DatabaseFacade Database { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}