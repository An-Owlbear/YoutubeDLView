using System.ComponentModel.DataAnnotations;

namespace YoutubeDLView.Core.Entities
{
    public class VideoSource
    {
        [Key]
        public string Path { get; set; }
    }
}