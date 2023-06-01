using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
namespace API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Like { get; set; }
        public DbSet<Message> Messages { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(x => x.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

            builder.Entity<Role>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .IsRequired();

            builder.Entity<Like>().HasKey(k => new { k.liker_id, k.likee_id });
            builder.Entity<Like>()
            .HasOne(u => u.likee)
            .WithMany(u => u.likers)
            .HasForeignKey(u => u.likee_id)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
            .HasOne(u => u.likers)
            .WithMany(u => u.likees)
            .HasForeignKey(u => u.liker_id)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
            .HasOne(u => u.sender)
            .WithMany(m => m.message_sent)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
            .HasOne(u => u.recipient)
            .WithMany(m => m.message_received)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }
}