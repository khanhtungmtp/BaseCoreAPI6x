using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;

namespace API._Services.Interfaces
{
    public interface IUserServices
    {
        Task<UserForDetailedDto> GetUser(int id);
        Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter);
        Task<PaginationUtilities<User>> GetUserLikes(PaginationParams pagination, UserLikes userLikes);
        Task<OperationResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto);
        Task<OperationResult> Likes(int userid, int recipientid);
    }
}