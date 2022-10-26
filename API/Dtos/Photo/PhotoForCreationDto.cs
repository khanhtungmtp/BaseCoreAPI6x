
namespace API.Dtos.Photo
{
    public class PhotoForCreationDto
    {
        public PhotoForCreationDto()
        {
            date_added = DateTime.Now;
        }
        public string url { get; set; }
        public IFormFile file { get; set; }
        public string description { get; set; }
        public DateTime date_added { get; set; }
        public string public_id { get; set; }
    }
}