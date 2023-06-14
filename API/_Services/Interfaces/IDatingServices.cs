
using API.Dtos.Message;
using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;

namespace API._Services.Interfaces
{
    public interface IDatingServices
    {
        Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter);
        Task<PaginationUtilities<User>> GetUsersLike(PaginationParams paginationParams, UserLikes userLikes);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int userid);
        Task<Like> GetLike(int userid, int recipientid);
        Task<IEnumerable<int>> ListUserLikes(int userid, bool likers);
        Task<Message> GetMessage(int id);
        Task<PaginationUtilities<Message>> GetMessagesForUser(PaginationParams paginationParams, MessageParams messageParams);
        Task<IEnumerable<Message>> GetMessagesThread(int user_id, int recipientid);
    }
}