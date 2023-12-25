
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class LoginUserParam
    {
        public string username { get; set; }
        [Required]
        [StringLength(32, MinimumLength = 8, ErrorMessage = "You must specify password between 8 and 32 characters")]

        public string password { get; set; }
    }
}