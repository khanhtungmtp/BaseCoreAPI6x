
namespace API.Models
{
    public class Message
    {
        public int id { get; set; }
        public int senderid { get; set; }
        public User sender { get; set; }
        public int recipientid { get; set; }
        public User recipient { get; set; }
        public string content { get; set; }
        public bool is_read { get; set; }
        public DateTime? date_read { get; set; }
        public DateTime message_sent { get; set; } = DateTime.Now;
        public bool sender_deleted { get; set; }
        public bool recipient_deleted { get; set; }

    }
}