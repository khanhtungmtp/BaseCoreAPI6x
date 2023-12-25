
namespace API._Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository User { get; }
        ILikeRepository Like { get; }
        IMessageRepository Message { get; }
        IPhotoRepository Photo { get; }
        Task<bool> SaveAll();
    }
}