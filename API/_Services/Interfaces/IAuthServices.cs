
using API.Dtos;
using API.Dtos.User;
using API.Models;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IAuthServices
    {
        Task<UserDto> Register(RegisterUserDto param);
        Task<UserDto> Login(LoginUserParam param);
        Task<bool> UserExits(string Username);
        Task<User> GetUser(int id);
        Task<string> CreateToken(User user);
    }
}