using API.Dtos.Message;
using API.Dtos.Photo;
using API.Dtos.User;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;

namespace API.Configurations
{
    public class AutoMapperProfilesConfig : Profile
    {
        public AutoMapperProfilesConfig()
        {
            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            }).ForMember(dest => dest.Age, opt =>
            {
                opt.MapFrom(src => src.DateOfBirth.CalculateAge());
            });
            CreateMap<User, UserForDetailedDto>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            }).ForMember(dest => dest.Age, opt =>
            {
                opt.MapFrom(src => src.DateOfBirth.CalculateAge());
            });
            CreateMap<User, UserForLogedIn>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            });
            CreateMap<Photo, PhotoForDetailedDto>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>().ReverseMap();
            CreateMap<RegisterUserDto, User>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
            .ForMember(p => p.SenderPhotoUrl, opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(p => p.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(u => u.SenderKnownAs, opt => opt.MapFrom(u => u.Sender.KnownAs))
            .ForMember(u => u.RecipientKnownAs, opt => opt.MapFrom(u => u.Recipient.KnownAs));
        }
    }
}