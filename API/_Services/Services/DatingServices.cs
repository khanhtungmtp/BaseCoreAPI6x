
using API._Services.Interfaces;
using API.Data;
using API.Dtos.Message;
using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;
using LinqKit;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services
{
    public class DatingServices : IDatingServices
    {
        private readonly DataContext _dataContext;
        public DatingServices(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<Like> GetLike(int userid, int recipientid)
        {
            Like likes = await _dataContext.Like.FirstOrDefaultAsync(l => l.liker_id == userid && l.likee_id == recipientid);
            return likes;
        }

        public async Task<Photo> GetMainPhotoForUser(int userid)
        {
            Photo photo = await _dataContext.Photos.Where(u => u.userid == userid).FirstOrDefaultAsync(m => m.is_main);
            return photo;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            Photo photo = await _dataContext.Photos.FirstOrDefaultAsync(p => p.id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            User user = await _dataContext.Users.Include(p => p.photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<IEnumerable<int>> ListUserLikes(int userid, bool likers)
        {
            User user = await _dataContext.Users
            .Include(u => u.likers)
            .Include(u => u.likees)
            .FirstOrDefaultAsync(u => u.Id == userid);
            if (likers)
                return user.likers.Select(x => x.liker_id);
            else
                return user.likees.Where(u => u.liker_id == userid).Select(x => x.likee_id);
        }

        public async Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter)
        {
            ExpressionStarter<User> predicate = PredicateBuilder.New<User>(true);
            // neu co chon gioi tinh
            if (!string.IsNullOrEmpty(userFilter.gender))
                predicate.And(u => u.gender == userFilter.gender);
            predicate.And(u => u.Id != userFilter.user_id);

            // filter age
            if (userFilter.min_age != 18 || userFilter.max_age != 99)
            {
                // nam hien tai trừ đi số tuổi => ra năm sinh 
                DateTime minDob = DateTime.Today.AddYears(-userFilter.max_age - 1);
                DateTime maxDob = DateTime.Today.AddYears(-userFilter.min_age);
                predicate.And(u => u.date_of_birth >= minDob && u.date_of_birth <= maxDob);
            }
            IQueryable<User> users = _dataContext.Users.Include(p => p.photos).Where(predicate);

            // sorting created, last active
            if (!string.IsNullOrEmpty(userFilter.order_by))
            {
                if (userFilter.order_by == "created")
                    users = users.OrderByDescending(u => u.created);
                else
                    users = users.OrderByDescending(u => u.last_active);
            }
            return await PaginationUtilities<User>.CreateAsync(users, paginationParams.pageNumber, paginationParams.PageSize);
        }

        public async Task<PaginationUtilities<User>> GetUsersLike(PaginationParams paginationParams, UserLikes userLikes)
        {
            IQueryable<User> users = _dataContext.Users.Include(p => p.photos).Where(u => u.Id != userLikes.user_id);
            if (userLikes.likers)
            {
                IEnumerable<int> userLiker = await ListUserLikes(userLikes.user_id, userLikes.likers);
                users = users.Where(u => userLiker.Contains(u.Id));
            }
            if (userLikes.likees)
            {
                IEnumerable<int> userLikees = await ListUserLikes(userLikes.user_id, userLikes.likers);
                users = users.Where(u => userLikees.Contains(u.Id));
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
            Task<List<Message>> messages = _dataContext.Messages
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
            IQueryable<Message> messages = _dataContext.Messages
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