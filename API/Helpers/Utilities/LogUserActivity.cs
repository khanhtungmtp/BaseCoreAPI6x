
using System.Security.Claims;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers.Utilities
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly IUnitOfWork _repo;
        public LogUserActivity(IUnitOfWork repo)
        {
            _repo = repo;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var actionContext = await next();
            var userid = int.Parse(actionContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var repo = actionContext.HttpContext.RequestServices.GetService<IDatingServices>();
            var user = await repo.GetUser(userid);
            user.last_active = DateTime.Now;
            await _repo.SaveAll();
        }
    }
}