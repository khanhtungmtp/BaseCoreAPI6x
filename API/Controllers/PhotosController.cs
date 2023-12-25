using API._Services.Interfaces;
using API.Dtos.Photo;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/users/{userid}/[controller]")]
    [Authorize]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoServices _photoServices;


        public PhotosController(IPhotoServices photoServices)
        {
            _photoServices = photoServices;
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userid, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            OperationResult result = await _photoServices.AddPhotoForUser(userid, photoForCreationDto);
            return Created(nameof(GetPhoto), result.Data);
        }

        [HttpPost("{photoid}/isMain")]
        public async Task<IActionResult> SetMainPhoto(int userid, int photoid)
        {
            return Ok(await _photoServices.SetMainPhoto(userid, photoid));
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            PhotoForReturnDto photo_mapped = await _photoServices.GetPhoto(id);
            return Ok(photo_mapped);
        }

        [HttpDelete("{photoid}")]
        public async Task<IActionResult> DeletePhoto(int userid, int photoid)
        {
            return Ok(await _photoServices.DeletePhoto(userid, photoid));
        }
    }
}