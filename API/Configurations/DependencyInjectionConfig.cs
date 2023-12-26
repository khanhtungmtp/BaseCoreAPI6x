using System.Reflection;
namespace API.Configurations
{
    public static class DependencyInjectionConfig
    {
        // public static void AddDependencyInjectionConfig(this IServiceCollection services)
        // {
        //     if (services == null)
        //         throw new ArgumentNullException(nameof(services));
        //     // add repository
        //     services.AddScoped<IUnitOfWork, UnitOfWork>();
        //     // add services      
        //     services.AddScoped<IAuthServices, AuthServices>();
        //     services.AddScoped<IDatingServices, DatingServices>();
        //     services.AddScoped<IMessageServices, MessageServices>();
        //     services.AddScoped<IPhotoServices, PhotoServices>();
        //     services.AddScoped<IUserServices, UserServices>();
        //     services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        //     services.AddSignalR();
        // }

        public static IServiceCollection AddDependencyInjectionConfiguration(this IServiceCollection services, Type targetProject)
        {
            IEnumerable<Type> typesWith = GetTypesWith<DependencyInjectionAttribute>(inherit: true);
            foreach (Type implementedType in typesWith)
            {
                IEnumerable<Type> enumerable = from t in targetProject.Assembly.GetTypes()
                                               where t.GetInterfaces().Contains(implementedType)
                                               select t;
                foreach (Type item in enumerable)
                {
                    DependencyInjectionAttribute customAttribute = implementedType.GetCustomAttribute<DependencyInjectionAttribute>();
                    if (customAttribute != null)
                    {
                        services.Add(new ServiceDescriptor(implementedType, item, customAttribute.ServiceLifetime));
                    }
                }
            }

            return services;
        }

        private static IEnumerable<Type> GetTypesWith<TAttribute>(bool inherit) where TAttribute : Attribute
        {
            return from a in AppDomain.CurrentDomain.GetAssemblies()
                   from t in a.GetTypes()
                   where t.IsDefined(typeof(TAttribute), inherit)
                   select t;
        }

        public class DependencyInjectionAttribute : Attribute
        {
            public readonly ServiceLifetime ServiceLifetime;

            public DependencyInjectionAttribute(ServiceLifetime serviceLifetime)
            {
                ServiceLifetime = serviceLifetime;
            }
        }
    }
}