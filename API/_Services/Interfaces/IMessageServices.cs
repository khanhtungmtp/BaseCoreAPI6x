
using API.Dtos.Message;
using API.Helpers.Utilities;
using API.Models;

namespace API._Services.Interfaces
{
    public interface IMessageServices
    {
        Task<Message> GetMessage(int userid, MessageDetailDto messageDetail);
        Task<OperationResult> CreateMessage(int userid, MessageForCreationDto messageForCreationDto);
        Task<PaginationUtilities<Message>> GetMessageForUser(int userid, PaginationParams paginationParams, MessageParams messageParams);
        Task<IEnumerable<MessageToReturnDto>> GetMessagesThread(int userid, int recipientid);
        Task<OperationResult> DeleteMessage(int userid, int message_id);
        Task<OperationResult> markAsRead(int message_id, int userid);
    }
}