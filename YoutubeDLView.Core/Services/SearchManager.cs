using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Core.Services
{
    public class SearchManager : ISearchManager
    {
        private readonly IYoutubeDLViewDb _youtubeDlViewDb;

        public SearchManager(IYoutubeDLViewDb youtubeDlViewDb)
        {
            _youtubeDlViewDb = youtubeDlViewDb;
        }
        
        /// <inheritdoc />
        public IEnumerable<Video> SearchVideo(string searchTerm, int skip, int take)
        {
            string preparedSearchTerm = Regex.Escape(searchTerm.Trim()).ToLower();
            string regexQuery = $"(^|[^a-z0-9]+){preparedSearchTerm}([^a-z0-9]|$)";
            return _youtubeDlViewDb.Videos.ToList()
                .OrderByDescending(x => x.UploadDate)
                .Skip(skip)
                .Where(x => Regex.IsMatch(x.Title.ToLower(), regexQuery))
                .Take(take);
        }
    }
}