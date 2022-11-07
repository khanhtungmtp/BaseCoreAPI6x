
namespace API.Models
{
    public class Like
    {
        public int liker_id { get; set; }
        public int likeeid { get; set; }
        public User likers { get; set; }
        public User likee { get; set; } // nguoi nhan
    }
}