using System.ComponentModel.DataAnnotations;

namespace API.Dtos.User
{
    public class RegisterUserDto
    {
        public RegisterUserDto()
        {
            this.Created = DateTime.Now;
            this.LastActive = DateTime.Now;
        }
        [Required]
        public string UserName { get; set; }
        [Required]
        [StringLength(32, MinimumLength = 4, ErrorMessage = "You must specify password between 8 and 32 characters")]
        public string Password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}