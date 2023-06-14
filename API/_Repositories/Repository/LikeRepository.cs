
using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repository
{
    public class LikeRepository : Repository<Like>, ILikeRepository
    {
        public LikeRepository(DataContext dataContext) : base(dataContext)
        {
        }
    }
}