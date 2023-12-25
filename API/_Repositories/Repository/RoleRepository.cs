
using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repository
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(DataContext dataContext) : base(dataContext)
        {
        }
    }
}