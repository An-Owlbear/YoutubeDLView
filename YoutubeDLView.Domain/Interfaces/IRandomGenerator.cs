namespace YoutubeDLView.Domain.Interfaces
{
    public interface IRandomGenerator
    {
        /// <summary>
        /// Generates a random hex string of the given length in bytes 
        /// </summary>
        /// <param name="byteLength">The length of the string to generate in bytes</param>
        /// <returns>The generated <see cref="string"/></returns>
        string GenerateString(int byteLength);
    }
}