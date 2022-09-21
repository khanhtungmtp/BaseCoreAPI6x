namespace API.Models
{
    public class User
    {
        public int id { get; set; }
        public string? username { get; set; }
        public byte[]? password_hash { get; set; }
        public byte[]? password_salt { get; set; }
        public string? gender { get; set; }
        public DateTime? date_of_birth { get; set; }
        public string? known_as { get; set; }
        public DateTime? created { get; set; }
        public DateTime? last_active { get; set; }
        public string? introduction { get; set; }
        public string? looking_for { get; set; }
        public string? interests { get; set; }
        public string? city { get; set; }
        public string? country { get; set; }
        public ICollection<Photo> photos { get; set; }


    }
}