using System;

namespace YoutubeDLView.API.Models
{
    public class SystemInfo
    {
        public string OperatingSystem { get; set; }
        public string Hostname { get; set; }
        public bool Setup { get; set; }

        public SystemInfo()
        {
            OperatingSystem = Environment.OSVersion.VersionString;
            Hostname = Environment.MachineName;
            Setup = false;
        }
    }
}