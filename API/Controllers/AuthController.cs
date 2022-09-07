using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API._Repositories.Interfaces;
using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public readonly IAuthRepository _AuthRepository;
        public readonly IConfiguration _Configuration;
        public AuthController(IAuthRepository authRepository, IConfiguration configuration)
        {
            _Configuration = configuration;
            _AuthRepository = authRepository;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterUserDto userDto)
        {
            userDto.UserName = userDto.UserName.ToLower();
            if (await _AuthRepository.UserExits(userDto.UserName))
                return BadRequest("username already exists");
            var userToCreate = new User
            {
                UserName = userDto.UserName
            };
            var createdUser = await _AuthRepository.Register(userToCreate, userDto.Password);
            return StatusCode(201);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(string UserName, string Password)
        {
            var user = await _AuthRepository.Login(UserName.ToLower(), Password);
            if (user == null)
                return Unauthorized();
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, UserName)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_Configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHanler = new JwtSecurityTokenHandler();
            var token = tokenHanler.CreateToken(tokenDescriptor);
            return Ok(new
            {
                token = tokenHanler.WriteToken(token)
            });
        }
    }
}