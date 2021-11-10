using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;
using YoutubeDLView.Core.ValueObjects;

namespace YoutubeDLView.Core.Services
{
    public class ConfigManager : IConfigManager
    {
        private readonly IYoutubeDLViewDb _youtubeDlViewDb;

        public ConfigManager(IYoutubeDLViewDb youtubeDlViewDb)
        {
            _youtubeDlViewDb = youtubeDlViewDb;
        }

        /// <inheritdoc />
        public IEnumerable<VideoSource> GetSources() => _youtubeDlViewDb.VideoSources.ToList();

        /// <inheritdoc />
        public async Task<Result> AddSource(string path)
        {
            // Checks if path exists, and whether it is already added
            if (!Directory.Exists(path)) return Result.Fail("Folder does not exist");
            if (_youtubeDlViewDb.VideoSources.Any(x => x.Path == path)) return Result.Fail("Path already added");
            
            // Adds path to database
            await _youtubeDlViewDb.VideoSources.AddAsync(new VideoSource() { Path = path });
            await _youtubeDlViewDb.SaveChangesAsync();
            return Result.Ok();
        }

        /// <inheritdoc />
        public async Task<Result> RemoveSource(string path)
        {
            VideoSource source = await _youtubeDlViewDb.VideoSources.FindAsync(path);
            if (source == null) return Result.Fail("Source not found");
            _youtubeDlViewDb.VideoSources.Remove(source);
            await _youtubeDlViewDb.SaveChangesAsync();
            return Result.Ok();
        }

        /// <inheritdoc />
        public SystemInfo GetSystemInfo() => new SystemInfo(Environment.OSVersion.VersionString,
            Environment.MachineName, _youtubeDlViewDb.Users.Any());
    }
}