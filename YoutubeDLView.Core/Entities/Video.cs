using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace YoutubeDLView.Core.Entities
{
    public class Video
    {
        [Key]
        public string Id { get; set; }
        
        public string Title { get; set; }
        
        public string Description { get; set; }
        
        public string UploadDate { get; set; }
        
        public int Length { get; set; }
        
        public string Path { get; set; }
        
        public string ChannelId { get; set; }
        
        public Channel Channel { get; set; }
    }
}