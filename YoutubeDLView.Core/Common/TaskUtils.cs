using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YoutubeDLView.Core.Common
{
    public static class TaskUtils
    {
        public static async Task<IEnumerable<TResult>> WhenAllSuccess<TResult>(IEnumerable<Task<Result<TResult>>> tasks)
        {
            IEnumerable<Result<TResult>> results = await Task.WhenAll(tasks);
            return results
                .Where(x => x.Success)
                .Select(x => x.Data);
        }

        public static async Task<IEnumerable<TResult>> WhenAll<TResult>(this IEnumerable<Task<TResult>> tasks) =>
            await Task.WhenAll(tasks);
    }
}