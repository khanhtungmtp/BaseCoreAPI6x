using API.Dtos;
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
        }
    }
}