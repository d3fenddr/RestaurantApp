using RestaurantAPI.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto?> GetOrderByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(OrderDto orderDto);
        Task<bool> UpdateOrderAsync(int id, OrderDto orderDto);
        Task<bool> DeleteOrderAsync(int id);
    }
}
