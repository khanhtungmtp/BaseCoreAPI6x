using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IUserServices
    {
        Task<UserForDetailedDto> GetUser(int id);
        Task<PaginationUtility<UserForDetailedDto>> GetUsers(PaginationParams paginationParams, UserFilter userFilter);
        Task<PaginationUtility<UserForDetailedDto>> GetUserLikes(PaginationParams pagination, UserLikes userLikes);
        Task<OperationResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto);
        Task<OperationResult> Likes(int userid, int RecipientId);
    }
}