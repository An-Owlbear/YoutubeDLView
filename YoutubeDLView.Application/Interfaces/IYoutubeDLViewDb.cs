using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using YoutubeDLView.Domain.Entities;

namespace YoutubeDLView.Application.Interfaces
{
    public interface IYoutubeDLViewDb
    {
        DbSet<User> Users { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}