using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Entities;
using YoutubeDLView.Core.Interfaces;
using YoutubeDLView.Data.Models;

namespace YoutubeDLView.Data.Services
{
    public class FileManager : IFileManager
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<FileManager> _logger;

        public FileManager(IServiceProvider serviceProvider, ILogger<FileManager> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        /// <inheritdoc />
        public async Task ScanFiles()
        {
            // Retrieves database service and begins transaction
            using IServiceScope scope = _serviceProvider.CreateScope();
            IYoutubeDLViewDb youtubeDlViewDb = scope.ServiceProvider.GetRequiredService<IYoutubeDLViewDb>();
            await using IDbContextTransaction transaction = await youtubeDlViewDb.Database.BeginTransactionAsync();
            
            // Prepares list of current videos to track videos to remove
            List<Video> removeVideos = await youtubeDlViewDb.Videos.AsNoTracking().ToListAsync();

            // Retrieves lists of videos and joins them
            IEnumerable<VideoSource> sources = youtubeDlViewDb.VideoSources.ToList();
            IEnumerable<IEnumerable<VideoJson>> videoLists = await sources
                .Select(async x => await ScanDirectory(x.Path))
                .WhenAll();
            IEnumerable<VideoJson> videos = videoLists.SelectMany(x => x);

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
                else
                {
                    youtubeDlViewDb.Videos.Update(newVideo);
                    removeVideos.RemoveFirst(x => x.Id == newVideo.Id);
                }
            }

            // Removes videos that were not found on rescan
            youtubeDlViewDb.Videos.RemoveRange(removeVideos);
            await youtubeDlViewDb.SaveChangesAsync();
            
            // Removes channels with no videos
            IEnumerable<YtChannel> removeChannels = youtubeDlViewDb.Channels.Where(x => !x.Videos.Any());
            youtubeDlViewDb.Channels.RemoveRange(removeChannels);
            await youtubeDlViewDb.SaveChangesAsync();

            await transaction.CommitAsync();
        }

        private async Task<IEnumerable<VideoJson>> ScanDirectory(string path)
        {
            // Creates VideoJson list and adds files in current directory
            List<VideoJson> videos = new();
            IEnumerable<VideoJson> currentDirectoryVideos = await ScanDirectoryFiles(path);
            videos.AddRange(currentDirectoryVideos);
            
            // Get lists of files in child directories
            IEnumerable<string> directories = Directory.GetDirectories(path).Where(x => !IsHidden(x));
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
            IEnumerable<Task<Result<VideoJson>>> jsonTasks = jsonFiles.Select(async x => await ReadMetadata(x));
            return await TaskUtils.WhenAllSuccess(jsonTasks);
        }

        private async Task<Result<VideoJson>> ReadMetadata(string path)
        {
            // Reads and converts json file
            _logger.LogInformation("Reading {Path}", path);
            Stream stream = File.OpenRead(path);
            VideoJson result = await JsonSerializer.DeserializeAsync<VideoJson>(stream);
            stream.Close();
            
            // Returns failure if invalid
            if (result is not { _type: null }) return Result.Fail<VideoJson>("Invalid json file");
            
            // Checks filepath of video, returning invalid if unable to find
            string videoPath = GetVideoFilepath(result, path);
            if (videoPath == null) return Result.Fail<VideoJson>("Video file could not be found");
            
            // Returns video json
            VideoJson videoJson = result with { _filename = videoPath };
            return Result.Ok(videoJson);
        }

        private bool IsHidden(string name)
        {
            string shortName = Path.GetFileName(name);
            if (shortName == null) return true;
            return shortName.StartsWith('.');
        }

        private string GetVideoFilepath(VideoJson json, string jsonPath)
        {
            if (json._filename != null) return Path.Join(Path.GetDirectoryName(jsonPath), json._filename);
            string possibleFilename = Regex.Replace(jsonPath, @".info.json$", ".mkv");
            return File.Exists(possibleFilename) ? possibleFilename : null;
        }
    }
}