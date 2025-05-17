using RestaurantAPI.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services.Interfaces
{
    public interface IDishService
    {
        Task<IEnumerable<DishDto>> GetAllDishesAsync();
        Task<DishDto?> GetDishByIdAsync(int id);
        Task<DishDto> CreateDishAsync(DishCreateDto dishDto);
        Task<bool> UpdateDishAsync(int id, DishDto dishDto);
        Task<bool> UpdateImageUrlAsync(int dishId, string imageUrl);
        Task<bool> DeleteDishAsync(int id);

    }
}
