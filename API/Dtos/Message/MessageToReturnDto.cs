
namespace API.Dtos.Message
{
    public class MessageToReturnDto
    {
        public int id { get; set; }
        public int senderid { get; set; }
        public string sender_known_as { get; set; }
        public string sender_photo_url { get; set; }
        public int recipientid { get; set; }
        public string recipient_known_as { get; set; }
        public string recipient_photo_url { get; set; }
        public string content { get; set; }
        public bool is_read { get; set; }
        public DateTime? date_read { get; set; }
        public DateTime message_sent { get; set; }
    }
}