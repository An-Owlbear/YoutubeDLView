using System.Collections.Generic;
using YoutubeDLView.Core.Entities;

namespace YoutubeDLView.Core.Interfaces
{
    
    public interface ISearchManager
    {
        /// <summary>
        /// Returns a list of matching videos, newest to oldest, which match the specified search term
        /// </summary>
        /// <param name="searchTerm">The term to search for</param>
        /// <param name="skip">The amount of videos to skip</param>
        /// <param name="take">The amount of videos to </param>
        /// <returns></returns>
        IEnumerable<Video> SearchVideo(string searchTerm, int skip, int take);
    }
}