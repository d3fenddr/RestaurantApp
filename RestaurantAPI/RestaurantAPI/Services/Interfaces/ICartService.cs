using RestaurantAPI.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services.Interfaces
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> GetCartItemsByUserIdAsync(int userId);
        Task<CartItemDto> AddCartItemAsync(CartItemDto cartItemDto);
        Task<bool> UpdateCartItemAsync(int cartItemId, int quantity);
        Task<bool> RemoveCartItemAsync(int cartItemId);
        Task<bool> ClearCartAsync(int userId);

        Task<int> GetTotalQuantityAsync(int userId);
        Task<bool> UpdateQuantityAsync(int userId, int dishId, int delta);
    }
}
