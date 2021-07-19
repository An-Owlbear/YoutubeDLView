using System.Collections.Generic;

namespace YoutubeDLView.Data.Models
{
    public record VideoJson(
        string id,
        string uploader,
        string uploader_id,
        string upload_date,
        string title,
        string description,
        IEnumerable<string> categories,
        int duration,
        string _filename
    );
}