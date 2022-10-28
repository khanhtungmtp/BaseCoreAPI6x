
using System.Security.Claims;
using API._Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers.Utilities
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var actionContext = await next();
            var userid = int.Parse(actionContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var repo = actionContext.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user = await repo.GetUser(userid);
            user.last_active = DateTime.Now;
            await repo.SaveAll();
        }
    }
}