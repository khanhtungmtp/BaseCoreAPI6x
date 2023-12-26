
using API.Models;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Repositories.Interfaces
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IUnitOfWork
    {
        IRepository<User> User { get; }
        IRepository<Like> Like { get; }
        IRepository<Message> Message { get; }
        IRepository<Photo> Photo { get; }
        Task<bool> SaveAll();
    }
}