using API.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<ValueTestModel> ValueTestModels { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Like>().HasKey(k => new { k.liker_id, k.likeeid });
            builder.Entity<Like>()
            .HasOne(u => u.likee)
            .WithMany(u => u.likers)
            .HasForeignKey(u => u.likeeid)
            .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Like>()
            .HasOne(u => u.likers)
            .WithMany(u => u.likees)
            .HasForeignKey(u => u.liker_id)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }
}