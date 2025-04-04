using RestaurantAPI.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<DishCategoryDto>> GetAllCategoriesAsync();
        Task<DishCategoryDto?> GetCategoryByIdAsync(int id);
        Task<DishCategoryDto> CreateCategoryAsync(DishCategoryDto categoryDto);
        Task<bool> UpdateCategoryAsync(int id, DishCategoryDto categoryDto);
        Task<bool> DeleteCategoryAsync(int id);
    }
}
