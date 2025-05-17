using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.DTO;
using RestaurantAPI.Services.Interfaces;
//using System.Collections.Generic;
//using System.Threading.Tasks;

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

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems(int userId)
        {
            var items = await _cartService.GetCartItemsByUserIdAsync(userId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<ActionResult> AddCartItem([FromBody] CartItemDto cartItemDto)
        {
            var addedItem = await _cartService.AddCartItemAsync(cartItemDto);
            var totalQuantity = await _cartService.GetTotalQuantityAsync(addedItem.UserId);

            return Ok(new
            {
                item = addedItem,
                totalQuantity
            });
        }

        [HttpPut("update-quantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateQuantityRequest request)
        {
            var updated = await _cartService.UpdateQuantityAsync(request.UserId, request.DishId, request.Delta);
            if (!updated)
                return NotFound();

            var totalQuantity = await _cartService.GetTotalQuantityAsync(request.UserId);
            return Ok(new { totalQuantity });
        }

        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            var success = await _cartService.ClearCartAsync(userId);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
