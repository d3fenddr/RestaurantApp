using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data; 
using RestaurantAPI.DTO;
using RestaurantAPI.Services.Interfaces;
//using RestaurantAPI.Models;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

namespace RestaurantAPI.Services.Implementations
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartItemDto>> GetCartItemsByUserIdAsync(int userId)
        {
            return await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Dish) 
                .Select(ci => new CartItemDto
                {
                    Id = ci.Id,
                    UserId = ci.UserId,
                    DishId = ci.DishId,
                    Quantity = ci.Quantity,
                    Dish = new DishDto
                    {
                        Id = ci.Dish.Id,
                        NameEn = ci.Dish.NameEn,
                        NameRu = ci.Dish.NameRu,
                        NameAz = ci.Dish.NameAz,
                        DescriptionEn = ci.Dish.DescriptionEn,
                        DescriptionRu = ci.Dish.DescriptionRu,
                        DescriptionAz = ci.Dish.DescriptionAz,
                        Price = ci.Dish.Price,
                        ImageUrl = ci.Dish.ImageUrl,
                        DishCategoryId = ci.Dish.DishCategoryId
                    }
                })
                .ToListAsync();
        }


        public async Task<CartItemDto> AddCartItemAsync(CartItemDto cartItemDto)
        {
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == cartItemDto.UserId && c.DishId == cartItemDto.DishId);

            if (existingItem != null)
            {
                existingItem.Quantity += cartItemDto.Quantity;
                _context.CartItems.Update(existingItem);
            }
            else
            {
                var newItem = new CartItem
                {
                    UserId = cartItemDto.UserId,
                    DishId = cartItemDto.DishId,
                    Quantity = cartItemDto.Quantity
                };
                await _context.CartItems.AddAsync(newItem);
            }

            await _context.SaveChangesAsync();

            return cartItemDto;
        }

        public async Task<bool> UpdateCartItemAsync(int cartItemId, int quantity)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
                return false;

            cartItem.Quantity = quantity;
            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveCartItemAsync(int cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
                return false;

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var items = await _context.CartItems
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!items.Any())
                return false;

            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetTotalQuantityAsync(int userId)
        {
            return await _context.CartItems
                .Where(c => c.UserId == userId)
                .SumAsync(c => c.Quantity);
        }

        public async Task<bool> UpdateQuantityAsync(int userId, int dishId, int delta)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.DishId == dishId);

            if (cartItem == null)
                return false;

            cartItem.Quantity += delta;

            if (cartItem.Quantity <= 0)
                _context.CartItems.Remove(cartItem);
            else
                _context.CartItems.Update(cartItem);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
