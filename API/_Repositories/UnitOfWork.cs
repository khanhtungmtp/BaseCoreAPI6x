using API._Repositories.Interfaces;
using API.Data;
using API.Models;
namespace API._Repositories.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public UnitOfWork(ApplicationDbContext ApplicationDbContext)
        {
            _context = ApplicationDbContext;
            // User = new Repository<User, ApplicationDbContext>(_context);
        }
        // public IRepository<User> User { get; private set; }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}