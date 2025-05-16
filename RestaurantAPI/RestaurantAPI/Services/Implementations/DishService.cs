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
                    NameEn = d.NameEn,
                    NameRu = d.NameRu,
                    NameAz = d.NameAz,
                    DescriptionEn = d.DescriptionEn,
                    DescriptionRu = d.DescriptionRu,
                    DescriptionAz = d.DescriptionAz,
                    Price = d.Price,
                    DishCategoryId = d.DishCategoryId,
                    ImageUrl = d.ImageUrl
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
                NameEn = dish.NameEn,
                NameRu = dish.NameRu,
                NameAz = dish.NameAz,
                DescriptionEn = dish.DescriptionEn,
                DescriptionRu = dish.DescriptionRu,
                DescriptionAz = dish.DescriptionAz,
                Price = dish.Price,
                DishCategoryId = dish.DishCategoryId,
                ImageUrl = dish.ImageUrl
            };
        }

        public async Task<DishDto> CreateDishAsync(DishDto dishDto)
        {
            var dish = new Dish
            {
                NameEn = dishDto.NameEn,
                NameRu = dishDto.NameRu,
                NameAz = dishDto.NameAz,
                DescriptionEn = dishDto.DescriptionEn,
                DescriptionRu = dishDto.DescriptionRu,
                DescriptionAz = dishDto.DescriptionAz,
                Price = dishDto.Price,
                DishCategoryId = dishDto.DishCategoryId,
                ImageUrl = dishDto.ImageUrl
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

            dish.NameEn = dishDto.NameEn;
            dish.NameRu = dishDto.NameRu;
            dish.NameAz = dishDto.NameAz;
            dish.DescriptionEn = dishDto.DescriptionEn;
            dish.DescriptionRu = dishDto.DescriptionRu;
            dish.DescriptionAz = dishDto.DescriptionAz;
            dish.Price = dishDto.Price;
            dish.DishCategoryId = dishDto.DishCategoryId;

            _context.Dishes.Update(dish);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateImageUrlAsync(int dishId, string imageUrl)
        {
            var dish = await _context.Dishes.FindAsync(dishId);
            if (dish == null)
                return false;

            dish.ImageUrl = imageUrl;
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
