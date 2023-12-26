
using API.Models;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Repositories.Interfaces
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IUnitOfWork
    {
        Task<bool> SaveAll();
    }
}