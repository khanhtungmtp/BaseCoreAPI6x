
using System.Security.Claims;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos.Message;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;

namespace API._Services.Services
{
    public class MessageServices : IMessageServices
    {
        private readonly IDatingServices _datingServices;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _repo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MessageServices(IDatingServices datingServices, IMapper mapper, IUnitOfWork repo, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _datingServices = datingServices;
            _repo = repo;
            _httpContextAccessor = httpContextAccessor;
        }

        private int GetUserCurrent()
        {
            string user = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(user);
        }
        public async Task<OperationResult> CreateMessage(int userid, MessageForCreationDto messageForCreationDto)
        {
            User sender = await _datingServices.GetUser(userid);
            if (GetUserCurrent() != sender.Id)
                throw new Exception("unauthorization");
            messageForCreationDto.SenderId = userid;
            User userRecipient = await _datingServices.GetUser(messageForCreationDto.RecipientId);
            if (userRecipient == null)
                throw new Exception("User recipient not found");
            Message message = _mapper.Map<Message>(messageForCreationDto);
            message.MessageSent = DateTime.Now;
            _repo.Message.Add(message);

            if (await _repo.SaveAll())
            {
                MessageToReturnDto messageForReturn = _mapper.Map<MessageToReturnDto>(message);
                return new OperationResult { IsSuccess = true, Message = "Send success", Data = messageForReturn };
            }
            throw new Exception("Creating a message failed on save");
        }

        public async Task<OperationResult> DeleteMessage(int userid, int message_id)
        {
            if (GetUserCurrent() != userid)
                throw new Exception("unauthorization");
            Message message = await _datingServices.GetMessage(message_id);
            if (message.SenderId == GetUserCurrent())
                message.SenderDeleted = true;
            if (message.RecipientId == GetUserCurrent())
                message.RecipientDeleted = true;
            if (message.RecipientDeleted && message.SenderDeleted)
                _repo.Message.Remove(message);
            if (await _repo.SaveAll())
            {
                return new OperationResult { IsSuccess = true };
            }
            throw new Exception("Error deleting the message");
        }

        public async Task<Message> GetMessage(int user_id, MessageDetailDto messageDetail)
        {
            if (user_id != messageDetail.UserId)
                throw new Exception("Unauthorize user");
            Message message = await _datingServices.GetMessage(messageDetail.MessageId);
            if (message == null)
                return null;
            return message;
        }

        public async Task<PaginationUtility<Message>> GetMessageForUser(int userid, PaginationParams paginationParams, MessageParams messageParams)
        {
            if (userid != GetUserCurrent())
                throw new Exception("Unauthorize user");
            messageParams.Userid = userid;
            return await _datingServices.GetMessagesForUser(paginationParams, messageParams);
        }

        public async Task<IEnumerable<MessageToReturnDto>> GetMessagesThread(int userid, int RecipientId)
        {
            if (userid != GetUserCurrent())
                throw new Exception("Unauthorization");
            IEnumerable<Message> message = await _datingServices.GetMessagesThread(userid, RecipientId);
            return _mapper.Map<IEnumerable<MessageToReturnDto>>(message);
        }

        public async Task<OperationResult> MarkAsRead(int userid, int message_id)
        {
            if (userid != GetUserCurrent())
                throw new Exception("Unauthorization");
            Message message = await _datingServices.GetMessage(message_id);
            if (message == null) throw new Exception("Cannot get message");
            if (message.RecipientId != userid)
                throw new Exception("unauthorization");
            message.IsRead = true;
            message.DateRead = DateTime.Now;
            await _repo.SaveAll();
            return new OperationResult { IsSuccess = true };
        }
    }
}