using System.ComponentModel.DataAnnotations;

namespace YoutubeDLView.Core.Entities
{
    public class Video
    {
        [Key]
        public string VideoId { get; set; }
        
        public string Title { get; set; }
        
        public string Description { get; set; }
        
        public string Length { get; set; }
        
        public string ChannelId { get; set; }
        
        public Channel Channel { get; set; }
    }
}