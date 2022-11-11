
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
        Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter);
        Task<PaginationUtilities<User>> GetUsersLike(PaginationParams paginationParams, UserLikes userFilter);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int userid);
        Task<Like> GetLike(int userid, int recipientid);
        Task<IEnumerable<int>> ListUserLikes(int userid, bool likers);
    }
}