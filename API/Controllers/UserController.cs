using System.Security.Claims;
using API._Repositories.Interfaces;
using API.Data;
using API.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    // [Authorize]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public UserController(IDatingRepository datingRepository, IMapper mapper)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getUser(int id)
        {
            var user = await _datingRepository.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _datingRepository.GetUsers();
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            // if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value))
            //     return Unauthorized();
            var userFromRepo = await _datingRepository.GetUser(id);
            _mapper.Map(userForUpdateDto, userFromRepo);
            if (await _datingRepository.SaveAll())
                return NoContent();
            throw new Exception($"Updating user {id} failed on save");
        }

    }
}