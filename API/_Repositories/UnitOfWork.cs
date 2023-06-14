
using API._Repositories.Interfaces;
using API.Data;
namespace API._Repositories.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _dataContext;
        public UnitOfWork(DataContext dataContext)
        {
            _dataContext = dataContext;
            User = new UserRepository(_dataContext);
            Like = new LikeRepository(_dataContext);
            Message = new MessageRepository(_dataContext);
            Photo = new PhotoRepository(_dataContext);
        }
        public IUserRepository User { get; private set; }

        public ILikeRepository Like { get; private set; }

        public IMessageRepository Message { get; private set; }

        public IPhotoRepository Photo { get; private set; }

        public async Task<bool> SaveAll()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}