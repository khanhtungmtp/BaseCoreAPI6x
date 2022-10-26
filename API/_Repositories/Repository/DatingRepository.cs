
using API._Repositories.Interfaces;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API._Repositories.Repository
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _dataContext;
        public DatingRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public void Add<T>(T entity) where T : class
        {
            _dataContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dataContext.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUser(int userid)
        {
            var photo = await _dataContext.Photos.Where(u => u.userid == userid).FirstOrDefaultAsync(m => m.is_main);
            return photo;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _dataContext.Photos.FirstOrDefaultAsync(p => p.id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _dataContext.Users.Include(p => p.photos).FirstOrDefaultAsync(u => u.id == id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _dataContext.Users.Include(p => p.photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}