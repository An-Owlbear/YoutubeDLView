using System.IO;

namespace YoutubeDLView.Core.ValueObjects
{
    public record VideoStream(Stream Video, string MimeType, string Filename);
}