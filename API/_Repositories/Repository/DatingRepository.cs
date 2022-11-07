
using API._Repositories.Interfaces;
using API.Data;
using API.Dtos.user;
using API.Helpers.Utilities;
using API.Models;
using LinqKit;
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

        public async Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter, User user)
        {
            var predicate = PredicateBuilder.New<User>(true);
            // neu co chon gioi tinh
            if (!string.IsNullOrEmpty(userFilter.gender))
            {
                predicate.And(u => u.gender == userFilter.gender);
            }
            predicate.And(u => u.id != userFilter.user_id);
            // filter age
            if (userFilter.min_age != 18 || userFilter.max_age != 99)
            {
                // nam hien tai trừ đi số tuổi => ra năm sinh 
                var minDob = DateTime.Today.AddYears(-userFilter.max_age - 1);
                var maxDob = DateTime.Today.AddYears(-userFilter.min_age);
                predicate.And(u => u.date_of_birth >= minDob && u.date_of_birth <= maxDob);
            }
            var users = _dataContext.Users.Include(p => p.photos).OrderByDescending(u => u.last_active).Where(predicate);
            // sorting created, last active
            if (!string.IsNullOrEmpty(userFilter.order_by))
            {
                if (userFilter.order_by == "created")
                {
                    users.OrderByDescending(u => u.created);
                }
                else
                {
                    users.OrderByDescending(u => u.last_active);
                }
            }
            return await PaginationUtilities<User>.CreateAsync(users, paginationParams.pageNumber, paginationParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}