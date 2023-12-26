using API._Repositories.Interfaces;
using API.Data;
using API.Models;
namespace API._Repositories.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        public UnitOfWork(DataContext dataContext)
        {
            _context = dataContext;
            User = new Repository<User, DataContext>(_context);
            Like = new Repository<Like, DataContext>(_context);
            Message = new Repository<Message, DataContext>(_context);
            Photo = new Repository<Photo, DataContext>(_context);
        }
        public IRepository<User> User { get; private set; }
        public IRepository<Like> Like { get; private set; }
        public IRepository<Message> Message { get; private set; }
        public IRepository<Photo> Photo { get; private set; }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}