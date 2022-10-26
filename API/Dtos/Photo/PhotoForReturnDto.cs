
namespace API.Dtos.Photo
{
    public class PhotoForReturnDto
    {
        public int id { get; set; }
        public string url { get; set; }
        public string description { get; set; }
        public DateTime? date_added { get; set; }
        public bool is_main { get; set; }
        public bool is_approved { get; set; }
        public string public_id { get; set; }
    }
}