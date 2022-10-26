
namespace API.Dtos
{
    public class PhotoForDetailedDto
    {
        public int id { get; set; }
        public string url { get; set; }
        public string description { get; set; }
        public DateTime date_added { get; set; }
        public bool is_main { get; set; }
    }
}