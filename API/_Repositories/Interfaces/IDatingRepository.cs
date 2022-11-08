
using API.Dtos.user;
using API.Helpers.Utilities;
using API.Models;

namespace API._Repositories.Interfaces
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter, User user);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int userid);
        Task<Like> GetLike(int userid, int recipientid);
        Task<IEnumerable<int>> GetUserLikes(int userid, bool likers);
    }
}