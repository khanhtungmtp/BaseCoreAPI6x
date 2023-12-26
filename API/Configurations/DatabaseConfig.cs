using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Configurations
{
    public static class DatabaseConfig
    {
        public static void AddDatabaseConfig(this IServiceCollection services, IConfiguration configuration)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));
            string area = configuration.GetSection("Appsetting:Area").Value;
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        }
    }
}