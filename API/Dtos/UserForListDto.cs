
namespace API.Dtos
{
    public class UserForListDto
    {
        public int id { get; set; }
        public string? username { get; set; }
        public string? gender { get; set; }
        public int? age { get; set; }
        public string? known_as { get; set; }
        public DateTime? created { get; set; }
        public DateTime? last_active { get; set; }
        public string? city { get; set; }
        public string? country { get; set; }
        public string? photo_url { get; set; }
    }
}