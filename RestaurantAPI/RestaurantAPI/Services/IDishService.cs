using RestaurantAPI.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services
{
    public interface IDishService
    {
        Task<IEnumerable<DishDto>> GetAllDishesAsync();
        Task<DishDto?> GetDishByIdAsync(int id);
        Task<DishDto> CreateDishAsync(DishDto dishDto);
        Task<bool> UpdateDishAsync(int id, DishDto dishDto);
        Task<bool> DeleteDishAsync(int id);
    }
}
