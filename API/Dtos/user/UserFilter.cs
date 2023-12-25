
namespace API.Dtos.User
{
    public class UserFilter
    {
        public int user_id { get; set; }
        public string gender { get; set; }
        public int min_age { get; set; } = 18;
        public int max_age { get; set; } = 99;
        public string order_by { get; set; }
    }

    public class UserLikes
    {
        public int user_id { get; set; }
        public bool likers { get; set; } = false;
        public bool likees { get; set; } = false;
    }
}