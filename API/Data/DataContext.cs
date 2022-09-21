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

    }
}