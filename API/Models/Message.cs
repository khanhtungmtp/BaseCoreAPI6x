
namespace API.Models
{
    public class Message
    {
        public int id { get; set; }
        public int send_id { get; set; }
        public User sender { get; set; }
        public int recipient_id { get; set; }
        public User recipient { get; set; }
        public string content { get; set; }
        public bool is_read { get; set; }
        public DateTime? date_read { get; set; }
        public DateTime message_sent { get; set; }
        public bool sender_deleted { get; set; }
        public bool recipient_deleted { get; set; }



    }
}