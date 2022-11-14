
using System.Security.Claims;
using API._Repositories.Interfaces;
using API.Dtos.user;
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
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public UserController(IDatingRepository datingRepository, IMapper mapper)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _datingRepository.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] PaginationParams paginationParams, [FromQuery] UserFilter userFilter)
        {
            var user_id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _datingRepository.GetUser(user_id);
            userFilter.user_id = user_id;
            if (userFilter.gender == null)
            {
                userFilter.gender = user.gender;
            }
            var users = await _datingRepository.GetUsers(paginationParams, userFilter);
            var usersToReturn = _mapper.Map<IEnumerable<UserForDetailedDto>>(users);
            Response.AddPagination(users.PageNumber, users.PageSize, users.TotalItems, users.TotalPages);
            return Ok(usersToReturn);
        }

        [HttpGet]
        [Route("GetUserLikes")]
        public async Task<IActionResult> GetUserLikes([FromQuery] PaginationParams pagination, [FromQuery] UserLikes userLikes)
        {
            var user_id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            // var user = await _datingRepository.GetUser(user_id);
            userLikes.user_id = user_id;
            var users = await _datingRepository.GetUsersLike(pagination, userLikes);
            var usersToReturn = _mapper.Map<IEnumerable<UserForDetailedDto>>(users);
            Response.AddPagination(users.PageNumber, users.PageSize, users.TotalItems, users.TotalPages);
            return Ok(usersToReturn);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value))
                return Unauthorized();
            var userFromRepo = await _datingRepository.GetUser(id);
            _mapper.Map(userForUpdateDto, userFromRepo);
            if (await _datingRepository.SaveAll())
                return NoContent();
            throw new Exception($"Updating user {id} failed on save");
        }

        // like user
        [HttpPost("{userid}/like/{recipientid}")]
        public async Task<IActionResult> Likes(int userid, int recipientid)
        {
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var recipient = await _datingRepository.GetUser(recipientid);
            if (recipient == null)
                return NotFound();
            var like = await _datingRepository.GetLike(userid, recipient.id);
            if (like != null)
            {
                return BadRequest("You already like this user");
            };
            like = new Like
            {
                liker_id = userid,
                likee_id = recipientid
            };

            _datingRepository.Add<Like>(like);
            if (await _datingRepository.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to like user");
        }

    }
}