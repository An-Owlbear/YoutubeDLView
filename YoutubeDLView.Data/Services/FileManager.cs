using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;
using YoutubeDLView.Data.Models;

namespace YoutubeDLView.Data.Services
{
    public class FileManager : IFileManager
    {
        private readonly IOptionsMonitor<YoutubeDLViewConfig> _config;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<FileManager> _logger;

        public FileManager(IOptionsMonitor<YoutubeDLViewConfig> config, IServiceProvider serviceProvider, 
            ILogger<FileManager> logger)
        {
            _config = config;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        /// <inheritdoc />
        public async Task ScanFiles()
        {
            // Gets list of video metadata and retrieves database service
            IEnumerable<VideoJson> videos = await ScanDirectory(_config.CurrentValue.VideoPath);
            using IServiceScope scope = _serviceProvider.CreateScope();
            IYoutubeDLViewDb youtubeDlViewDb = scope.ServiceProvider.GetRequiredService<IYoutubeDLViewDb>();

            foreach (VideoJson videoJson in videos)
            {
                // Checks if the channel exists, adds to database if it doesn't
                YtChannel ytChannel = await youtubeDlViewDb.Channels.FindAsync(videoJson.uploader_id);
                if (ytChannel == null)
                {
                    YtChannel newYtChannel = new()
                    {
                        Id = videoJson.uploader_id,
                        Name = videoJson.uploader
                    };
                    await youtubeDlViewDb.Channels.AddAsync(newYtChannel);
                }
                
                // Adds video to database if not already present, otherwise updates it
                Video newVideo = new()
                {
                    Id = videoJson.id,
                    ChannelId = videoJson.uploader_id,
                    Description = videoJson.description,
                    UploadDate = videoJson.upload_date,
                    Length = videoJson.duration,
                    Path = videoJson._filename,
                    Title = videoJson.title
                };

                Video dbVideo = await youtubeDlViewDb.Videos.AsNoTracking()
                    .FirstOrDefaultAsync(x => x.Id == newVideo.Id);

                if (dbVideo == null) await youtubeDlViewDb.Videos.AddAsync(newVideo);
                else youtubeDlViewDb.Videos.Update(newVideo);
            }

            await youtubeDlViewDb.SaveChangesAsync();
        }

        private async Task<IEnumerable<VideoJson>> ScanDirectory(string path)
        {
            // Creates VideoJson list and adds files in current directory
            List<VideoJson> videos = new();
            IEnumerable<VideoJson> currentDirectoryVideos = await ScanDirectoryFiles(path);
            videos.AddRange(currentDirectoryVideos);
            
            // Get lists of files in child directories
            string[] directories = Directory.GetDirectories(path);
            IEnumerable<Task<IEnumerable<VideoJson>>> scanDirectoryTasks =
                directories.Select(async x => await ScanDirectory(x));
            IEnumerable<IEnumerable<VideoJson>> scanDirectoryResults = await Task.WhenAll(scanDirectoryTasks);
            
            // Adds VideoJson lists from child directories to main list
            foreach (IEnumerable<VideoJson> scanDirectoryResult in scanDirectoryResults)
                videos.AddRange(scanDirectoryResult);
            return videos;
        }

        private async Task<IEnumerable<VideoJson>> ScanDirectoryFiles(string path)
        {
            // Gets json files in current directory and reads data, returning the result
            IEnumerable<string> jsonFiles = Directory.GetFiles(path).Where(x => x.EndsWith(".info.json"));
            IEnumerable<Task<VideoJson>>
                jsonTasks = jsonFiles.Select(async x => await ReadMetadata(x));
            return await Task.WhenAll(jsonTasks);
        }

        private async Task<VideoJson> ReadMetadata(string path)
        {
            // Reads metadata from file and returns result, with full path
            _logger.LogInformation("Reading {Path}", path);
            Stream stream = File.OpenRead(path);
            VideoJson result = await JsonSerializer.DeserializeAsync<VideoJson>(stream);
            if (result == null) throw new NullReferenceException("Invalid Json file");
            return result with { _filename = Path.Join(Path.GetDirectoryName(path), result._filename) };
        }
    }
}