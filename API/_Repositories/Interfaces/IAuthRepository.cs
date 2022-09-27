
using API.Models;

namespace API._Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string username, string password);
        Task<bool> UserExits(string username);
        Task<User> GetUser(int id);
    }
}