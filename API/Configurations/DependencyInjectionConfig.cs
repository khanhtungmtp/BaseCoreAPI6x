
using API._Repositories.Interfaces;
using API._Repositories.Repository;
using API._Services.Interfaces;
using API._Services.Services;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace API.Configurations
{
    public static class DependencyInjectionConfig
    {
        public static void AddDependencyInjectionConfig(this IServiceCollection services)
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));
            // add repository
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            // add services      
            services.AddScoped<IAuthServices, AuthServices>();
            services.AddScoped<IDatingServices, DatingServices>();
            services.AddScoped<IMessageServices, MessageServices>();
            services.AddScoped<IPhotoServices, PhotoServices>();
            services.AddScoped<IUserServices, UserServices>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }
    }
}