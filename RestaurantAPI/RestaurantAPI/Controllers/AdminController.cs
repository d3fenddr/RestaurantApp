using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace RestaurantAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] User newUser)
        {
            if (newUser == null)
                return BadRequest();

            if (string.IsNullOrWhiteSpace(newUser.PasswordHash))
                return BadRequest("Password is required.");

            newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newUser.PasswordHash);
            newUser.CreatedAt = DateTime.UtcNow;

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.FullName = updatedUser.FullName;
            user.Email = updatedUser.Email;
            user.Role = updatedUser.Role;

            if (!string.IsNullOrWhiteSpace(updatedUser.PasswordHash))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("dishes")]
        public async Task<IActionResult> GetDishes()
        {
            var dishes = await _context.Dishes.ToListAsync();
            return Ok(dishes);
        }

        [HttpPost("dishes")]
        public async Task<IActionResult> CreateDish([FromBody] Dish newDish)
        {
            if (newDish == null)
                return BadRequest();

            _context.Dishes.Add(newDish);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDishes), new { id = newDish.Id }, newDish);
        }

        [HttpPut("dishes/{id}")]
        public async Task<IActionResult> UpdateDish(int id, [FromBody] Dish updatedDish)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null) return NotFound();

            dish.NameEn = updatedDish.NameEn;
            dish.NameRu = updatedDish.NameRu;
            dish.NameAz = updatedDish.NameAz;
            dish.DescriptionEn = updatedDish.DescriptionEn;
            dish.DescriptionRu = updatedDish.DescriptionRu;
            dish.DescriptionAz = updatedDish.DescriptionAz;
            dish.Price = updatedDish.Price;
            dish.ImageUrl = updatedDish.ImageUrl;
            dish.DishCategoryId = updatedDish.DishCategoryId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("dishes/{id}")]
        public async Task<IActionResult> DeleteDish(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null) return NotFound();

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Dish)
                .ToListAsync();
            return Ok(orders);
        }
    }
}
