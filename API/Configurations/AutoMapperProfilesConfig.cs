
using API.Dtos;
using API.Models;
using AutoMapper;

namespace API.Configurations
{
    public class AutoMapperProfilesConfig : Profile
    {
        public AutoMapperProfilesConfig()
        {
           CreateMap<User, UserForListDto>();
           CreateMap<User, UserForDetailedDto>();     
        }
    }
}