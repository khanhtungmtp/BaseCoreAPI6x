
namespace API.Dtos.Message
{
    public class MessageForCreationDto
    {
        public int senderid { get; set; }
        public int recipientid { get; set; }
        public DateTime message_sent { get; set; }
        public string content { get; set; }
    }
}