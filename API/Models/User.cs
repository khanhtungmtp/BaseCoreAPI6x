using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace API.Models
{
    public class User : IdentityUser<int>
    {
        public string gender { get; set; }
        public DateTime date_of_birth { get; set; }
        public string known_as { get; set; }
        public DateTime created { get; set; } = DateTime.Now;
        public DateTime last_active { get; set; } = DateTime.Now;
        public string introduction { get; set; }
        public string looking_for { get; set; }
        public string interests { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public ICollection<Photo> photos { get; set; }
        public ICollection<Like> likers { get; set; }
        public ICollection<Like> likees { get; set; } // nguoi nhan
        public ICollection<Message> message_sent { get; set; }
        public ICollection<Message> message_received { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }

    }
}