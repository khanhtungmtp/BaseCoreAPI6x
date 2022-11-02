
namespace API.Dtos.user
{
    public class UserFilter
    {
        public int user_id { get; set; }
        public string gender { get; set; }
        public int min_age { get; set; } = 18;
        public int max_age { get; set; } = 99;

    }
}