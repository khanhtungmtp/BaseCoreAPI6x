
namespace API.Dtos.Message
{
    public class MessageForCreationDto
    {
        public int sender_id { get; set; }
        public int recipient_id { get; set; }
        public DateTime message_sent { get; set; }
        public string content { get; set; }
        public MessageForCreationDto()
        {
            message_sent = DateTime.Now;
        }
    }
}