
using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DataContext dataContext) : base(dataContext)
        {
        }
    }
}