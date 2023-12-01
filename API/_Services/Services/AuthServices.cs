
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
            List<Claim> claims = new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            IList<string> roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
           SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            JwtSecurityTokenHandler tokenHanler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHanler.CreateToken(tokenDescriptor);
            return tokenHanler.WriteToken(token);
        }

        public async Task<User> GetUser(int id)
        {
            return await _dataContext.Users.Include(p => p.photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<UserDto> Login(LoginUserParam param)
        {
            User userName = await _userManager.Users.Include(p => p.photos).SingleOrDefaultAsync(x => x.UserName.ToLower() == param.username.ToLower());
            if (userName == null) throw new Exception("Invalid Username");
            bool userPassword = await _userManager.CheckPasswordAsync(userName, param.password);
            if (!userPassword) throw new Exception("Invalid Password");
            IList<string> roles = await _userManager.GetRolesAsync(userName);
            return new UserDto
            {
                Id = userName.Id,
                Username = userName.UserName,
                Gender = userName.gender,
                PhotoUrl = userName.photos != null ? userName.photos.FirstOrDefault(x => x.is_main)?.url : "",
                KnownAs = userName.known_as,
                Token = await CreateToken(userName),
                Roles = roles
            };
        }

        public async Task<UserDto> Register(RegisterUserDto param)
        {
            string errorMessage = null;
            param.username = param.username.ToLower();
            if (await UserExits(param.username))
                throw new Exception("Username already exists");
            User userMapped = _mapper.Map<User>(param);
            IdentityResult createdUser = await _userManager.CreateAsync(userMapped, param.password);
            if (!createdUser.Succeeded)
            {
                errorMessage = string.Join(", ", createdUser.Errors.Select(e => e.Description));
                throw new Exception(errorMessage);
            }
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

            if (roleResult != null)
            {
                errorMessage = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                throw new Exception(errorMessage);
            }
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
            return await _userManager.Users.AnyAsync(x => x.UserName == username);
        }
    }
}