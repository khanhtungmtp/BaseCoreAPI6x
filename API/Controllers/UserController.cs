using API._Services.Interfaces;
using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserServices _userServices;

        public UserController(IMapper mapper, IUserServices userServices)
        {
            _mapper = mapper;
            _userServices = userServices;
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            return Ok(await _userServices.GetUser(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] PaginationParams paginationParams, [FromQuery] UserFilter userFilter)
        {
            PaginationUtilities<User> users = await _userServices.GetUsers(paginationParams, userFilter);
            IEnumerable<UserForDetailedDto> usersMapped = _mapper.Map<IEnumerable<UserForDetailedDto>>(users);
            Response.AddPagination(users.PageNumber, users.PageSize, users.TotalItems, users.TotalPages);
            return Ok(usersMapped);
        }

        [HttpGet]
        [Route("GetUserLikes")]
        public async Task<IActionResult> GetUserLikes([FromQuery] PaginationParams pagination, [FromQuery] UserLikes userLikes)
        {
            PaginationUtilities<User> users = await _userServices.GetUserLikes(pagination, userLikes);
            IEnumerable<UserForDetailedDto> usersToReturn = _mapper.Map<IEnumerable<UserForDetailedDto>>(users);
            Response.AddPagination(users.PageNumber, users.PageSize, users.TotalItems, users.TotalPages);
            return Ok(usersToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            return Ok(await _userServices.UpdateUser(id, userForUpdateDto));
        }

        // like user
        [HttpPost("{userid}/like/{recipientid}")]
        public async Task<IActionResult> Likes(int userid, int recipientid)
        {
            return Ok(await _userServices.Likes(userid, recipientid));
        }

    }
}