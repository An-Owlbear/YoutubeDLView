using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using YoutubeDLView.Domain.Entities;

namespace YoutubeDLView.Application.Interfaces
{
    public interface IYoutubeDLViewDb
    {
        DbSet<User> Users { get; set; }

        DatabaseFacade Database { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}