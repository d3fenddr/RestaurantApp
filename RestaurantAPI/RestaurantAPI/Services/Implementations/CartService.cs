using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.DTO;
using RestaurantAPI.Models;
using RestaurantAPI.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                .Select(ci => new CartItemDto
                {
                    Id = ci.Id,
                    UserId = ci.UserId,
                    DishId = ci.DishId,
                    Quantity = ci.Quantity
                })
                .ToListAsync();
        }

        public async Task<CartItemDto> AddCartItemAsync(CartItemDto cartItemDto)
        {
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == cartItemDto.UserId && ci.DishId == cartItemDto.DishId);

            if (existingItem != null)
            {
                existingItem.Quantity += cartItemDto.Quantity;
                _context.CartItems.Update(existingItem);
                await _context.SaveChangesAsync();
                cartItemDto.Id = existingItem.Id;
                cartItemDto.Quantity = existingItem.Quantity;
                return cartItemDto;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = cartItemDto.UserId,
                    DishId = cartItemDto.DishId,
                    Quantity = cartItemDto.Quantity
                };

                _context.CartItems.Add(cartItem);
                await _context.SaveChangesAsync();
                cartItemDto.Id = cartItem.Id;
                return cartItemDto;
            }
        }

        public async Task<bool> UpdateCartItemAsync(int id, int quantity)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
                return false;

            cartItem.Quantity = quantity;
            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveCartItemAsync(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
                return false;

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cartItems = await _context.CartItems.Where(ci => ci.UserId == userId).ToListAsync();
            if (cartItems == null || !cartItems.Any())
                return false;

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
