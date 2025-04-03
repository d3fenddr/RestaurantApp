using Microsoft.AspNetCore.Mvc;
using RestaurantAPI.DTO;
using RestaurantAPI.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound();

            return Ok(order);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<OrderDto>> Create([FromBody] OrderDto orderDto)
        {
            var createdOrder = await _orderService.CreateOrderAsync(orderDto);
            return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, createdOrder);
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrderDto orderDto)
        {
            var result = await _orderService.UpdateOrderAsync(id, orderDto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
