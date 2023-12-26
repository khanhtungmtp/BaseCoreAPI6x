
using System.Linq.Expressions;
using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API._Repositories
{
    public class Repository<T, DBContext> : IRepository<T> where T : class where DBContext : DbContext
    {
        private readonly ApplicationDbContext _context;
        public Repository(ApplicationDbContext ApplicationDbContext)
        {
            _context = ApplicationDbContext;
        }
        public void Add(T entity)
        {
            _context.Add(entity);
        }

        public void AddMultiple(List<T> entities)
        {
            _context.AddRange(entities);
        }

        public IQueryable<T> FindAll(bool? noTracking = false)
        {
            IQueryable<T> result;
            if (noTracking != true)
            {
                IQueryable<T> queryable = _context.Set<T>();
                result = queryable;
            }
            else
            {
                result = _context.Set<T>().AsNoTracking();
            }

            return result;
        }

        public IQueryable<T> FindAll(Expression<Func<T, bool>> predicate, bool? noTracking = false)
        {
            IQueryable<T> result;
            if (noTracking != true)
            {
                result = _context.Set<T>().Where(predicate);
            }
            else
            {
                IQueryable<T> queryable = _context.Set<T>().Where(predicate).AsNoTracking();
                result = queryable;
            }

            return result;
        }

        public async Task<T> FindById(object id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public void Remove(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public void Remove(object id)
        {
            Remove(FindById(id));
        }

        public void RemoveMultiple(List<T> entities)
        {
            _context.Set<T>().RemoveRange(entities);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public void UpdateMultiple(List<T> entities)
        {
            _context.Set<T>().UpdateRange(entities);
        }

        public bool All(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().All(predicate);
        }

        public async Task<bool> AllAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().AllAsync(predicate);
        }

        public bool Any()
        {
            return _context.Set<T>().Any();
        }

        public bool Any(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().Any(predicate);
        }

        public async Task<bool> AnyAsync()
        {
            return await _context.Set<T>().AnyAsync();
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().AnyAsync(predicate);
        }

        public T FirstOrDefault(bool? noTracking = false)
        {
            return (noTracking == true) ? _context.Set<T>().AsNoTracking().FirstOrDefault() : _context.Set<T>().FirstOrDefault();
        }

        public T FirstOrDefault(Expression<Func<T, bool>> predicate, bool? noTracking = false)
        {
            return (noTracking == true) ? _context.Set<T>().AsNoTracking().FirstOrDefault(predicate) : _context.Set<T>().FirstOrDefault(predicate);
        }

        public async Task<T> FirstOrDefaultAsync(bool? noTracking = false)
        {
            return (noTracking != true) ? (await _context.Set<T>().FirstOrDefaultAsync()) : (await _context.Set<T>().AsNoTracking().FirstOrDefaultAsync());
        }

        public async Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, bool? noTracking = false)
        {
            return (noTracking != true) ? (await _context.Set<T>().FirstOrDefaultAsync(predicate)) : (await _context.Set<T>().AsNoTracking().FirstOrDefaultAsync(predicate));
        }

        public int Count()
        {
            return _context.Set<T>().Count();
        }

        public int Count(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().Count(predicate);
        }

        public async Task<int> CountAsync()
        {
            return await _context.Set<T>().CountAsync();
        }

        public async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().CountAsync(predicate);
        }

        public T LastOrDefault(bool? noTracking = false)
        {
            return (noTracking == true) ? _context.Set<T>().AsNoTracking().LastOrDefault() : _context.Set<T>().LastOrDefault();
        }

        public T LastOrDefault(Expression<Func<T, bool>> predicate, bool? noTracking = false)
        {
            return (noTracking == true) ? _context.Set<T>().AsNoTracking().LastOrDefault(predicate) : _context.Set<T>().LastOrDefault(predicate);
        }

        public async Task<T> LastOrDefaultAsync(bool? noTracking = false)
        {
            return (noTracking != true) ? (await _context.Set<T>().LastOrDefaultAsync()) : (await _context.Set<T>().AsNoTracking().LastOrDefaultAsync());
        }

        public async Task<T> LastOrDefaultAsync(Expression<Func<T, bool>> predicate, bool? noTracking = false)
        {
            return (noTracking != true) ? (await _context.Set<T>().LastOrDefaultAsync(predicate)) : (await _context.Set<T>().AsNoTracking().LastOrDefaultAsync(predicate));
        }

        public decimal Sum(Expression<Func<T, decimal>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public decimal? Sum(Expression<Func<T, decimal?>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public decimal Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public decimal? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal?>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public async Task<decimal> SumAsync(Expression<Func<T, decimal>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<decimal?> SumAsync(Expression<Func<T, decimal?>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<decimal> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

        public async Task<decimal?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal?>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

        public int Sum(Expression<Func<T, int>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public int? Sum(Expression<Func<T, int?>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public int Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, int>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public int? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, int?>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public async Task<int> SumAsync(Expression<Func<T, int>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<int?> SumAsync(Expression<Func<T, int?>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<int> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, int>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

        public async Task<int?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, int?>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

        public long Sum(Expression<Func<T, long>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public long? Sum(Expression<Func<T, long?>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public long Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, long>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public long? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, long?>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public async Task<long> SumAsync(Expression<Func<T, long>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<long?> SumAsync(Expression<Func<T, long?>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<long> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, long>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

        public async Task<long?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, long?>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

        public float Sum(Expression<Func<T, float>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public float? Sum(Expression<Func<T, float?>> selector)
        {
            return _context.Set<T>().Sum(selector);
        }

        public float Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, float>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public float? Sum(Expression<Func<T, bool>> predicate, Expression<Func<T, float?>> selector)
        {
            return _context.Set<T>().Where(predicate).Sum(selector);
        }

        public async Task<float> SumAsync(Expression<Func<T, float>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<float?> SumAsync(Expression<Func<T, float?>> selector)
        {
            return await _context.Set<T>().SumAsync(selector);
        }

        public async Task<float> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, float>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

        public async Task<float?> SumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, float?>> selector)
        {
            return await _context.Set<T>().Where(predicate).SumAsync(selector);
        }

    }
}