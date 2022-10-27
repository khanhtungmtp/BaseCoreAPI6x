
using System.Security.Claims;
using API._Repositories.Interfaces;
using API.Dtos.Photo;
using API.Helpers;
using API.Models;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/users/{userid}/[controller]")]
    [Authorize]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;
        public PhotosController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinary = new Cloudinary("cloudinary://949569834499375:VzAajWOIQYyze8-VI0CjTr-CMdQ@dfuhlrkz1");
            _cloudinary.Api.Secure = true;
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userid, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _repo.GetUser(userid);
            var file = photoForCreationDto.file;
            // upload image
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                        .Width(500)
                        .Height(500)
                        .Crop("fill")
                        .Gravity("face")
                    };
                    // uploadResult = _cloudinary.Upload(uploadParams);
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.url = uploadResult.Url.ToString();
            photoForCreationDto.public_id = uploadResult.PublicId;
            var photo = _mapper.Map<Photo>(photoForCreationDto);
            if (!user.photos.Any(u => u.is_main))
                photo.is_main = true;
            user.photos.Add(photo);
            if (await _repo.SaveAll())
            {
                var photo_mapped = _mapper.Map<PhotoForReturnDto>(photo);
                return Created(nameof(GetPhoto), photo_mapped);
                // return StatusCode(201);
            }
            return BadRequest("Could not add photo");
        }

        [HttpPost("{photoid}/isMain")]
        public async Task<IActionResult> SetMainPhoto(int userid, int photoid)
        {
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _repo.GetUser(userid);
            if (!user.photos.Any(p => p.id == photoid))
                return Unauthorized();
            // lấy hình trong csdl ra để kt hinh do la main chua
            var photo = await _repo.GetPhoto(photoid);
            if (photo.is_main)
                return BadRequest("This is already the main photo");
            // current main photo selected
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userid);
            currentMainPhoto.is_main = false;
            // update main cho hinh vua chon
            photo.is_main = true;
            if (await _repo.SaveAll())
                return NoContent();
            return BadRequest("Could not set photo to main");
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _repo.GetPhoto(id);
            var photo_mapped = _mapper.Map<PhotoForReturnDto>(photo);
            return Ok(photo_mapped);
        }

        [HttpDelete("{photoid}")]
        public async Task<IActionResult> DeletePhoto(int userid, int photoid)
        {
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _repo.GetUser(userid);
            if (!user.photos.Any(p => p.is_main))
                return Unauthorized();
            var photoFromRepo = await _repo.GetPhoto(photoid);
            if (photoFromRepo != null)
            {
                if (photoFromRepo.is_main)
                    return BadRequest("You cannot delete your main photo");
                if (photoFromRepo.public_id != null)
                {
                    var deleteParams = new DeletionParams(photoFromRepo.public_id);
                    var result = _cloudinary.Destroy(deleteParams);
                    if (result.Result == "ok")
                    {
                        _repo.Delete(photoFromRepo);
                    }
                }
                else
                {
                    _repo.Delete(photoFromRepo);
                }
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest("Failed to delete the photo");
        }
    }
}