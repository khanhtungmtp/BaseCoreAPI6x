
using API.Data;

namespace API._Repositories
{
    public class Repository<T> where T : class
    {
        private readonly DataContext _dataContext;
        public Repository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public void Add(T entity)
        {
            _dataContext.Add(entity);
        }

        public void Delete(T entity)
        {
            _dataContext.Remove(entity);
        }

    }
}