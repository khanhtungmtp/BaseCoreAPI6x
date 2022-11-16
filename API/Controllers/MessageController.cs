using System.Security.Claims;
using API._Repositories.Interfaces;
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
        private readonly IDatingRepository _repo;
        public MessageController(IMapper mapper, IDatingRepository repo)
        {
            _repo = repo;
            _mapper = mapper;

        }
        [HttpGet]
        [Route("GetMessage")]
        public async Task<IActionResult> GetMessage(int userid, int message_id)
        {
            var user_id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (user_id != userid)
                return Unauthorized();
            var message = await _repo.GetMessage(message_id);
            if (message == null)
                return NotFound();
            return Ok(message);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userid, MessageForCreationDto messageForCreationDto)
        {
            var user_id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (user_id != userid)
                return Unauthorized();
            messageForCreationDto.senderid = user_id;
            var userRecipient = await _repo.GetUser(messageForCreationDto.recipientid);
            if (userRecipient == null)
                return BadRequest("User recipient not found");
            var message = _mapper.Map<Message>(messageForCreationDto);
            _repo.Add<Message>(message);

            if (await _repo.SaveAll())
            {
                var messageForReturn = _mapper.Map<MessageForCreationDto>(message);
                return Created(nameof(GetMessage), messageForReturn);
            }
            throw new Exception("Creating a message failed on save");
        }

        [HttpGet]
        [Route("GetMessageForUser")]
        public async Task<IActionResult> GetMessageForUser(int userid, [FromQuery] PaginationParams paginationParams, [FromQuery] MessageParams messageParams)
        {
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageParams.userid = userid;
            var messageForReturn = await _repo.GetMessagesForUser(paginationParams, messageParams);
            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageForReturn);
            Response.AddPagination(messageForReturn.PageNumber, messageForReturn.PageSize, messageForReturn.TotalItems, messageForReturn.TotalPages);
            return Ok(messages);
        }

        [HttpGet("thread/{recipientid}")]
        // [Route("GetMessagesThread")]
        public async Task<IActionResult> GetMessagesThread(int userid, int recipientid)
        {
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var message = await _repo.GetMessagesThread(userid, recipientid);
            var messageReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(message);
            return Ok(messageReturn);
        }
    }
}