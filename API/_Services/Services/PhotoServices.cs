
using System.Security.Claims;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos.Photo;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API._Services.Services
{
    public class PhotoServices : IPhotoServices
    {
        private readonly IDatingServices _datingServices;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUnitOfWork _repo;
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;
        public PhotoServices(IDatingServices datingServices, IHttpContextAccessor httpContextAccessor, IUnitOfWork repo, IMapper mapper)
        {
            _datingServices = datingServices;
            _httpContextAccessor = httpContextAccessor;
            _repo = repo;
            _mapper = mapper;
            _cloudinary = new Cloudinary("cloudinary://949569834499375:VzAajWOIQYyze8-VI0CjTr-CMdQ@dfuhlrkz1");
            _cloudinary.Api.Secure = true;
        }

        private int GetUserCurrent()
        {
            string user = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(user);
        }
        public async Task<OperationResult> AddPhotoForUser(int userid, PhotoForCreationDto photoForCreationDto)
        {
            if (userid != GetUserCurrent())
                throw new Exception("Unauthorization");
            User user = await _datingServices.GetUser(userid);
            IFormFile file = photoForCreationDto.file;
            // upload image
            ImageUploadResult uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (Stream stream = file.OpenReadStream())
                {
                    ImageUploadParams uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                        .Width(500)
                        .Height(500)
                        .Crop("fill")
                        .Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.url = uploadResult.Url.ToString();
            photoForCreationDto.public_id = uploadResult.PublicId;
            Photo photo = _mapper.Map<Photo>(photoForCreationDto);
            if (!user.photos.Any(u => u.is_main))
                photo.is_main = true;
            user.photos.Add(photo);
            if (await _repo.SaveAll())
            {
                PhotoForReturnDto photo_mapped = _mapper.Map<PhotoForReturnDto>(photo);
                return new OperationResult { Data = photo_mapped, IsSuccess = true };
            }
            throw new Exception("Could not add photo");
        }

        public async Task<OperationResult> DeletePhoto(int userid, int photoid)
        {
            if (userid != GetUserCurrent())
                throw new Exception("Unauthorization");
            User user = await _datingServices.GetUser(userid);
            if (!user.photos.Any(p => p.is_main))
                throw new Exception("Unauthorization");
            Photo photoFromRepo = await _datingServices.GetPhoto(photoid);
            if (photoFromRepo != null)
            {
                if (photoFromRepo.is_main)
                    throw new Exception("You cannot delete your main photo");
                if (photoFromRepo.public_id != null)
                {
                    DeletionParams deleteParams = new DeletionParams(photoFromRepo.public_id);
                    DeletionResult result = _cloudinary.Destroy(deleteParams);
                    if (result.Result == "ok")
                        _repo.Photo.Delete(photoFromRepo);
                }
                else
                    _repo.Photo.Delete(photoFromRepo);
            }
            if (await _repo.SaveAll())
                return new OperationResult { IsSuccess = true, Message = "Delete photo successfully" };
            throw new Exception("Failed to delete the photo");
        }

        public async Task<PhotoForReturnDto> GetPhoto(int id)
        {
            Photo photo = await _datingServices.GetPhoto(id);
            return _mapper.Map<PhotoForReturnDto>(photo);
        }

        public async Task<OperationResult> SetMainPhoto(int userid, int photoid)
        {
            if (userid != GetUserCurrent())
                throw new Exception("Unauthorization");
            User user = await _datingServices.GetUser(userid);
            if (!user.photos.Any(p => p.id == photoid))
                throw new Exception("Unauthorization");
            // lấy hình trong csdl ra để kt hinh do la main chua
            Photo photo = await _datingServices.GetPhoto(photoid);
            if (photo.is_main)
                throw new Exception("This is already the main photo");
            // current main photo selected
            Photo currentMainPhoto = await _datingServices.GetMainPhotoForUser(userid);
            currentMainPhoto.is_main = false;
            // update main cho hinh vua chon
            photo.is_main = true;
            if (await _repo.SaveAll())
                return new OperationResult { IsSuccess = true, Message = "Photo set main successfully" };
            throw new Exception("Could not set photo to main");
        }
    }
}