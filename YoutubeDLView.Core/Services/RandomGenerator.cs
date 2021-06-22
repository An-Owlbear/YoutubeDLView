using System;
using System.Security.Cryptography;
using YoutubeDLView.Core.Interfaces;

namespace YoutubeDLView.Core.Services
{
    public class RandomGenerator : IRandomGenerator
    {
        private readonly RNGCryptoServiceProvider _generator;

        public RandomGenerator()
        {
            _generator = new RNGCryptoServiceProvider();
        }
        
        /// <ihneritdoc />
        public string GenerateString(int byteLength)
        {
            byte[] bytes = new byte[byteLength];
            _generator.GetBytes(bytes);
            return BitConverter.ToString(bytes).Replace("-", string.Empty);
        }
    }
}