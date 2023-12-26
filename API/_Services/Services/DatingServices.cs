
using API._Services.Interfaces;
using API.Data;
using API.Dtos.Message;
using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LinqKit;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services
{
    public class DatingServices : IDatingServices
    {
        private readonly DataContext _context;
		private readonly IMapper _mapper;
		public DatingServices(
			DataContext dataContext,
			IMapper mapper)
        {
			_mapper = mapper;
            _context = dataContext;
        }
        public async Task<Like> GetLike(int userid, int RecipientId)
        {
            return await _context.Like.FirstOrDefaultAsync(l => l.LikerId == userid && l.LikeeId == RecipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userid)
        {
            return await _context.Photos.Where(u => u.Userid == userid).FirstOrDefaultAsync(m => m.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<int>> ListUserLikes(int userid, bool likers)
        {
            User user = await _context.Users
            .Include(u => u.Likers)
            .Include(u => u.Likees)
            .FirstOrDefaultAsync(u => u.Id == userid);
            if (likers)
                return user.Likers.Select(x => x.LikerId);
            else
                return user.Likees.Where(u => u.LikerId == userid).Select(x => x.LikeeId);
        }

        public async Task<PaginationUtility<UserForDetailedDto>> GetUsers(PaginationParams paginationParams, UserFilter userFilter)
        {
            ExpressionStarter<User> predicate = PredicateBuilder.New<User>(true);
            // neu co chon gioi tinh
            if (!string.IsNullOrEmpty(userFilter.Gender))
                predicate.And(u => u.Gender == userFilter.Gender);
            predicate.And(u => u.Id != userFilter.UserId);

            // filter age
            if (userFilter.MinAge != 18 || userFilter.MaxAge != 99)
            {
                // nam hien tai trừ đi số tuổi => ra năm sinh 
                DateTime minDob = DateTime.Today.AddYears(-userFilter.MaxAge - 1);
                DateTime maxDob = DateTime.Today.AddYears(-userFilter.MinAge);
                predicate.And(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            IQueryable<User> users = _context.Users.Include(p => p.Photos).Where(predicate);
            IQueryable<UserForDetailedDto> usersMapped = users.ProjectTo<UserForDetailedDto>(_mapper.ConfigurationProvider);

            // sorting Created, last active
            if (!string.IsNullOrEmpty(userFilter.OrderBy))
            {
                if (userFilter.OrderBy == "Created")
                    usersMapped = usersMapped.OrderByDescending(u => u.Created);
                else
                    usersMapped = usersMapped.OrderByDescending(u => u.LastActive);
            }
            return await PaginationUtility<UserForDetailedDto>.CreateAsync(usersMapped, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<PaginationUtility<UserForDetailedDto>> GetUsersLike(PaginationParams paginationParams, UserLikes userLikes)
        {
            IQueryable<User> users = _context.Users.Include(p => p.Photos).Where(u => u.Id != userLikes.UserId);
            if (userLikes.Likers)
            {
                IEnumerable<int> userLiker = await ListUserLikes(userLikes.UserId, userLikes.Likers);
                users = users.Where(u => userLiker.Contains(u.Id));
            }
            if (userLikes.Likees)
            {
                IEnumerable<int> userLikees = await ListUserLikes(userLikes.UserId, userLikes.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            var UserForDetailedDto = _mapper.ProjectTo<UserForDetailedDto>(users);
            return await PaginationUtility<UserForDetailedDto>.CreateAsync(UserForDetailedDto, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Message>> GetMessagesThread(int user_id, int RecipientId)
        {
            return await _context.Messages
         .Include(u => u.Sender).ThenInclude(p => p.Photos)
         .Include(r => r.Recipient).ThenInclude(p => p.Photos)
         .Where(u => u.RecipientId == user_id && u.SenderId == RecipientId && u.SenderDeleted == false
          || u.RecipientId == RecipientId && u.SenderId == user_id && u.RecipientDeleted == false)
         .OrderByDescending(o => o.MessageSent)
         .ToListAsync();
        }

        public async Task<PaginationUtility<Message>> GetMessagesForUser(PaginationParams paginationParams, MessageParams messageParams)
        {
            IQueryable<Message> messages = _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(r => r.Recipient).ThenInclude(p => p.Photos).AsQueryable();
            messages = messageParams.MessageContainer switch
            {
                "inbox" => messages.Where(u => u.RecipientId == messageParams.Userid && u.RecipientDeleted == false),
                "outbox" => messages.Where(u => u.SenderId == messageParams.Userid && u.SenderDeleted == false),
                _ => messages.Where(u => u.RecipientId == messageParams.Userid && u.RecipientDeleted == false && u.IsRead == false),
            };
            messages.OrderByDescending(o => o.MessageSent);
            return await PaginationUtility<Message>.CreateAsync(messages, paginationParams.PageNumber, paginationParams.PageSize);
        }
    }
}