
using API._Repositories.Interfaces;
using API.Data;
using API.Dtos.Message;
using API.Dtos.user;
using API.Helpers.Utilities;
using API.Models;
using LinqKit;
using Microsoft.EntityFrameworkCore;
namespace API._Repositories.Repository
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _dataContext;
        public DatingRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public void Add<T>(T entity) where T : class
        {
            _dataContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dataContext.Remove(entity);
        }

        public async Task<Like> GetLike(int userid, int recipientid)
        {
            var likes = await _dataContext.Like.FirstOrDefaultAsync(l => l.liker_id == userid && l.likee_id == recipientid);
            return likes;
        }

        public async Task<Photo> GetMainPhotoForUser(int userid)
        {
            var photo = await _dataContext.Photos.Where(u => u.userid == userid).FirstOrDefaultAsync(m => m.is_main);
            return photo;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _dataContext.Photos.FirstOrDefaultAsync(p => p.id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _dataContext.Users.Include(p => p.photos).FirstOrDefaultAsync(u => u.id == id);
            return user;
        }

        public async Task<IEnumerable<int>> ListUserLikes(int userid, bool likers)
        {
            var user = await _dataContext.Users
            .Include(u => u.likers)
            .Include(u => u.likees)
            .FirstOrDefaultAsync(u => u.id == userid);
            if (likers)
            {
                // return user.likees.Where(u => u.liker_id == userid).Select(x => x.likeeid);
                return user.likers.Select(x => x.liker_id);
            }
            else
            {
                // return user.likers.Where(u => u.likeeid == userid).Select(x => x.liker_id);
                return user.likees.Where(u => u.liker_id == userid).Select(x => x.likee_id);
            }
        }

        public async Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter)
        {
            var predicate = PredicateBuilder.New<User>(true);
            // neu co chon gioi tinh
            if (!string.IsNullOrEmpty(userFilter.gender))
            {
                predicate.And(u => u.gender == userFilter.gender);
            }
            predicate.And(u => u.id != userFilter.user_id);

            // filter age
            if (userFilter.min_age != 18 || userFilter.max_age != 99)
            {
                // nam hien tai trừ đi số tuổi => ra năm sinh 
                var minDob = DateTime.Today.AddYears(-userFilter.max_age - 1);
                var maxDob = DateTime.Today.AddYears(-userFilter.min_age);
                predicate.And(u => u.date_of_birth >= minDob && u.date_of_birth <= maxDob);
            }
            var users = _dataContext.Users.Include(p => p.photos).Where(predicate);

            // sorting created, last active
            if (!string.IsNullOrEmpty(userFilter.order_by))
            {
                if (userFilter.order_by == "created")
                {
                    users = users.OrderByDescending(u => u.created);
                }
                else
                {
                    users = users.OrderByDescending(u => u.last_active);
                }
            }
            return await PaginationUtilities<User>.CreateAsync(users, paginationParams.pageNumber, paginationParams.PageSize);
        }

        public async Task<PaginationUtilities<User>> GetUsersLike(PaginationParams paginationParams, UserLikes userLikes)
        {
            var users = _dataContext.Users.Include(p => p.photos).Where(u => u.id != userLikes.user_id);
            if (userLikes.likers)
            {
                var userLiker = await ListUserLikes(userLikes.user_id, userLikes.likers);
                users = users.Where(u => userLiker.Contains(u.id));
            }
            if (userLikes.likees)
            {
                var userLikees = await ListUserLikes(userLikes.user_id, userLikes.likers);
                users = users.Where(u => userLikees.Contains(u.id));
            }
            return await PaginationUtilities<User>.CreateAsync(users, paginationParams.pageNumber, paginationParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dataContext.Messages.FirstOrDefaultAsync(m => m.id == id);
        }

        public async Task<IEnumerable<Message>> GetMessagesThread(int user_id, int recipientid)
        {
            var messages = _dataContext.Messages
            .Include(u => u.sender).ThenInclude(p => p.photos)
            .Include(r => r.recipient).ThenInclude(p => p.photos)
            .Where(u => u.recipientid == user_id && u.senderid == recipientid && u.sender_deleted == false
             || u.recipientid == recipientid && u.senderid == user_id && u.recipient_deleted == false)
            .OrderByDescending(o => o.message_sent)
            .ToListAsync();
            return await messages;
        }

        public async Task<PaginationUtilities<Message>> GetMessagesForUser(PaginationParams paginationParams, MessageParams messageParams)
        {
            var messages = _dataContext.Messages
            .Include(u => u.sender).ThenInclude(p => p.photos)
            .Include(r => r.recipient).ThenInclude(p => p.photos).AsQueryable();
            switch (messageParams.message_container)
            {
                case "inbox":
                    messages = messages.Where(u => u.recipientid == messageParams.userid && u.recipient_deleted == false);
                    break;
                case "outbox":
                    messages = messages.Where(u => u.senderid == messageParams.userid && u.sender_deleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.recipientid == messageParams.userid && u.recipient_deleted == false && u.is_read == false);
                    break;
            }
            messages.OrderByDescending(o => o.message_sent);
            return await PaginationUtilities<Message>.CreateAsync(messages, paginationParams.pageNumber, paginationParams.PageSize);
        }
    }
}