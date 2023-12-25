using API.Dtos;
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
            .ForMember(dest => dest.photo_url, opt =>
            {
                opt.MapFrom(src => src.photos.FirstOrDefault(p => p.is_main).url);
            }).ForMember(dest => dest.age, opt =>
            {
                opt.MapFrom(src => src.date_of_birth.CalculateAge());
            });
            CreateMap<User, UserForDetailedDto>()
            .ForMember(dest => dest.photo_url, opt =>
            {
                opt.MapFrom(src => src.photos.FirstOrDefault(p => p.is_main).url);
            }).ForMember(dest => dest.age, opt =>
            {
                opt.MapFrom(src => src.date_of_birth.CalculateAge());
            });
            CreateMap<User, UserForLogedIn>()
            .ForMember(dest => dest.photo_url, opt =>
            {
                opt.MapFrom(src => src.photos.FirstOrDefault(p => p.is_main).url);
            });
            CreateMap<Photo, PhotoForDetailedDto>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>().ReverseMap();
            CreateMap<RegisterUserDto, User>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
            .ForMember(p => p.sender_photo_url, opt => opt.MapFrom(u => u.sender.photos.FirstOrDefault(p => p.is_main).url))
            .ForMember(p => p.recipient_photo_url, opt => opt.MapFrom(u => u.recipient.photos.FirstOrDefault(p => p.is_main).url))
            .ForMember(u => u.sender_known_as, opt => opt.MapFrom(u => u.sender.known_as))
            .ForMember(u => u.recipient_known_as, opt => opt.MapFrom(u => u.recipient.known_as));
        }
    }
}