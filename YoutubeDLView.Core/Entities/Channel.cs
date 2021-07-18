using System.ComponentModel.DataAnnotations;

namespace YoutubeDLView.Core.Entities
{
    public class Channel
    {
        [Key]
        public string Id { get; set; }
        
        public string Name { get; set; }
    }
}