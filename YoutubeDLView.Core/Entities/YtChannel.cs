using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace YoutubeDLView.Core.Entities
{
    public class YtChannel
    {
        [Key]
        public string Id { get; set; }
        
        public string Name { get; set; }
        
        public virtual ICollection<Video> Videos { get; set; }
    }
}