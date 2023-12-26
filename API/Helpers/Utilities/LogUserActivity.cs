
using System.Security.Claims;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Models;
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
            ActionExecutedContext actionContext = await next();
            int userid = int.Parse(actionContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            IDatingServices repo = actionContext.HttpContext.RequestServices.GetService<IDatingServices>();
            User user = await repo.GetUser(userid);
            user.LastActive = DateTime.Now;
            await _repo.SaveAll();
        }
    }
}