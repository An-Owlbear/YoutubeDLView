using System;
using System.ComponentModel.DataAnnotations;
using YoutubeDLView.Core.Enums;

namespace YoutubeDLView.Core.Entities
{
    public class User
    {
        [Key]
        public string Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
        public string RefreshKey { get; set; }

        public User() { }
        
        public User(string username, string password, UserRole role, string refreshKey)
        {
            Id = Guid.NewGuid().ToString();
            Username = username;
            Password = password;
            Role = role;
            RefreshKey = refreshKey;
        }
    }
}