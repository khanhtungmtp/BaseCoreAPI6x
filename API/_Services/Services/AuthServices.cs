
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
            var claims = new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            var roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHanler = new JwtSecurityTokenHandler();
            var token = tokenHanler.CreateToken(tokenDescriptor);
            return tokenHanler.WriteToken(token);
        }

        public async Task<User> GetUser(int id)
        {
            User user = await _dataContext.Users.Include(p => p.photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<UserDto> Login(LoginUserParam param)
        {
            var userName = await _userManager.Users.Include(p => p.photos).SingleOrDefaultAsync(x => x.UserName.ToLower() == param.username.ToLower());
            if (userName == null) throw new Exception("Invalid Username");
            var userPassword = await _userManager.CheckPasswordAsync(userName, param.password);
            if (!userPassword) throw new Exception("Invalid Password");
            return new UserDto
            {
                Id = userName.Id,
                Username = userName.UserName,
                Gender = userName.gender,
                PhotoUrl = userName.photos != null ? userName.photos.FirstOrDefault(x => x.is_main)?.url : "",
                KnownAs = userName.known_as,
                Token = await CreateToken(userName)
            };
        }

        public async Task<UserDto> Register(RegisterUserDto param)
        {
            param.username = param.username.ToLower();
            if (await UserExits(param.username))
                throw new Exception("username already exists");
            var userMapped = _mapper.Map<User>(param);
            var createdUser = await _userManager.CreateAsync(userMapped, param.password);
            if (!createdUser.Succeeded) throw new Exception(createdUser.Errors.ToString());
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
                IdentityResult userResult = await _userManager.AddToRoleAsync(userMapped, "Member");
            }

            if (roleResult != null) throw new Exception(roleResult.Errors.ToString());
            return new UserDto
            {
                Username = userMapped.UserName,
                Token = await CreateToken(userMapped),
                KnownAs = userMapped.known_as,
                Gender = userMapped.gender
            };
        }

        public async Task<bool> UserExits(string username)
        {
            bool user = await _userManager.Users.AnyAsync(x => x.UserName == username);
            if (user)
                return true;
            return false;
        }
    }
}