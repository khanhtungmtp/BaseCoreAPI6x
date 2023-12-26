
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API._Services.Interfaces;
using API.Data;
using API.Dtos;
using API.Dtos.User;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using API.Helpers.Utilities;
namespace API._Services.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly DataContext _dataContext;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public AuthServices(UserManager<User> userManager, RoleManager<Role> roleManager, DataContext dataContext, IConfiguration configuration, IMapper mapper)
        {
            _configuration = configuration;
            _dataContext = dataContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
        }
        public async Task<string> CreateToken(User user)
        {
            List<Claim> claims = new(){
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            IList<string> roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha512);
            SecurityTokenDescriptor tokenDescriptor = new()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            JwtSecurityTokenHandler tokenHanler = new();
            SecurityToken token = tokenHanler.CreateToken(tokenDescriptor);
            return tokenHanler.WriteToken(token);
        }

        public async Task<User> GetUser(int id)
        {
            return await _dataContext.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<UserDto> Login(LoginUserParam param)
        {
            User UserName = await _userManager.Users.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName.ToLower() == param.UserName.ToLower());
            if (UserName == null) throw new Exception("Invalid UserName");
            bool userPassword = await _userManager.CheckPasswordAsync(UserName, param.Password);
            if (!userPassword) throw new Exception("Invalid Password");
            IList<string> roles = await _userManager.GetRolesAsync(UserName);
            return new UserDto
            {
                Id = UserName.Id,
                UserName = UserName.UserName,
                Gender = UserName.Gender,
                PhotoUrl = UserName.Photos != null ? UserName.Photos.FirstOrDefault(x => x.IsMain)?.Url : "",
                KnownAs = UserName.KnownAs,
                Token = await CreateToken(UserName),
                Roles = roles
            };
        }

        public async Task<UserDto> Register(RegisterUserDto param)
        {
            param = FunctionUltility.TrimStringProperties(param);
            string errorMessage = null;
            param.UserName = param.UserName.ToLower();
            if (await UserExits(param.UserName))
                throw new Exception("UserName already exists");
            User userMapped = _mapper.Map<User>(param);
            IdentityResult CreatedUser = await _userManager.CreateAsync(userMapped, param.Password);
            if (!CreatedUser.Succeeded)
            {
                errorMessage = string.Join(", ", CreatedUser.Errors.Select(e => e.Description));
                throw new Exception(errorMessage);
            }
            var roleResult = await _userManager.AddToRoleAsync(userMapped, "Member");

            if (!roleResult.Succeeded) {
                errorMessage = string.Join(", ", CreatedUser.Errors.Select(e => e.Description));
                throw new Exception(errorMessage);
            }

            return new UserDto
            {
                UserName = userMapped.UserName,
                Token = await CreateToken(userMapped),
                KnownAs = userMapped.KnownAs,
                Gender = userMapped.Gender
            };
        }

        public async Task<bool> UserExits(string UserName)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == UserName);
        }
    }
}