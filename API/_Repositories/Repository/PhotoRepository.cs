
using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repository
{
    public class PhotoRepository : Repository<Photo>, IPhotoRepository
    {
        public PhotoRepository(DataContext dataContext) : base(dataContext)
        {
        }
    }
}