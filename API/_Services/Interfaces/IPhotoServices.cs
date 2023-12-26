
using API.Dtos.Photo;
using API.Helpers.Utilities;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IPhotoServices
    {
        Task<OperationResult> AddPhotoForUser(int userid, PhotoForCreationDto photoForCreationDto);
        Task<OperationResult> SetMainPhoto(int userid, int photoid);
        Task<PhotoForReturnDto> GetPhoto(int id);
        Task<OperationResult> DeletePhoto(int userid, int photoid);
    }
}