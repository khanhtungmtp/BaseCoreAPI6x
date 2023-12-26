using API._Services.Interfaces;
using API.Dtos.Message;
using API.Helpers.Utilities;
using API.Models;
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
        private readonly IMessageServices _messageServices;
        public MessageController(IMessageServices messageServices)
        {
            _messageServices = messageServices;
        }

        [HttpGet]
        [Route("GetMessage")]
        public async Task<IActionResult> GetMessage(int userid, MessageDetailDto messageDetail)
        {
            Message message = await _messageServices.GetMessage(userid, messageDetail);
            return Ok(message);
        }

        [HttpPost("CreateMessage")]
        public async Task<IActionResult> CreateMessage(int userid, MessageForCreationDto messageForCreationDto)
        {
            OperationResult result = await _messageServices.CreateMessage(userid, messageForCreationDto);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetMessageForUser")]
        public async Task<IActionResult> GetMessageForUser(int userid, [FromQuery] PaginationParams paginationParams, [FromQuery] MessageParams messageParams)
        {
            PaginationUtility<Message> messageForReturn = await _messageServices.GetMessageForUser(userid, paginationParams, messageParams);
            return Ok(messageForReturn);
        }

        [HttpGet("Thread/{RecipientId}")]
        public async Task<IActionResult> GetMessagesThread(int userid, int RecipientId)
        {
            return Ok(await _messageServices.GetMessagesThread(userid, RecipientId));
        }
        [HttpDelete("DeleteMessage/{messageId}")]
        public async Task<IActionResult> DeleteMessage(int userid, int messageId)
        {
            return Ok(await _messageServices.DeleteMessage(userid, messageId));
        }

        [HttpPost("MarkAsRead/{messageId}")]
        public async Task<IActionResult> MarkAsRead(int userid, int messageId)
        {
            return Ok(await _messageServices.MarkAsRead(userid, messageId));
        }
    }
}