
using API.Dtos.Photo;
using API.Helpers.Utilities;

namespace API._Services.Interfaces
{
    public interface IPhotoServices
    {
        Task<OperationResult> AddPhotoForUser(int userid, PhotoForCreationDto photoForCreationDto);
        Task<OperationResult> SetMainPhoto(int userid, int photoid);
        Task<PhotoForReturnDto> GetPhoto(int id);
        Task<OperationResult> DeletePhoto(int userid, int photoid);
    }
}