
namespace API.Models
{
    public class Like
    {
        public int LikerId { get; set; }
        public int LikeeId { get; set; }
        public User Likers { get; set; }
        public User Likee { get; set; } // nguoi nhan
    }
}