using System;
using System.Security.Cryptography;

namespace YoutubeDLView.Common.Services
{
    public class RandomGenerator
    {
        private readonly RNGCryptoServiceProvider _generator;

        public RandomGenerator()
        {
            _generator = new RNGCryptoServiceProvider();
        }
        
        public string GenerateString(int byteLength)
        {
            byte[] bytes = new byte[byteLength];
            _generator.GetBytes(bytes);
            return BitConverter.ToString(bytes).Replace("-", string.Empty);
        }
    }
}