using System.ComponentModel.DataAnnotations;

namespace API.Dtos.User
{
    public class RegisterUserDto
    {
        public RegisterUserDto()
        {
            this.created = DateTime.Now;
            this.last_active = DateTime.Now;
        }
        [Required]
        public string username { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "You must specify password between 4 and 8 characters")]
        public string password { get; set; }
        [Required]
        public string gender { get; set; }
        [Required]
        public string known_as { get; set; }
        [Required]
        public DateTime date_of_birth { get; set; }
        [Required]
        public string city { get; set; }
        [Required]
        public string country { get; set; }
        public DateTime created { get; set; }
        public DateTime last_active { get; set; }
    }
}