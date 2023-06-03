using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API._Repositories.Interfaces;
using API.Dtos;
using API.Dtos.user;
using API.Dtos.User;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public readonly IAuthRepository _authRepository;
        public readonly IConfiguration _Configuration;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        public AuthController(UserManager<User> userManager, RoleManager<Role> roleManager, IAuthRepository authRepository, IConfiguration configuration, IMapper mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _Configuration = configuration;
            _authRepository = authRepository;
            _mapper = mapper;
        }
        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterUserDto param)
        {
            param.username = param.username.ToLower();
            if (await _authRepository.UserExits(param.username))
                return BadRequest("username already exists");
            var userMapped = _mapper.Map<User>(param);
            var createdUser = await _userManager.CreateAsync(userMapped, param.password);
            if (!createdUser.Succeeded) return BadRequest(createdUser.Errors);
            // Add the Admin role to the database
            IdentityResult roleResult = null;
            bool adminRoleExists = await _roleManager.RoleExistsAsync("Member");
            if (!adminRoleExists)
            {
                roleResult = await _roleManager.CreateAsync(new Role { Name = "Member" });
            }

            // Select the user, and then add the Member role to the user
            // User user = await _userManager.FindByNameAsync("sysMember");
            if (!await _userManager.IsInRoleAsync(userMapped, "Member"))
            {
                var userResult = await _userManager.AddToRoleAsync(userMapped, "Member");
            }
            //var roleResult = await _userManager.AddToRoleAsync(userMapped, "Admin");
            if (roleResult != null) return BadRequest(roleResult.Errors);
            return new UserDto
            {
                Username = userMapped.UserName,
                Token = await _authRepository.CreateToken(userMapped),
                KnownAs = userMapped.known_as,
                Gender = userMapped.gender
            };
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginUserParam param)
        {
            var userName = await _userManager.Users.Include(p => p.photos).SingleOrDefaultAsync(x => x.UserName.ToLower() == param.username.ToLower());
            if (userName == null) return Unauthorized("Invalid Username");
            var userPassword = await _userManager.CheckPasswordAsync(userName, param.password);
            if (!userPassword) return Unauthorized("Invalid Password");
            return new UserDto
            {
                Id = userName.Id,
                Username = userName.UserName,
                Gender = userName.gender,
                PhotoUrl = userName.photos != null ? userName.photos.FirstOrDefault(x => x.is_main)?.url : "",
                KnownAs = userName.known_as,
                Token = await _authRepository.CreateToken(userName)
            };
        }
    }
}