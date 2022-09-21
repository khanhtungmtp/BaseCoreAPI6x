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
        public readonly IAuthRepository _authRepository;
        public readonly IConfiguration _Configuration;
        public AuthController(IAuthRepository authRepository, IConfiguration configuration)
        {
            _Configuration = configuration;
            _authRepository = authRepository;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterUserParam param)
        {
            param.username = param.username.ToLower();
            if (await _authRepository.UserExits(param.username))
                return BadRequest("username already exists");
            var userToCreate = new User
            {
                username = param.username
            };
            var createdUser = await _authRepository.Register(userToCreate, param.password);
            return StatusCode(201);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginUserParam param)
        {
            var user = await _authRepository.Login(param.username.ToLower(), param.password);
            if (user == null)
                return Unauthorized();
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Name, param.username)
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