using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos.Message;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [ApiController]
    [Route("api/users/{userid}/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IMessageServices _messageServices;
        public MessageController(IMapper mapper, IUnitOfWork repo, IDatingServices datingServices, IMessageServices messageServices)
        {
            _mapper = mapper;
            _messageServices = messageServices;
        }

        [HttpGet]
        [Route("GetMessage")]
        public async Task<IActionResult> GetMessage(int userid, MessageDetailDto messageDetail)
        {
            Message message = await _messageServices.GetMessage(userid, messageDetail);
            return Ok(message);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userid, MessageForCreationDto messageForCreationDto)
        {
            OperationResult result = await _messageServices.CreateMessage(userid, messageForCreationDto);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetMessageForUser")]
        public async Task<IActionResult> GetMessageForUser(int userid, [FromQuery] PaginationParams paginationParams, [FromQuery] MessageParams messageParams)
        {
            PaginationUtilities<Message> messageForReturn = await _messageServices.GetMessageForUser(userid, paginationParams, messageParams);
            IEnumerable<MessageToReturnDto> messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageForReturn);
            Response.AddPagination(messageForReturn.PageNumber, messageForReturn.PageSize, messageForReturn.TotalItems, messageForReturn.TotalPages);
            return Ok(messages);
        }

        [HttpGet("thread/{recipientid}")]
        public async Task<IActionResult> GetMessagesThread(int userid, int recipientid)
        {
            return Ok(await _messageServices.GetMessagesThread(userid, recipientid));
        }
        [HttpDelete("{message_id}")]
        public async Task<IActionResult> DeleteMessage(int userid, int message_id)
        {
            return Ok(await _messageServices.DeleteMessage(userid, message_id));
        }

        [HttpPost("{message_id}")]
        public async Task<IActionResult> markAsRead(int userid, int message_id)
        {
            return Ok(await _messageServices.markAsRead(userid, message_id));
        }
    }
}