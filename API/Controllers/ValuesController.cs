using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private readonly DataContext _dataContext;

        public ValuesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetValues()
        {
            var values = _dataContext.valueTestModels.ToListAsync();
            return Ok(await values);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Value(int id){
            var value = _dataContext.valueTestModels.FirstOrDefaultAsync(x=> x.Id == id);
            return Ok(await value);
        }
    }
}