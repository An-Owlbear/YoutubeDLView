using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Data.Services
{
    public class FileManager : IFileManager
    {
        private readonly IOptionsMonitor<YoutubeDLViewConfig> _config;
        private readonly IServiceProvider _serviceProvider;

        public FileManager(IOptionsMonitor<YoutubeDLViewConfig> config, IServiceProvider serviceProvider)
        {
            _config = config;
            _serviceProvider = serviceProvider;
        }
        
        public async Task ScanFiles()
        {
            throw new NotImplementedException();
        }
    }
}