using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.DTO;
using RestaurantAPI.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // GET: api/cart/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems(int userId)
        {
            var items = await _cartService.GetCartItemsByUserIdAsync(userId);
            return Ok(items);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<ActionResult<CartItemDto>> AddCartItem([FromBody] CartItemDto cartItemDto)
        {
            var addedItem = await _cartService.AddCartItemAsync(cartItemDto);
            return CreatedAtAction(nameof(GetCartItems), new { userId = addedItem.UserId }, addedItem);
        }

        // PUT: api/cart/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] int quantity)
        {
            var updated = await _cartService.UpdateCartItemAsync(id, quantity);
            if (!updated)
                return NotFound();
            return NoContent();
        }

        // DELETE: api/cart/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveCartItem(int id)
        {
            var removed = await _cartService.RemoveCartItemAsync(id);
            if (!removed)
                return NotFound();
            return NoContent();
        }

        // DELETE: api/cart/clear/{userId}
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            var cleared = await _cartService.ClearCartAsync(userId);
            if (!cleared)
                return NotFound();
            return NoContent();
        }
    }
}
