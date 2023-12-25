
using System.Security.Claims;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;

namespace API._Services.Services
{
    public class UserServices : IUserServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDatingServices _datingServices;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserServices(IUnitOfWork unitOfWork, IDatingServices datingServices, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _datingServices = datingServices;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        private int GetUserCurrent()
        {
            string user = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(user);
        }

        public async Task<UserForDetailedDto> GetUser(int id)
        {
            User user = await _datingServices.GetUser(id);
            if (user == null)
                throw new Exception("User not found");
            return _mapper.Map<UserForDetailedDto>(user);
        }

        public async Task<PaginationUtilities<User>> GetUserLikes(PaginationParams pagination, UserLikes userLikes)
        {
            userLikes.user_id = GetUserCurrent();
            return await _datingServices.GetUsersLike(pagination, userLikes);
        }

        public async Task<PaginationUtilities<User>> GetUsers(PaginationParams paginationParams, UserFilter userFilter)
        {
            int user_id = GetUserCurrent();
            User user = await _datingServices.GetUser(user_id);
            userFilter.user_id = user_id;
            if (userFilter.gender == null)
                userFilter.gender = user.gender;
            return await _datingServices.GetUsers(paginationParams, userFilter);
        }

        public async Task<OperationResult> Likes(int userid, int recipientid)
        {
            if (userid != GetUserCurrent())
                throw new Exception("Unauthorization");
            User recipient = await _datingServices.GetUser(recipientid);
            if (recipient == null)
                throw new Exception("recipient not found");
            Like like = await _datingServices.GetLike(userid, recipient.Id);
            if (like != null)
            {
                _unitOfWork.Like.Delete(like);
                if (await _unitOfWork.SaveAll())
                    return new OperationResult { Message = "Unliked" };
            };
            like = new Like
            {
                liker_id = userid,
                likee_id = recipientid
            };

            _unitOfWork.Like.Add(like);
            if (await _unitOfWork.SaveAll())
                return new OperationResult { Message = "Liked" };
            throw new Exception("Failed to like user");
        }

        public async Task<OperationResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != GetUserCurrent())
                throw new Exception("Unauthorization");
            User userFromRepo = await _datingServices.GetUser(id);
            _mapper.Map(userForUpdateDto, userFromRepo);
            if (await _unitOfWork.SaveAll())
                return new OperationResult { IsSuccess = true };
            throw new Exception($"Updating user {id} failed on save");
        }
    }
}