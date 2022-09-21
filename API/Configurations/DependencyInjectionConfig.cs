
using API._Repositories.Interfaces;
using API._Repositories.Repository;
using API.Data;

namespace API.Configurations
{
    public static class DependencyInjectionConfig
    {
        public static void AddDependencyInjectionConfig(this IServiceCollection services)
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));
            // add repository
            services.AddScoped<IAuthRepository, AuthRepository>();
            // add services           
        }
    }
}