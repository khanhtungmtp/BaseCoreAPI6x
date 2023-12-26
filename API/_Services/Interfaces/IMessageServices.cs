
using API.Dtos.Message;
using API.Helpers.Utilities;
using API.Models;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IMessageServices
    {
        Task<Message> GetMessage(int userid, MessageDetailDto messageDetail);
        Task<OperationResult> CreateMessage(int userid, MessageForCreationDto messageForCreationDto);
        Task<PaginationUtility<Message>> GetMessageForUser(int userid, PaginationParams paginationParams, MessageParams messageParams);
        Task<IEnumerable<MessageToReturnDto>> GetMessagesThread(int userid, int RecipientId);
        Task<OperationResult> DeleteMessage(int userid, int messageId);
        Task<OperationResult> MarkAsRead(int messageId, int userid);
    }
}