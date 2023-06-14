
using API.Dtos;
using API.Dtos.User;
using API.Models;

namespace API._Services.Interfaces
{
    public interface IAuthServices
    {
        Task<UserDto> Register(RegisterUserDto param);
        Task<UserDto> Login(LoginUserParam param);
        Task<bool> UserExits(string username);
        Task<User> GetUser(int id);
        Task<string> CreateToken(User user);
    }
}