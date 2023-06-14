using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseAPIController
    {
        private readonly UserManager<User> _userManager;
        public AdminController(UserManager<User> userManager)
        {
            _userManager = userManager;

        }
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUserWithRoles()
        {
            var users = await _userManager.Users.Select(x => new
            {
                Id = x.Id,
                UserName = x.UserName,
                RoleName = x.UserRoles.Select(x => x.Role.Name).ToList()
            }).ToListAsync();
            return Ok(users);
        }
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("photo-with-roles")]
        public ActionResult GetPhotoWithAdminRole()
        {
            return Ok("Only admin can see this photo");
        }
    }
}