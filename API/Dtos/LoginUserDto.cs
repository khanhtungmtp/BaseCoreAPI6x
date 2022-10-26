
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class LoginUserParam
    {
        public string username { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "You must specify password between 4 and 8 characters")]

        public string password { get; set; }
    }
}