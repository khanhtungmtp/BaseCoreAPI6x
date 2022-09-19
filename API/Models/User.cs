namespace API.Models
{
    public class User
    {
        public int id { get; set; }
        public string? username { get; set; }
        public byte[]? password_hash {get;set;}
        public byte[]? password_salt {get;set;}


    }
}