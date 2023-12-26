
using API.Dtos.Message;
using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IDatingServices
    {
        Task<PaginationUtility<UserForDetailedDto>> GetUsers(PaginationParams paginationParams, UserFilter userFilter);
        Task<PaginationUtility<UserForDetailedDto>> GetUsersLike(PaginationParams paginationParams, UserLikes userLikes);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int userid);
        Task<Like> GetLike(int userid, int RecipientId);
        Task<IEnumerable<int>> ListUserLikes(int userid, bool likers);
        Task<Message> GetMessage(int id);
        Task<PaginationUtility<Message>> GetMessagesForUser(PaginationParams paginationParams, MessageParams messageParams);
        Task<List<Message>> GetMessagesThread(int userId, int RecipientId);
    }
}