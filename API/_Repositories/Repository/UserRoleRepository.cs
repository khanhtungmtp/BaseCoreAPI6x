
using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repository
{
    public class UserRoleRepository : Repository<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(DataContext dataContext) : base(dataContext)
        {
        }
    }
}