using RestaurantAPI.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services.Interfaces
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> GetCartItemsByUserIdAsync(int userId);
        Task<CartItemDto> AddCartItemAsync(CartItemDto cartItemDto);
        Task<bool> UpdateCartItemAsync(int id, int quantity);
        Task<bool> RemoveCartItemAsync(int id);
        Task<bool> ClearCartAsync(int userId);
    }
}
