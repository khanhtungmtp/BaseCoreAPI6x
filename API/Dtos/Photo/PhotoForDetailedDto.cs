
namespace API.Dtos.Photo
{
    public class PhotoForDetailedDto
    {
        public PhotoForDetailedDto()
        {
            DateAdded = DateTime.Now;
        }

        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
    }
}