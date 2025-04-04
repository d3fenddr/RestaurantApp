using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.DTO;
using RestaurantAPI.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Controllers
{
    [Route("api/dishes")]
    [ApiController]
    public class DishController : ControllerBase
    {
        private readonly IDishService _dishService;

        public DishController(IDishService dishService)
        {
            _dishService = dishService;
        }

        // GET: api/dishes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DishDto>>> GetAll()
        {
            var dishes = await _dishService.GetAllDishesAsync();
            return Ok(dishes);
        }

        // GET: api/dishes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DishDto>> GetById(int id)
        {
            var dish = await _dishService.GetDishByIdAsync(id);
            if (dish == null)
                return NotFound();

            return Ok(dish);
        }

        // POST: api/dishes
        [HttpPost]
        public async Task<ActionResult<DishDto>> Create([FromBody] DishDto dishDto)
        {
            var createdDish = await _dishService.CreateDishAsync(dishDto);
            return CreatedAtAction(nameof(GetById), new { id = createdDish.Id }, createdDish);
        }

        // PUT: api/dishes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DishDto dishDto)
        {
            var result = await _dishService.UpdateDishAsync(id, dishDto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/dishes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _dishService.DeleteDishAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
