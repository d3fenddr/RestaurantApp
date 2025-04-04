using RestaurantAPI.Data;
using RestaurantAPI.DTO;
using RestaurantAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RestaurantAPI.Services.Interfaces;

namespace RestaurantAPI.Services.Implementations
{
    public class DishService : IDishService
    {
        private readonly ApplicationDbContext _context;

        public DishService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DishDto>> GetAllDishesAsync()
        {
            return await _context.Dishes
                .Select(d => new DishDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    Price = d.Price,
                    DishCategoryId = d.DishCategoryId
                })
                .ToListAsync();
        }

        public async Task<DishDto?> GetDishByIdAsync(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
                return null;

            return new DishDto
            {
                Id = dish.Id,
                Name = dish.Name,
                Description = dish.Description,
                Price = dish.Price,
                DishCategoryId = dish.DishCategoryId
            };
        }

        public async Task<DishDto> CreateDishAsync(DishDto dishDto)
        {
            var dish = new Dish
            {
                Name = dishDto.Name,
                Description = dishDto.Description,
                Price = dishDto.Price,
                DishCategoryId = dishDto.DishCategoryId
            };

            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();
            dishDto.Id = dish.Id;
            return dishDto;
        }

        public async Task<bool> UpdateDishAsync(int id, DishDto dishDto)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
                return false;

            dish.Name = dishDto.Name;
            dish.Description = dishDto.Description;
            dish.Price = dishDto.Price;
            dish.DishCategoryId = dishDto.DishCategoryId;

            _context.Dishes.Update(dish);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDishAsync(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
                return false;

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
